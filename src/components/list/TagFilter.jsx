import { hashColor } from "@/lib/utils";

export default function TagFilter({ tags, activeTag, onSelect }) {
  return (
    <div className="flex gap-1.5 px-4 pt-5 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className="shrink-0 border rounded-full px-3.5 py-1.5 text-[11px] transition"
        style={{
          background:   !activeTag ? "#ff6a0018"  : "transparent",
          borderColor:  !activeTag ? "#ff6a0040"  : "#222",
          color:        !activeTag ? "#ff6a00"    : "#666",
        }}
      >
        all
      </button>

      {tags.map(t => (
        <button
          key={t}
          onClick={() => onSelect(activeTag === t ? null : t)}
          className="shrink-0 border rounded-full px-3.5 py-1.5 text-[11px] transition"
          style={{
            background:  activeTag === t ? hashColor(t) + "18" : "transparent",
            borderColor: activeTag === t ? hashColor(t) + "40" : "#222",
            color:       activeTag === t ? hashColor(t)        : "#666",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
