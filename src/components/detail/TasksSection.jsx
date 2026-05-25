import Section from "@/components/ui/Section";

export default function TasksSection({ tasks, newTask, setNewTask, onAdd, onToggle, onRemove }) {
  return (
    <Section label="tasks">
      {(tasks || []).map(t => (
        <div
          key={t.id}
          className="flex items-center gap-3 py-3 border-b border-[#1a1a1a]"
          style={{ opacity: t.done ? 0.4 : 1 }}
        >
          <button onClick={() => onToggle(t.id)} className="shrink-0">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
              style={{
                border:     `2px solid ${t.done ? "#ff6a00" : "#333"}`,
                background:  t.done ? "#ff6a00" : "transparent",
              }}
            >
              {t.done && <span className="text-black text-xs font-bold">✓</span>}
            </div>
          </button>
          <span
            className="flex-1 text-[13px] text-zinc-300"
            style={{ textDecoration: t.done ? "line-through" : "none" }}
          >
            {t.text}
          </span>
          <button onClick={() => onRemove(t.id)} className="text-zinc-700 hover:text-zinc-500 text-base px-1 transition">×</button>
        </div>
      ))}

      <div className="flex gap-2 items-center mt-3">
        <input
          className="flex-1 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700"
          placeholder="add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
        />
        {newTask.trim() && (
          <button
            onClick={onAdd}
            className="bg-[#111] border border-[#222] text-[#ff6a00] rounded-xl px-4 py-2.5 text-xs font-semibold hover:border-[#333] transition"
          >
            add
          </button>
        )}
      </div>
    </Section>
  );
}
