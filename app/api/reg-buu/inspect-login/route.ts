import { NextResponse } from "next/server";
import { REG_BUU } from "@/lib/reg-buu/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readAttribute(source: string, name: string) {
  const match = source.match(
    new RegExp(\`(?:^|\\s)\${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))\`, "i")
  );
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

/**
 * Returns only public login-form metadata. Never returns input values,
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
    const forms: Array<{
      action: string;
      method: string;
      inputs: Array<{
        name: string | null;
        id: string | null;
        type: string;
        autocomplete: string | null;
      }>;
    }> = [];

    for (const match of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form\s*>/gi)) {
      const attributes = match[1] ?? "";
      const body = match[2] ?? "";
      const rawAction = readAttribute(attributes, "action");
      const inputs = Array.from(body.matchAll(/<input\b([^>]*)>/gi)).map((input) => {
        const attrs = input[1] ?? "";
        return {
          name: readAttribute(attrs, "name"),
          id: readAttribute(attrs, "id"),
          type: (readAttribute(attrs, "type") ?? "text").toLowerCase(),
          autocomplete: readAttribute(attrs, "autocomplete")
        };
      });

      forms.push({
        action: rawAction ? new URL(rawAction, response.url).toString() : response.url,
        method: (readAttribute(attributes, "method") ?? "get").toLowerCase(),
        inputs
      });
    }

    return NextResponse.json(
      {
        inspected: true,
        pageUrl: response.url,
        formCount: forms.length,
        forms
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
