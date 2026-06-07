"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";
import { FIELD_TYPES } from "@/lib/brew";
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

function SortableField({ f, onUpdate, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: f.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  const inputClass = `w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border-2 border-black/10 rounded-xl p-4 mb-3 shadow-hard-sm"
    >
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex items-center gap-2">
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
          <span className="text-[calc((11/12)*var(--base-font-size))] font-extrabold uppercase tracking-wide text-black">{f.name}</span>
        </div>
        <button onClick={() => onRemove(f.id)} className="text-black/30 hover:text-black text-base px-1 transition font-bold">×</button>
      </div>

      {(f.type === "text" || f.type === "link") && (
        <input
          className={inputClass}
          value={f.value || ""}
          onChange={(e) => onUpdate(f.id, e.target.value)}
          placeholder={f.type === "link" ? "https://..." : "enter value..."}
        />
      )}
      {f.type === "number" && (
        <input
          type="number"
          className={inputClass}
          value={f.value || ""}
          onChange={(e) => onUpdate(f.id, e.target.value)}
          placeholder="0"
        />
      )}
      {f.type === "checkbox" && (
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className="w-5 h-5 rounded-md border-2 border-black flex items-center justify-center transition-all"
            style={{ background: f.value ? "#FF6A00" : "transparent" }}
            onClick={() => onUpdate(f.id, !f.value)}
          >
            {f.value && <span className="text-black text-xs font-black">✓</span>}
          </div>
          <span className="text-[calc((13/12)*var(--base-font-size))] font-bold text-black/50">
            {f.value ? "yes" : "no"}
          </span>
        </label>
      )}
    </div>
  );
}

export default function CustomFieldsSection({ fields, onAdd, onUpdate, onRemove, onReorder }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("text");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), type, value: type === "checkbox" ? false : "" });
    setName(""); setType("text"); setShow(false);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  }

  return (
    <Section label="custom fields">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={fields || []} strategy={verticalListSortingStrategy}>
          {(fields || []).map(f => (
            <SortableField key={f.id} f={f} onUpdate={onUpdate} onRemove={onRemove} />
          ))}
        </SortableContext>
      </DndContext>

      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="w-full border-2 border-dashed border-black/20 hover:border-black rounded-xl py-3 text-black/40 hover:text-black font-extrabold text-[calc((12/12)*var(--base-font-size))] mt-1 transition"
        >
          + add field
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <input
            className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
            placeholder="field name (e.g. Budget)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {FIELD_TYPES.map(ft => (
              <button
                key={ft.key}
                onClick={() => setType(ft.key)}
                className="flex flex-col items-center gap-0.5 px-3 py-2.5 border-2 rounded-xl min-w-[64px] font-extrabold transition-all"
                style={{
                  background:  type === ft.key ? "#000" : "#fff",
                  borderColor: "#000",
                  color:       type === ft.key ? "#fff" : "#000",
                }}
              >
                <span className="text-sm">{ft.icon}</span>
                <span className="text-[calc((10/12)*var(--base-font-size))]">{ft.label}</span>
              </button>
            ))}
          </div>
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
