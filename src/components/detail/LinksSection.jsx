"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";
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

function SortableLink({ l, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: l.id });

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
      className="flex justify-between items-center py-2.5 border-b border-black/10 last:border-0 bg-white"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-black/20 hover:text-black transition-colors px-1"
          title="Drag to reorder"
        >
          <svg width="10" height="15" viewBox="0 0 10 15" fill="currentColor">
            <circle cx="2" cy="2.5" r="1.2" /><circle cx="2" cy="7.5" r="1.2" /><circle cx="2" cy="12.5" r="1.2" />
            <circle cx="8" cy="2.5" r="1.2" /><circle cx="8" cy="7.5" r="1.2" /><circle cx="8" cy="12.5" r="1.2" />
          </svg>
        </div>
        <a
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="text-[#FF6A00] text-[calc((13/12)*var(--base-font-size))] font-bold no-underline break-all hover:underline"
        >
          {l.label || l.url}
        </a>
      </div>
      <button onClick={() => onRemove(l.id)} className="text-black/30 hover:text-black text-base px-1 ml-2 transition font-bold shrink-0">×</button>
    </div>
  );
}

export default function LinksSection({ links, onAdd, onRemove, onReorder }) {
  const [show,  setShow]  = useState(false);
  const [url,   setUrl]   = useState("");
  const [label, setLabel] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleAdd() {
    if (!url.trim()) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = "https://" + finalUrl;
    onAdd({ url: finalUrl, label: label.trim() });
    setUrl(""); setLabel(""); setShow(false);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  }

  return (
    <Section label="links & inspo">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={links || []} strategy={verticalListSortingStrategy}>
          {(links || []).map(l => (
            <SortableLink key={l.id} l={l} onRemove={onRemove} />
          ))}
        </SortableContext>
      </DndContext>

      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="w-full border-2 border-dashed border-black/20 hover:border-black rounded-xl py-3 text-black/40 hover:text-black font-extrabold text-[calc((12/12)*var(--base-font-size))] mt-2 transition"
        >
          + add link
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-3">
          <input
            className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((13/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
            placeholder="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((13/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
            placeholder="label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-black text-white border-2 border-black rounded-xl px-4 py-2 text-[calc((12/12)*var(--base-font-size))] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white"
            >
              add
            </button>
            <button onClick={() => setShow(false)} className="text-black/40 text-[calc((12/12)*var(--base-font-size))] font-bold hover:text-black transition">cancel</button>
          </div>
        </div>
      )}
    </Section>
  );
}
