export default function TagFilter({ tags, activeTag, onSelect }) {
  return (
    <div className="flex gap-2 px-4 pt-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
      <button
        onClick={() => onSelect(null)}
        className="shrink-0 border-2 border-black rounded-xl px-3.5 py-1.5 text-[calc((11/12)*var(--base-font-size))] font-extrabold transition-all shadow-hard-sm active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
        style={{
          background: !activeTag ? "#000" : "#fff",
          color:      !activeTag ? "#fff" : "#000",
        }}
      >
        all
      </button>

      {tags.map(t => (
        <button
          key={t}
          onClick={() => onSelect(activeTag === t ? null : t)}
          className="shrink-0 border-2 border-black rounded-xl px-3.5 py-1.5 text-[calc((11/12)*var(--base-font-size))] font-extrabold transition-all shadow-hard-sm active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
          style={{
            background: activeTag === t ? "#000" : "#fff",
            color:      activeTag === t ? "#fff" : "#000",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
