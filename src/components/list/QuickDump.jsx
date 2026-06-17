"use client";
import { useState, useRef, useEffect } from "react";

export default function QuickDump({ onDump, allTags = [], allTopics = [] }) {
  const [charCount, setCharCount] = useState(0);
  const [tagInput, setTagInput]   = useState("");
  const [tags, setTags]           = useState([]);
  const [expiry, setExpiry]       = useState("forever");
  const [topic, setTopic]         = useState("General");
  const [isNewTopic, setIsNewTopic] = useState(false);
  const [newTopic, setNewTopic]   = useState("");
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

    const selectedTopic = isNewTopic ? newTopic.trim() || "General" : topic;
    onDump(val, tags, expiresAt, selectedTopic);
    ref.current.value = "";
    setCharCount(0);
    setTags([]);
    setTagInput("");
    setExpiry("forever");
    setIsNewTopic(false);
    setNewTopic("");
  }

  function addTag(tag) {
    const t = (tag || tagInput).trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
    setShowSuggestions(false);
  }

  function toggleChecklist() {
    const textarea = ref.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const value = textarea.value;
    
    const linesBefore = value.substring(0, start).split("\n");
    const currentLineIndex = linesBefore.length - 1;
    const allLines = value.split("\n");
    const currentLine = allLines[currentLineIndex];

    if (currentLine.startsWith("- [ ] ")) {
      // Remove checklist prefix
      allLines[currentLineIndex] = currentLine.substring(6);
      textarea.value = allLines.join("\n");
      const newPos = Math.max(0, start - 6);
      textarea.setSelectionRange(newPos, newPos);
    } else {
      // Add checklist prefix
      allLines[currentLineIndex] = "- [ ] " + currentLine;
      textarea.value = allLines.join("\n");
      const newPos = start + 6;
      textarea.setSelectionRange(newPos, newPos);
    }
    
    textarea.focus();
    setCharCount(textarea.value.length);
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
      <div className="rounded-3xl bg-white border-2 border-black shadow-hard sm:p-5 p-4">

        {/* Header row */}
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-[calc((15/12)*var(--base-font-size))] font-extrabold text-black">what are you thinking?</h2>
          <span className="text-[calc((11/12)*var(--base-font-size))] font-bold text-black/40">{charCount}/500</span>
        </div>

        {/* Textarea */}
        <div className="relative group/textarea">
          <textarea
            ref={ref}
            rows={5}
            maxLength={500}
            placeholder="write it down..."
            onChange={(e) => setCharCount(e.target.value.length)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { 
                const value = ref.current.value;
                const start = ref.current.selectionStart;
                const linesBefore = value.substring(0, start).split("\n");
                const currentLine = linesBefore[linesBefore.length - 1];

                if (currentLine.startsWith("- [ ] ")) {
                  e.preventDefault();
                  if (currentLine.trim() === "- [ ]") {
                    // If line is only the prefix, toggle it off and finish
                    const before = value.substring(0, start - currentLine.length);
                    const after = value.substring(start);
                    ref.current.value = before + (after.startsWith("\n") ? after.substring(1) : after);
                    ref.current.setSelectionRange(before.length, before.length);
                    setCharCount(ref.current.value.length);
                  } else {
                    // Continue checklist on new line
                    const before = value.substring(0, start);
                    const after = value.substring(start);
                    const added = "\n- [ ] ";
                    ref.current.value = before + added + after;
                    ref.current.setSelectionRange(start + added.length, start + added.length);
                    setCharCount(ref.current.value.length);
                  }
                } else {
                  e.preventDefault(); 
                  handleDump(); 
                }
              }
            }}
            className="w-full rounded-2xl border-2 border-black bg-[#FFF8EE] px-4 py-4 text-black font-bold resize-none outline-none placeholder:text-black/30 text-[calc((15/12)*var(--base-font-size))] leading-relaxed focus:border-black transition"
          />
          <button
            type="button"
            onClick={toggleChecklist}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/5 hover:bg-black/10 transition-colors text-black/40 hover:text-black"
            title="Create checklist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
              <circle cx="4" cy="6" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="4" cy="18" r="1.5" />
            </svg>
          </button>
        </div>

        {/* Topic Selection */}
        <div className="mt-4">
          <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.12em] text-black/40 mb-2">Topic</p>
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1 no-scrollbar">
            {["General", ...allTopics.filter(t => t !== "General")].slice(0, 4).map(t => (
              <button
                key={t}
                onClick={() => { setTopic(t); setIsNewTopic(false); }}
                className="px-3 py-1.5 rounded-xl text-[calc((11/12)*var(--base-font-size))] font-extrabold border-2 border-black whitespace-nowrap"
                style={{
                  background: !isNewTopic && topic === t ? "#FF6A00" : "#fff",
                  color:      !isNewTopic && topic === t ? "#fff" : "#000",
                }}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => setIsNewTopic(true)}
              className="px-3 py-1.5 rounded-xl text-[calc((11/12)*var(--base-font-size))] font-extrabold border-2 border-black whitespace-nowrap"
              style={{
                background: isNewTopic ? "#FF6A00" : "#fff",
                color:      isNewTopic ? "#fff" : "#000",
              }}
            >
              + custom
            </button>
          </div>
          {isNewTopic && (
            <input
              className="w-full bg-[#FFF8EE] border-2 border-black rounded-xl px-4 py-2 text-[calc((13/12)*var(--base-font-size))] font-bold text-black outline-none placeholder:text-black/30 mb-2 focus:bg-white transition"
              placeholder="name your topic..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              autoFocus
            />
          )}
        </div>

        {/* Expiry */}
        <div className="mt-4">
          <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.12em] text-black/40 mb-2">expires</p>
          <div className="flex gap-2 flex-wrap">
            {EXPIRY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setExpiry(opt.value)}
                className="px-3 py-1.5 rounded-xl text-[calc((11/12)*var(--base-font-size))] font-extrabold border-2 border-black transition-all shadow-hard-sm active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
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
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[calc((11/12)*var(--base-font-size))] font-extrabold bg-black text-white border-2 border-black break-all"
                >
                  {t}
                  <button onClick={() => setTags(tags.filter(x => x !== t))} className="opacity-60 hover:opacity-100 ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}

          <div className="relative">
            <input
              className="w-full bg-[#FFF8EE] border-2 border-black rounded-xl px-4 py-2.5 text-[calc((13/12)*var(--base-font-size))] font-bold text-black outline-none placeholder:text-black/30 focus:bg-white transition"
              placeholder="+ add tag (press Enter)"
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
                    className="w-full text-left px-4 py-2.5 text-[calc((13/12)*var(--base-font-size))] font-bold text-black hover:bg-[#CAFF00] transition-colors"
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
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-black text-white px-6 py-3.5 font-extrabold text-[calc((14/12)*var(--base-font-size))] border-2 border-black shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white"
        >
          dump it
        </button>
      </div>
    </div>
  );
}
