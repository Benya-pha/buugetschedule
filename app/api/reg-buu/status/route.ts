import { NextResponse } from "next/server";
import { REG_BUU } from "@/lib/reg-buu/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checkedAt = new Date().toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(REG_BUU.homeUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent": "buugetschedule/0.1 (REG BUU availability check)"
      }
    });

    return NextResponse.json(
      {
        service: "REG BUU",
        reachable: response.ok,
        status: response.status,
        checkedAt,
        source: response.url
      },
      {
        status: response.ok ? 200 : 502,
        headers: { "Cache-Control": "no-store" }
      }
    );
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError");

    return NextResponse.json(
      {
        service: "REG BUU",
        reachable: false,
        reason: timedOut ? "timeout" : "network_error",
        checkedAt
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" }
      }
    );
  } finally {
    clearTimeout(timeout);
  }
}
