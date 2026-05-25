"use client";
import { useState, useRef } from "react";

export default function QuickDump({ onDump }) {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const ref = useRef(null);

  function handleDump() {
    const val = ref.current?.value?.trim();
    if (!val) return;
    onDump(val);
    ref.current.value = "";
    setCharCount(0);
    setFocused(false);
  }

  return (
    <div className="relative px-4 pt-6">
      <div className="rounded-3xl bg-[#0d0d0d] border border-[#1a1a1a] p-5 shadow-[0_0_25px_rgba(255,106,0,0.03)]">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-white">What's in your head?</h2>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-zinc-500">Write it down. Get it out.</p>
            <span className="text-[11px] text-zinc-600">{charCount} / 500</span>
          </div>
        </div>

        <textarea
          ref={ref}
          rows={4}
          maxLength={500}
          placeholder="Type your idea here..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setCharCount(e.target.value.length)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleDump();
            }
          }}
          className="w-full rounded-2xl bg-black px-4 py-4 text-white resize-none outline-none placeholder:text-zinc-700 transition-all text-[14px] leading-relaxed"
          style={{
            border:    `2px solid ${focused ? "#ff6a00" : "#1a1a1a"}`,
            boxShadow: focused ? "0 0 20px rgba(255,106,0,0.08)" : "none",
          }}
        />

        <button
          onClick={handleDump}
          className="mt-4 ml-auto flex items-center gap-2 rounded-2xl bg-[#ff6a00] px-6 py-3 font-semibold text-black hover:brightness-110 transition shadow-[0_0_25px_rgba(255,106,0,0.18)] text-[14px]"
        >
          🪣 Dump in bucket
        </button>
      </div>
    </div>
  );
}
