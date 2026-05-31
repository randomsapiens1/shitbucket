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
        className="mx-4 mb-2 rounded-[20px]"
        style={{ height: 64, background: "#111111" }}
      />
    );
  }

  const h24     = now.getHours();
  const hours   = String(h24 % 12 || 12).padStart(2, "0");
  const mins    = String(now.getMinutes()).padStart(2, "0");
  const ampm    = h24 >= 12 ? "PM" : "AM";
  const weekday = now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const month   = now.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day     = String(now.getDate()).padStart(2, "0");
  const icon    = getTimeOfDayIcon(h24);

  return (
    <div className="mx-4 mb-2">
      <div
        className="flex items-center transition-transform duration-300 hover:-translate-y-[2px]"
        style={{
          height: 64,
          borderRadius: 20,
          padding: "0 20px",
          background: "linear-gradient(145deg, #111111 0%, #1a1a1a 100%)",
          boxShadow:
            "0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.055)",
          border: "1px solid rgba(255,255,255,0.055)",
        }}
      >

        {/* ── LEFT: Time ── */}
        <div className="flex items-baseline shrink-0" style={{ gap: 6 }}>
          <span
            className="tabular-nums leading-none select-none"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 36,
              fontWeight: 800,
              color: "#F5F3EE",
              letterSpacing: "-0.03em",
              textShadow: "0 0 60px rgba(245,243,238,0.07)",
            }}
          >
            {hours}:{mins}
          </span>
          <span
            className="leading-none select-none"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(245,243,238,0.28)",
              letterSpacing: "0.06em",
              paddingBottom: 4,
            }}
          >
            {ampm}
          </span>
        </div>

        {/* ── CENTER: Divider ── */}
        <div
          className="self-stretch shrink-0"
          style={{
            width: 1,
            background: "rgba(255,255,255,0.12)",
            margin: "0 16px",
          }}
        />

        {/* ── RIGHT: Date ── */}
        <div
          className="flex-1 min-w-0 flex flex-col justify-center items-end overflow-hidden"
          style={{ gap: 4 }}
        >
          {/* Icon + weekday */}
          <div className="flex items-center gap-1.5 w-full justify-end">
            <span
              className="select-none shrink-0"
              style={{ fontSize: 10, color: "rgba(245,243,238,0.3)", lineHeight: 1 }}
            >
              {icon}
            </span>
            <span
              className="leading-none truncate"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                fontWeight: 700,
                color: "#FF7A00",
                letterSpacing: "0.14em",
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
              fontSize: 15,
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
