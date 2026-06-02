import { useState, useRef, useEffect } from "react";

export default function TagsSection({ tags, allTags = [], newTag, setNewTag, onAdd, onRemove }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  const suggestions = allTags
    .filter(t => t.toLowerCase().includes(newTag.toLowerCase()) && !(tags || []).includes(t))
    .slice(0, 5);

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
    <div className="mb-5" ref={containerRef}>
      <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.15em] text-black mb-2">tags</p>
      <div className="flex flex-wrap gap-2 items-center">
        {(tags || []).map(t => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[calc((11/12)*var(--base-font-size))] font-extrabold bg-black text-white border-2 border-black shadow-hard-sm"
          >
            {t}
            <button
              onClick={() => onRemove(t)}
              className="opacity-50 hover:opacity-100 text-[calc((14/12)*var(--base-font-size))] leading-none ml-0.5"
            >
              ×
            </button>
          </span>
        ))}

        <div className="relative">
          <input
            className="bg-white border-2 border-black rounded-full px-4 py-1.5 text-black text-[calc((11/12)*var(--base-font-size))] font-extrabold outline-none w-28 placeholder:text-black/30 focus:bg-[#FFF8EE] transition"
            placeholder="+ tag"
            value={newTag}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => { setNewTag(e.target.value); setShowSuggestions(true); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { onAdd(); setShowSuggestions(false); }
            }}
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-white border-2 border-black rounded-xl py-1 z-50 shadow-hard">
              <p className="px-3 pb-1 mb-1 border-b border-black/10 text-[calc((9/12)*var(--base-font-size))] text-black/40 font-extrabold uppercase tracking-widest">
                Suggestions
              </p>
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => { setNewTag(s); onAdd(s); setShowSuggestions(false); }}
                  className="w-full text-left px-3 py-2 text-[calc((12/12)*var(--base-font-size))] font-bold text-black hover:bg-[#FF6A00] hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
