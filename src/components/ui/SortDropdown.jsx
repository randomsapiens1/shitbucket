"use client";
import { useState, useEffect, useRef } from "react";

const OPTIONS = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "brew",   label: "Most brewed"  },
  { key: "alpha",  label: "A-Z"          },
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
        className="flex items-center gap-1.5 text-[12px] text-bucket-text-dim bg-bucket-card border border-bucket-border rounded-lg px-3 py-1.5 hover:border-bucket-border-hover transition"
      >
        {current}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-bucket-card border border-bucket-border rounded-lg py-1 z-50 min-w-[120px]">
          {OPTIONS.map(o => (
            <button
              key={o.key}
              onClick={() => { onChange(o.key); setOpen(false); }}
              className={`block w-full text-left px-3 py-1.5 text-[12px] transition ${
                value === o.key ? "text-bucket-accent" : "text-bucket-text-dim hover:text-bucket-text"
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
