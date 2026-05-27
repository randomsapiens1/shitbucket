"use client";
import { useState, useRef, useEffect } from "react";
import { hashColor } from "@/lib/utils";

export default function QuickDump({ onDump, allTags = [] }) {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const ref = useRef(null);
  const containerRef = useRef(null);

  const suggestions = allTags
    .filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t))
    .slice(0, 5);

  function handleDump() {
    const val = ref.current?.value?.trim();
    if (!val) return;
    onDump(val, tags);
    ref.current.value = "";
    setCharCount(0);
    setFocused(false);
    setTags([]);
    setTagInput("");
  }

  function addTag(tag) {
    const t = (tag || tagInput).trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
    setShowSuggestions(false);
  }

  function removeTag(tag) {
    setTags(tags.filter(t => t !== tag));
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative px-4 pt-6" ref={containerRef}>
      <div className="rounded-3xl bg-bucket-card border border-bucket-border p-5 shadow-[0_0_25px_rgba(255,106,0,0.03)]">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-bucket-text">What's in your head?</h2>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-bucket-text-dim">Write it down. Get it out.</p>
            <span className="text-[11px] text-bucket-muted">{charCount} / 500</span>
          </div>
        </div>

        <textarea
          ref={ref}
          rows={3}
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
          className="w-full rounded-2xl bg-bucket-bg px-4 py-4 text-bucket-text resize-none outline-none placeholder:text-bucket-muted transition-all text-[14px] leading-relaxed"
          style={{
            border:    `2px solid ${focused ? "var(--bucket-accent)" : "var(--bucket-border)"}`,
            boxShadow: focused ? "0 0 20px rgba(255,106,0,0.08)" : "none",
          }}
        />

        {/* Tags UI */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(t => (
              <span 
                key={t} 
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold"
                style={{ background: hashColor(t) + "20", color: hashColor(t), border: `1px solid ${hashColor(t)}40` }}
              >
                {t}
                <button onClick={() => removeTag(t)} className="ml-1 opacity-50 hover:opacity-100">×</button>
              </span>
            ))}
          </div>
          
          <div className="relative">
            <input
              className="w-full bg-bucket-bg border border-bucket-border rounded-xl px-4 py-2.5 text-[13px] text-bucket-text outline-none focus:border-bucket-border-hover transition placeholder:text-bucket-muted"
              placeholder="Add tags (press Enter)..."
              value={tagInput}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setTagInput(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-bucket-card border border-bucket-border rounded-xl py-2 z-50 shadow-2xl">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => addTag(s)}
                    className="w-full text-left px-4 py-2 text-[13px] text-bucket-text-dim hover:bg-bucket-bg hover:text-bucket-text transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleDump}
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-bucket-accent px-6 py-3.5 font-bold text-black hover:brightness-110 transition shadow-[0_0_25px_rgba(255,106,0,0.18)] text-[14px]"
        >
          🪣 Dump in bucket
        </button>
      </div>
    </div>
  );
}
