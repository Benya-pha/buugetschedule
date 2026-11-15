"use client";

import { useEffect } from "react";

type AppError = Error & { digest?: string };

export default function AppErrorBoundary({
  error,
  reset
}: {
  error: AppError;
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the technical error out of the UI; the boundary provides recovery.
    if (process.env.NODE_ENV === "development") {
      console.error("Application route error:", error);
    }
  }, [error]);

  return (
    <main
      role="alert"
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f5f7f5",
        color: "#303a34",
        fontFamily: '"Prompt", "Noto Sans Thai", sans-serif'
      }}
    >
      <section style={{ width: "min(100%, 420px)", textAlign: "center" }}>
        <p style={{ margin: "0 0 10px", color: "#879d8d", fontSize: 12, letterSpacing: ".12em" }}>
          BUUGETSCHEDULE
        </p>
        <h1 style={{ margin: "0 0 12px", fontSize: 25, fontWeight: 600 }}>
          เกิดข้อผิดพลาดชั่วคราว
        </h1>
        <p style={{ margin: "0 auto 24px", color: "#758078", fontSize: 14, lineHeight: 1.8 }}>
          หน้านี้ไม่สามารถแสดงผลได้ในขณะนี้ ลองโหลดส่วนนี้อีกครั้งได้เลย
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            minHeight: 44,
            padding: "0 22px",
            border: 0,
            borderRadius: 12,
            background: "#879d8d",
            color: "#fff",
            font: "inherit",
            fontSize: 14,
            cursor: "pointer"
          }}
        >
          ลองอีกครั้ง
        </button>
      </section>
    </main>
  );
}
