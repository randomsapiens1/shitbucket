import Section from "@/components/ui/Section";
import { timeAgo } from "@/lib/utils";

export default function ThoughtsSection({ thoughts, newThought, setNewThought, onAdd, onRemove }) {
  return (
    <Section label="thoughts">
      {(thoughts || []).map(t => (
        <div key={t.id} className="bg-bucket-card border border-bucket-border rounded-xl px-4 py-3 mb-2">
          <div className="text-[13px] text-bucket-text leading-relaxed">{t.text}</div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-bucket-muted">{timeAgo(t.ts)}</span>
            <button onClick={() => onRemove(t.id)} className="text-bucket-muted hover:text-bucket-text-dim text-base px-1 transition">×</button>
          </div>
        </div>
      ))}

      <textarea
        className="w-full bg-bucket-card border border-bucket-border rounded-xl px-4 py-3 text-bucket-text text-[13px] outline-none resize-none mt-2 focus:border-bucket-border-hover transition placeholder:text-bucket-muted"
        placeholder="add a thought..."
        value={newThought}
        onChange={(e) => setNewThought(e.target.value)}
        rows={2}
      />
      {newThought.trim() && (
        <button
          onClick={onAdd}
          className="bg-bucket-card border border-bucket-border text-bucket-accent rounded-xl px-4 py-2 text-xs font-semibold mt-2 hover:border-bucket-border-hover transition"
        >
          add
        </button>
      )}
    </Section>
  );
}
