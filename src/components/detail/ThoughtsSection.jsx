import Section from "@/components/ui/Section";
import { timeAgo } from "@/lib/utils";

export default function ThoughtsSection({ thoughts, newThought, setNewThought, onAdd, onRemove }) {
  return (
    <Section label="thoughts">
      {(thoughts || []).map(t => (
        <div key={t.id} className="bg-[#FFF8EE] border border-black/20 rounded-xl px-4 py-3 mb-2">
          <div className="text-[13px] font-bold text-black leading-relaxed">{t.text}</div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-bold text-black/40">{timeAgo(t.ts)}</span>
            <button onClick={() => onRemove(t.id)} className="text-black/30 hover:text-black text-base px-1 transition font-bold">×</button>
          </div>
        </div>
      ))}

      <textarea
        className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-4 py-3 text-black text-[13px] font-bold outline-none resize-none mt-2 transition placeholder:text-black/30"
        placeholder="add a thought..."
        value={newThought}
        onChange={(e) => setNewThought(e.target.value)}
        rows={2}
      />
      {newThought.trim() && (
        <button
          onClick={onAdd}
          className="mt-2 bg-black text-white border-2 border-black rounded-xl px-4 py-2 text-[12px] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white"
        >
          add
        </button>
      )}
    </Section>
  );
}
