import Section from "@/components/ui/Section";

export default function TasksSection({ tasks, newTask, setNewTask, onAdd, onToggle, onRemove }) {
  return (
    <Section label="tasks">
      {(tasks || []).map(t => (
        <div
          key={t.id}
          className="flex items-center gap-3 py-3 border-b border-bucket-border"
          style={{ opacity: t.done ? 0.4 : 1 }}
        >
          <button onClick={() => onToggle(t.id)} className="shrink-0">
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${!t.done ? "border-2 border-bucket-border" : ""}`}
              style={{
                borderColor: t.done ? "var(--bucket-accent)" : undefined,
                background:  t.done ? "var(--bucket-accent)" : "transparent",
              }}
            >
              {t.done && <span className="text-black text-xs font-bold">✓</span>}
            </div>
          </button>
          <span
            className="flex-1 text-[13px] text-bucket-text"
            style={{ textDecoration: t.done ? "line-through" : "none" }}
          >
            {t.text}
          </span>
          <button onClick={() => onRemove(t.id)} className="text-bucket-muted hover:text-bucket-text-dim text-base px-1 transition">×</button>
        </div>
      ))}

      <div className="flex gap-2 items-center mt-3">
        <input
          className="flex-1 bg-bucket-card border border-bucket-border rounded-xl px-3 py-2.5 text-bucket-text text-[13px] outline-none focus:border-bucket-border-hover transition placeholder:text-bucket-muted"
          placeholder="add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
        />
        {newTask.trim() && (
          <button
            onClick={onAdd}
            className="bg-bucket-card border border-bucket-border text-bucket-accent rounded-xl px-4 py-2.5 text-xs font-semibold hover:border-bucket-border-hover transition"
          >
            add
          </button>
        )}
      </div>
    </Section>
  );
}
