"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";
import ScriptField from "./ScriptField";
import ScriptStudio from "./ScriptStudio";
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

function SortableScript({ s, onUpdate, onRemove, onOpenStudio }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: s.id });

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
      className="bg-[#FFF8EE] border border-black/20 rounded-xl px-4 py-4 mb-3 relative group focus-within:border-black transition-colors"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 flex-1">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-black/20 hover:text-black transition-colors px-1"
          >
            <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor">
              <circle cx="2" cy="3" r="1.5" /><circle cx="2" cy="9" r="1.5" /><circle cx="2" cy="15" r="1.5" />
              <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="9" r="1.5" /><circle cx="8" cy="15" r="1.5" />
            </svg>
          </div>
          <input
            className="flex-1 bg-transparent border-none text-[calc((12/12)*var(--base-font-size))] font-extrabold uppercase tracking-widest text-black outline-none placeholder:text-black/20"
            value={s.title || ""}
            onChange={(e) => onUpdate(s.id, { title: e.target.value })}
            placeholder="script title..."
          />
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onOpenStudio(s)}
            className="bg-black text-white text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg hover:bg-[#FF6A00] transition-colors shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            Studio
          </button>
          <button onClick={() => onRemove(s.id)} className="text-black/30 hover:text-black text-xl px-1 transition font-bold leading-none">×</button>
        </div>
      </div>

      <ScriptField 
        value={s.content} 
        onUpdate={(content) => onUpdate(s.id, { content })} 
      />
    </div>
  );
}

export default function ScriptsSection({ scripts, onAdd, onUpdate, onRemove, onReorder }) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle]   = useState("");
  const [activeStudioScript, setActiveStudioScript] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleAdd() {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), content: "" });
    setTitle("");
    setShowAdd(false);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = scripts.findIndex((s) => s.id === active.id);
      const newIndex = scripts.findIndex((s) => s.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  }

  return (
    <Section label="scripts & content">
      {activeStudioScript && (
        <ScriptStudio 
          initialTitle={activeStudioScript.title} 
          onClose={() => setActiveStudioScript(null)} 
        />
      )}
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={scripts || []} strategy={verticalListSortingStrategy}>
          {(scripts || []).map(s => (
            <SortableScript 
              key={s.id} 
              s={s} 
              onUpdate={onUpdate} 
              onRemove={onRemove} 
              onOpenStudio={setActiveStudioScript}
            />
          ))}
        </SortableContext>
      </DndContext>

      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full border-2 border-dashed border-black/20 hover:border-black rounded-xl py-3 text-black/40 hover:text-black font-extrabold text-[calc((12/12)*var(--base-font-size))] mt-1 transition"
        >
          + add script
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <input
            className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
            placeholder="script name (e.g. YouTube Intro)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-black text-white border-2 border-black rounded-xl px-4 py-2 text-[calc((12/12)*var(--base-font-size))] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white"
            >
              add
            </button>
            <button onClick={() => setShowAdd(false)} className="text-black/40 text-[calc((12/12)*var(--base-font-size))] font-bold hover:text-black transition">cancel</button>
          </div>
        </div>
      )}
    </Section>
  );
}
