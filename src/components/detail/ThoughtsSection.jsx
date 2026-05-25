import Section from "@/components/ui/Section";
import { timeAgo } from "@/lib/utils";

export default function ThoughtsSection({ thoughts, newThought, setNewThought, onAdd, onRemove }) {
  return (
    <Section label="thoughts">
      {(thoughts || []).map(t => (
        <div key={t.id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3 mb-2">
          <div className="text-[13px] text-zinc-300 leading-relaxed">{t.text}</div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-zinc-600">{timeAgo(t.ts)}</span>
            <button onClick={() => onRemove(t.id)} className="text-zinc-700 hover:text-zinc-500 text-base px-1 transition">×</button>
          </div>
        </div>
      ))}

      <textarea
        className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3 text-zinc-300 text-[13px] outline-none resize-none mt-2 focus:border-[#333] transition placeholder:text-zinc-700"
        placeholder="add a thought..."
        value={newThought}
        onChange={(e) => setNewThought(e.target.value)}
        rows={2}
      />
      {newThought.trim() && (
        <button
          onClick={onAdd}
          className="bg-[#111] border border-[#222] text-[#ff6a00] rounded-xl px-4 py-2 text-xs font-semibold mt-2 hover:border-[#333] transition"
        >
          add
        </button>
      )}
    </Section>
  );
}
