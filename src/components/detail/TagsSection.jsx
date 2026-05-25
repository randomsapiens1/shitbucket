import { hashColor } from "@/lib/utils";

export default function TagsSection({ tags, newTag, setNewTag, onAdd, onRemove }) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 items-center">
        {(tags || []).map(t => (
          <span
            key={t}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-medium"
            style={{
              background: hashColor(t) + "15",
              color:      hashColor(t),
              border:    `1px solid ${hashColor(t)}30`,
            }}
          >
            {t}
            <button onClick={() => onRemove(t)} className="opacity-50 hover:opacity-100 text-sm ml-0.5">×</button>
          </span>
        ))}
        <input
          className="bg-transparent border border-dashed border-[#333] rounded-xl px-3 py-1.5 text-zinc-500 text-xs outline-none w-24 focus:border-[#555] transition"
          placeholder="+ tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
        />
      </div>
    </div>
  );
}
