import { hashColor } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export default function TagsSection({ tags, allTags = [], newTag, setNewTag, onAdd, onRemove }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  const suggestions = allTags
    .filter(t => t.toLowerCase().includes(newTag.toLowerCase()) && !(tags || []).includes(t))
    .slice(0, 5);

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
    <div className="mb-8" ref={containerRef}>
      <div className="flex flex-wrap gap-2 items-center">
        {(tags || []).map(t => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full font-bold tracking-tight transition-all hover:brightness-110"
            style={{
              background: hashColor(t) + "20",
              color:      hashColor(t),
              border:    `1px solid ${hashColor(t)}40`,
              boxShadow: `0 0 10px ${hashColor(t)}10`,
            }}
          >
            {t}
            <button 
              onClick={() => onRemove(t)} 
              className="opacity-40 hover:opacity-100 text-[16px] leading-none ml-1 -mt-0.5"
            >
              ×
            </button>
          </span>
        ))}
        
        <div className="relative">
          <input
            className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-full px-4 py-1.5 text-zinc-400 text-[11px] font-medium outline-none w-28 focus:border-[#333] focus:text-zinc-200 transition-all placeholder:text-zinc-700"
            placeholder="+ tag"
            value={newTag}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setNewTag(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAdd();
                setShowSuggestions(false);
              }
            }}
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-[#0d0d0d] border border-[#222] rounded-xl py-2 z-50 shadow-2xl backdrop-blur-sm">
              <div className="px-3 pb-1 mb-1 border-b border-[#222] text-[9px] text-zinc-600 uppercase font-bold tracking-widest">
                Suggestions
              </div>
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setNewTag(s);
                    onAdd(s); // Note: addTag in DetailView uses newTag state, but we can pass it or just let it use state
                    setShowSuggestions(false);
                    // DetailView's addTag doesn't take an argument, so we update state then call it
                    // Actually, let's update it to be more robust
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-zinc-400 hover:bg-[#1a1a1a] hover:text-white transition-colors"
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
