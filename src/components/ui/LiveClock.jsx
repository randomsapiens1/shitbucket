"use client";
import { useState, useEffect } from "react";

function getTimeOfDayIcon(hour) {
  if (hour >= 5  && hour < 12) return "☀";
  if (hour >= 12 && hour < 17) return "◑";
  if (hour >= 17 && hour < 21) return "◐";
  return "●";
}

export default function LiveClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return (
      <div
        className="mx-4 my-3 rounded-[32px]"
        style={{ height: 130, background: "#111111" }}
      />
    );
  }

  const h24     = now.getHours();
  const hours   = String(h24 % 12 || 12).padStart(2, "0");
  const mins    = String(now.getMinutes()).padStart(2, "0");
  const ampm    = h24 >= 12 ? "PM" : "AM";
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const month   = now.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day     = String(now.getDate()).padStart(2, "0");
  const icon    = getTimeOfDayIcon(h24);

  return (
    <div className="mx-4 my-3">
      <div
        className="flex items-center transition-transform duration-300 hover:-translate-y-[3px]"
        style={{
          borderRadius: 32,
          padding: "28px 32px",
          minHeight: 120,
          background: "linear-gradient(145deg, #111111 0%, #1a1a1a 100%)",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.2), 0 3px 10px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.055)",
          border: "1px solid rgba(255,255,255,0.055)",
        }}
      >

        {/* ── LEFT: Time (65%) ── */}
        <div style={{ flex: "0 0 65%" }}>
          <div className="flex items-baseline" style={{ gap: 10 }}>
            <span
              className="tabular-nums leading-none select-none"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 68,
                fontWeight: 800,
                color: "#F5F3EE",
                letterSpacing: "-0.03em",
                textShadow: "0 0 80px rgba(245,243,238,0.07)",
              }}
            >
              {hours}:{mins}
            </span>
            <span
              className="leading-none select-none"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 15,
                fontWeight: 600,
                color: "rgba(245,243,238,0.28)",
                letterSpacing: "0.06em",
                paddingBottom: 6,
              }}
            >
              {ampm}
            </span>
          </div>
        </div>

        {/* ── CENTER: Divider ── */}
        <div
          className="self-stretch shrink-0"
          style={{
            width: 1,
            background: "rgba(255,255,255,0.12)",
            margin: "0 28px",
          }}
        />

        {/* ── RIGHT: Date (35%) ── */}
        <div
          className="flex-1 flex flex-col justify-center items-end"
          style={{ gap: 5 }}
        >
          {/* Icon + weekday on same row */}
          <div className="flex items-center gap-2">
            <span
              className="select-none"
              style={{ fontSize: 12, color: "rgba(245,243,238,0.3)", lineHeight: 1 }}
            >
              {icon}
            </span>
            <span
              className="leading-none"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                color: "#FF7A00",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              {weekday}
            </span>
          </div>

          {/* Month + day */}
          <span
            className="leading-none"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 22,
              fontWeight: 800,
              color: "#F5F3EE",
              letterSpacing: "-0.01em",
            }}
          >
            {month} {day}
          </span>
        </div>

      </div>
    </div>
  );
}
