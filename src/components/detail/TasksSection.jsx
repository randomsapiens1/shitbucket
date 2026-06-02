import Section from "@/components/ui/Section";

export default function TasksSection({ tasks, newTask, setNewTask, onAdd, onToggle, onRemove, onUpdate }) {
  return (
    <Section label="tasks">
      {(tasks || []).map(t => (
        <div
          key={t.id}
          className="flex items-center gap-3 py-3 border-b border-black/10 last:border-0 group focus-within:bg-black/5 rounded-xl px-2 transition-colors"
          style={{ opacity: t.done ? 0.5 : 1 }}
        >
          <button onClick={() => onToggle(t.id)} className="shrink-0">
            <div
              className="w-5 h-5 rounded-md border-2 border-black flex items-center justify-center transition-all"
              style={{ background: t.done ? "#FF6A00" : "transparent" }}
            >
              {t.done && <span className="text-black text-xs font-black">✓</span>}
            </div>
          </button>
          <input
            className="flex-1 bg-transparent text-[calc((13/12)*var(--base-font-size))] font-bold text-black outline-none border-none"
            style={{ textDecoration: t.done ? "line-through" : "none" }}
            value={t.text}
            onChange={(e) => onUpdate(t.id, e.target.value)}
          />
          {t.by && (
            <span className="text-[calc((9/12)*var(--base-font-size))] font-extrabold bg-black text-white px-1.5 py-0.5 rounded-md uppercase tracking-tight mr-1">
              {t.by}
            </span>
          )}
          <button onClick={() => onRemove(t.id)} className="text-black/30 hover:text-black text-base px-1 transition font-bold">×</button>
        </div>
      ))}

      <div className="flex gap-2 items-center mt-3">
        <input
          className="flex-1 bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((13/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
          placeholder="add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
        />
        {newTask.trim() && (
          <button
            onClick={onAdd}
            className="bg-black text-white border-2 border-black rounded-xl px-4 py-2.5 text-[calc((12/12)*var(--base-font-size))] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white"
          >
            add
          </button>
        )}
      </div>
    </Section>
  );
}
