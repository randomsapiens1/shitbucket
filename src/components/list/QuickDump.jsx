"use client";
import { useState, useRef, useEffect } from "react";

export default function QuickDump({ onDump, allTags = [] }) {
  const [charCount, setCharCount] = useState(0);
  const [tagInput, setTagInput]   = useState("");
  const [tags, setTags]           = useState([]);
  const [expiry, setExpiry]       = useState("forever");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ref          = useRef(null);
  const containerRef = useRef(null);

  const EXPIRY_OPTIONS = [
    { label: "∞",      value: "forever" },
    { label: "24h",    value: "24h"     },
    { label: "48h",    value: "48h"     },
    { label: "1 week", value: "1w"      },
  ];

  const suggestions = allTags
    .filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t))
    .slice(0, 5);

  useEffect(() => {
    // Auto-focus the textarea on mount for speed
    if (ref.current) ref.current.focus();
  }, []);

  function handleDump() {
    const val = ref.current?.value?.trim();
    if (!val) return;

    let expiresAt = null;
    const now = new Date();
    if (expiry === "24h") expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    if (expiry === "48h") expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
    if (expiry === "1w")  expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    onDump(val, tags, expiresAt);
    ref.current.value = "";
    setCharCount(0);
    setTags([]);
    setTagInput("");
    setExpiry("forever");
  }

  function addTag(tag) {
    const t = (tag || tagInput).trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
    setShowSuggestions(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative px-4 pt-5" ref={containerRef}>
      <div className="rounded-3xl bg-white border-2 border-black shadow-hard p-5">

        {/* Header row */}
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-[15px] font-extrabold text-black">what are you thinking?</h2>
          <span className="text-[11px] font-bold text-black/40">{charCount}/500</span>
        </div>

        {/* Textarea */}
        <textarea
          ref={ref}
          rows={6}
          maxLength={500}
          placeholder="write it down..."
          onChange={(e) => setCharCount(e.target.value.length)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleDump(); }
          }}
          className="w-full rounded-2xl border-2 border-black bg-[#FFF8EE] px-4 py-4 text-black font-bold resize-none outline-none placeholder:text-black/30 text-[15px] leading-relaxed focus:border-black transition"
        />

        {/* Expiry */}
        <div className="mt-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-black/40 mb-2">expires</p>
          <div className="flex gap-2 flex-wrap">
            {EXPIRY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setExpiry(opt.value)}
                className="px-3 py-1.5 rounded-xl text-[11px] font-extrabold border-2 border-black transition-all shadow-hard-sm active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                style={{
                  background: expiry === opt.value ? "#000" : "#fff",
                  color:      expiry === opt.value ? "#fff" : "#000",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-black text-white border-2 border-black"
                >
                  {t}
                  <button onClick={() => setTags(tags.filter(x => x !== t))} className="opacity-60 hover:opacity-100 ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}

          <div className="relative">
            <input
              className="w-full bg-[#FFF8EE] border-2 border-black rounded-xl px-4 py-2.5 text-[13px] font-bold text-black outline-none placeholder:text-black/30 focus:bg-white transition"
              placeholder="+ add topic (press Enter)"
              value={tagInput}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => { setTagInput(e.target.value); setShowSuggestions(true); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-white border-2 border-black rounded-xl py-1 z-50 shadow-hard">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => addTag(s)}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-black hover:bg-[#CAFF00] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dump button */}
        <button
          onClick={handleDump}
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-black text-white px-6 py-3.5 font-extrabold text-[14px] border-2 border-black shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white"
        >
          🪣 dump it
        </button>
      </div>
    </div>
  );
}
