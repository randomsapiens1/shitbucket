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
import DrawingCanvas from "@/components/ui/DrawingCanvas";

export function SortableField({ f, onUpdate, onRemove, onOpenDraw }) {
  const [newSketchName, setNewSketchName] = useState("");
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

  const addSketch = () => {
    if (!newSketchName.trim()) return;
    const sketchId = Math.random().toString(36).slice(2, 9);
    onOpenDraw(f.id, sketchId, null, newSketchName.trim());
    setNewSketchName("");
  };

  const removeSketch = (sid) => {
    const newVal = (f.value || []).filter(s => s.id !== sid);
    onUpdate(f.id, newVal);
  };

  const inputClass = `w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border-2 border-black/10 rounded-xl p-4 mb-6 shadow-hard-sm"
    >
      <div className="flex justify-between items-center mb-4">
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
          <span className="text-[calc((11/12)*var(--base-font-size))] font-black uppercase tracking-[0.2em] text-black/40">
            {f.name}
          </span>
        </div>
        <button onClick={() => onRemove(f.id)} className="text-black/30 hover:text-black text-base px-1 transition font-bold">×</button>
      </div>

      <div className="flex flex-col gap-4">
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
        {f.type === "draw" && (
          <div className="flex flex-col gap-6">
            {/* List of existing sketches - Framed Look */}
            {Array.isArray(f.value) && f.value.map((sketch) => (
              <div key={sketch.id} className="relative group">
                <div className="flex flex-col gap-0">
                  {/* Frame Container */}
                  <button
                    onClick={() => onOpenDraw(f.id, sketch.id, sketch.data, sketch.name)}
                    className="w-full aspect-[4/3] bg-white border-[3px] border-black p-4 shadow-hard-lg transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:shadow-hard group/frame"
                  >
                    <div className="w-full h-full bg-[#FFF8EE] border border-black/5 overflow-hidden flex items-center justify-center relative">
                      <img src={sketch.data} alt={sketch.name} className="w-full h-full object-contain relative z-10" />
                      {/* Subtle inner shadow for depth */}
                      <div className="absolute inset-0 shadow-inner pointer-events-none z-20" />
                    </div>
                  </button>

                  {/* Museum Label */}
                  <div className="flex justify-between items-center mt-3 px-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">{sketch.name}</span>
                      <span className="text-[8px] font-bold uppercase text-black/30 tracking-widest">original sketch • {f.name}</span>
                    </div>
                    <button 
                      onClick={() => removeSketch(sketch.id)}
                      className="bg-black text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      discard
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new drawing input at bottom */}
            <div className="mt-2 pt-6 border-t-2 border-dashed border-black/5">
              <div className="flex flex-col gap-3">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/30 px-1">add another drawing</p>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-4 py-3 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/20 shadow-inner"
                    placeholder="Sketch name..."
                    value={newSketchName}
                    onChange={(e) => setNewSketchName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSketch()}
                  />
                  <button
                    onClick={addSketch}
                    disabled={!newSketchName.trim()}
                    className="w-14 h-14 rounded-xl bg-black text-white flex items-center justify-center shadow-hard-sm transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-20 shrink-0"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AddCustomFieldSection({ onAdd }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [sketchName, setSketchName] = useState("");
  const [type, setType] = useState("text");

  function handleAdd() {
    if (type === "draw") {
      if (!sketchName.trim()) return;
      onAdd({ name: "draw", type: "draw", value: [], autoDrawName: sketchName.trim() });
    } else {
      if (!name.trim()) return;
      const initialValue = type === "checkbox" ? false : "";
      onAdd({ name: name.trim(), type, value: initialValue });
    }
    setName(""); setSketchName(""); setShow(false);
  }

  return (
    <div className="mt-4">
      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="w-full border-2 border-dashed border-black/20 hover:border-black rounded-xl py-4 flex items-center justify-center gap-2 text-black/40 hover:text-black font-extrabold text-[calc((13/12)*var(--base-font-size))] transition bg-white/50"
        >
          + add custom field
        </button>
      ) : (
        <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4 flex flex-col gap-3">
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

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
              {FIELD_TYPES.find(t => t.key === type)?.icon}
            </div>
            {type === "draw" ? (
              <input
                autoFocus
                className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
                placeholder="Drawing name (e.g. Penis)"
                value={sketchName}
                onChange={(e) => setSketchName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            ) : (
              <input
                autoFocus
                className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
                placeholder="Field name (e.g. Budget)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={type === "draw" ? !sketchName.trim() : !name.trim()}
              className="flex-1 bg-black text-white border-2 border-black rounded-xl px-4 py-2.5 text-[calc((12/12)*var(--base-font-size))] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] disabled:opacity-30"
            >
              {type === "draw" ? "start drawing" : "create field"}
            </button>
            <button onClick={() => setShow(false)} className="px-4 text-black/40 text-[calc((12/12)*var(--base-font-size))] font-bold hover:text-black transition">cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}



