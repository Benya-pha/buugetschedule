import { NextResponse } from "next/server";
import { REG_BUU } from "@/lib/reg-buu/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readAttribute(source: string, name: string) {
  const pattern =
    "(?:^|\\s)" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))";
  const match = source.match(new RegExp(pattern, "i"));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function describeControls(source: string) {
  const controls: Array<Record<string, string | number | null>> = [];

  for (const match of source.matchAll(/<(input|select|textarea|button)\b([^>]*)>/gi)) {
    const tag = match[1].toLowerCase();
    const attrs = match[2] ?? "";
    controls.push({
      tag,
      name: readAttribute(attrs, "name"),
      id: readAttribute(attrs, "id"),
      type: tag === "input"
        ? (readAttribute(attrs, "type") ?? "text").toLowerCase()
        : tag === "button"
          ? (readAttribute(attrs, "type") ?? "submit").toLowerCase()
          : null,
      autocomplete: readAttribute(attrs, "autocomplete"),
      optionCount: tag === "select"
        ? ((source.slice(match.index ?? 0).match(/<option\b/gi) ?? []).length)
        : null
    });
  }

  return controls;
}

/**
 * Returns public login page structure only. Never returns input values,
 * cookies, response bodies, or student information.
 */
export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(REG_BUU.loginPageUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent": "buugetschedule/0.1 (public REG BUU form inspection)"
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { inspected: false, reason: "upstream_http_error", status: response.status },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const html = await response.text();
    const forms = Array.from(html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form\s*>/gi))
      .map((match) => {
        const attrs = match[1] ?? "";
        const body = match[2] ?? "";
        const rawAction = readAttribute(attrs, "action");
        return {
          id: readAttribute(attrs, "id"),
          name: readAttribute(attrs, "name"),
          action: rawAction ? new URL(rawAction, response.url).toString() : response.url,
          method: (readAttribute(attrs, "method") ?? "get").toLowerCase(),
          enctype: readAttribute(attrs, "enctype"),
          controls: describeControls(body)
        };
      });

    const scripts = Array.from(html.matchAll(/<script\b([^>]*)>/gi))
      .map((match) => readAttribute(match[1] ?? "", "src"))
      .filter((src): src is string => Boolean(src));

    return NextResponse.json(
      {
        inspected: true,
        pageUrl: response.url,
        documentLength: html.length,
        formCount: forms.length,
        forms,
        pageControls: describeControls(html),
        externalScripts: scripts
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError");

    return NextResponse.json(
      { inspected: false, reason: timedOut ? "timeout" : "network_error" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  } finally {
    clearTimeout(timeout);
  }
}
