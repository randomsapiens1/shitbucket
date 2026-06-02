import Section from "@/components/ui/Section";
import { timeAgo } from "@/lib/utils";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

function SortableThought({ t, onRemove, onUpdate, isOthers, currentUserInitials }) {
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
      className="bg-[#FFF8EE] border border-black/20 rounded-xl px-4 py-3 mb-2 relative group focus-within:border-black transition-colors"
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-black/20 hover:text-black transition-colors px-1"
          title="Drag to reorder"
        >
          <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor">
            <circle cx="2" cy="3" r="1.5" /><circle cx="2" cy="9" r="1.5" /><circle cx="2" cy="15" r="1.5" />
            <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="9" r="1.5" /><circle cx="8" cy="15" r="1.5" />
          </svg>
        </div>

        <div className="flex-1">
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
      </div>
    </div>
  );
}

export default function ThoughtsSection({ thoughts, newThought, setNewThought, onAdd, onRemove, onUpdate, onReorder, currentUserInitials }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid accidental drags when clicking
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Long press to drag on mobile
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
      const oldIndex = thoughts.findIndex((t) => t.id === active.id);
      const newIndex = thoughts.findIndex((t) => t.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  }

  return (
    <Section label="thoughts">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={thoughts} strategy={verticalListSortingStrategy}>
          {(thoughts || []).map((t) => (
            <SortableThought
              key={t.id}
              t={t}
              onRemove={onRemove}
              onUpdate={onUpdate}
              isOthers={t.by && t.by !== currentUserInitials}
              currentUserInitials={currentUserInitials}
            />
          ))}
        </SortableContext>
      </DndContext>

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
