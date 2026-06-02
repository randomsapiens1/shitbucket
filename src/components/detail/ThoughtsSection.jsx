import Section from "@/components/ui/Section";
import { timeAgo } from "@/lib/utils";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";

export default function ThoughtsSection({ thoughts, newThought, setNewThought, onAdd, onRemove, onUpdate, currentUserInitials }) {
  return (
    <Section label="thoughts">
      {(thoughts || []).map(t => {
        const isOthers = t.by && t.by !== currentUserInitials;
        return (
          <div key={t.id} className="bg-[#FFF8EE] border border-black/20 rounded-xl px-4 py-3 mb-2 relative group focus-within:border-black transition-colors">
            <AutoResizeTextarea
              className={`w-full bg-transparent text-[calc((13/12)*var(--base-font-size))] font-bold leading-relaxed pr-6 outline-none border-none ${isOthers ? "text-[#FF6A00]" : "text-black"}`}
              value={t.text}
              onChange={(e) => onUpdate(t.id, e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <span className="text-[calc((10/12)*var(--base-font-size))] font-bold text-black/40">{timeAgo(t.ts)}</span>
                {isOthers && (
                  <span className="text-[calc((9/12)*var(--base-font-size))] font-extrabold bg-black text-white px-1.5 py-0.5 rounded-md uppercase tracking-tight">
                    {t.by}
                  </span>
                )}
              </div>
              <button onClick={() => onRemove(t.id)} className="text-black/30 hover:text-black text-base px-1 transition font-bold">×</button>
            </div>
          </div>
        );
      })}

      <textarea
        className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-4 py-3 text-black text-[calc((13/12)*var(--base-font-size))] font-bold outline-none resize-none mt-2 transition placeholder:text-black/30"
        placeholder="add a thought..."
        value={newThought}
        onChange={(e) => setNewThought(e.target.value)}
        rows={2}
      />
      {newThought.trim() && (
        <button
          onClick={onAdd}
          className="mt-2 bg-black text-white border-2 border-black rounded-xl px-4 py-2 text-[calc((12/12)*var(--base-font-size))] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white"
        >
          add
        </button>
      )}
    </Section>
  );
}
