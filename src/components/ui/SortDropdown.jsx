"use client";
import { useState, useEffect, useRef } from "react";

const OPTIONS = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "alpha",  label: "A–Z Alpha"    },
  { key: "manual", label: "Custom order" },
];

export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = OPTIONS.find(o => o.key === value)?.label ?? "Newest first";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[calc((12/12)*var(--base-font-size))] font-extrabold text-black bg-white border-2 border-black rounded-xl px-3 py-1.5 shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
      >
        {current}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border-2 border-black rounded-2xl py-1.5 z-50 min-w-[140px] shadow-hard">
          {OPTIONS.map(o => (
            <button
              key={o.key}
              onClick={() => { onChange(o.key); setOpen(false); }}
              className={`block w-full text-left px-4 py-2.5 text-[calc((12/12)*var(--base-font-size))] font-extrabold transition-colors ${
                value === o.key
                  ? "bg-[#FF6A00] text-white"
                  : "text-black hover:bg-[#FF6A00] hover:text-white"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
