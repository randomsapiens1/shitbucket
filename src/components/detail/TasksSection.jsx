import Section from "@/components/ui/Section";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

function SortableTask({ t, onToggle, onRemove, onUpdate, isOthers, currentUserInitials }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: t.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 py-3 border-b border-black/10 last:border-0 group focus-within:bg-black/5 rounded-xl px-2 transition-colors"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="mt-1.5 cursor-grab active:cursor-grabbing text-black/20 hover:text-black transition-colors px-1"
        title="Drag to reorder"
      >
        <svg width="10" height="15" viewBox="0 0 10 15" fill="currentColor">
          <circle cx="2" cy="2.5" r="1.2" /><circle cx="2" cy="7.5" r="1.2" /><circle cx="2" cy="12.5" r="1.2" />
          <circle cx="8" cy="2.5" r="1.2" /><circle cx="8" cy="7.5" r="1.2" /><circle cx="8" cy="12.5" r="1.2" />
        </svg>
      </div>

      <button onClick={() => onToggle(t.id)} className="shrink-0 mt-1">
        <div
          className="w-5 h-5 rounded-md border-2 border-black flex items-center justify-center transition-all"
          style={{ background: t.done ? "#FF6A00" : "transparent" }}
        >
          {t.done && <span className="text-black text-xs font-black">✓</span>}
        </div>
      </button>

      <AutoResizeTextarea
        className={`flex-1 bg-transparent text-[calc((13/12)*var(--base-font-size))] font-bold outline-none border-none resize-none ${isOthers ? "text-[#FF6A00]" : "text-black"}`}
        style={{ textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.5 : 1 }}
        value={t.text}
        onChange={(e) => onUpdate(t.id, e.target.value)}
      />

      {isOthers && (
        <span className="text-[calc((9/12)*var(--base-font-size))] font-extrabold bg-black text-white px-1.5 py-0.5 rounded-md uppercase tracking-tight mr-1 mt-1 shrink-0">
          {t.by}
        </span>
      )}
      <button onClick={() => onRemove(t.id)} className="text-black/30 hover:text-black text-base px-1 transition font-bold mt-0.5 shrink-0">×</button>
    </div>
  );
}

export default function TasksSection({ tasks, newTask, setNewTask, onAdd, onToggle, onRemove, onUpdate, onReorder, currentUserInitials }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  }

  return (
    <Section label="tasks">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {(tasks || []).map((t) => (
            <SortableTask
              key={t.id}
              t={t}
              onToggle={onToggle}
              onRemove={onRemove}
              onUpdate={onUpdate}
              isOthers={t.by && t.by !== currentUserInitials}
              currentUserInitials={currentUserInitials}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex gap-2 items-start mt-3">
        <AutoResizeTextarea
          className="flex-1 bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((13/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30 resize-none"
          placeholder="add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        {newTask.trim() && (
          <button
            onClick={onAdd}
            className="bg-black text-white border-2 border-black rounded-xl px-4 py-2.5 text-[calc((12/12)*var(--base-font-size))] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white shrink-0"
          >
            add
          </button>
        )}
      </div>
    </Section>
  );
}
