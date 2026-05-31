"use client";
import { useState, useEffect } from "react";

export default function LiveClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return <div className="h-12 border-b-2 border-black bg-[#FFF8EE]" />;
  }

  const time = now
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase();

  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
  });

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black bg-[#FFF8EE]">
      <span className="text-[18px] font-extrabold tabular-nums tracking-tight text-black">
        {time}
      </span>
      <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-black/50">
        {date}
      </span>
    </div>
  );
}
