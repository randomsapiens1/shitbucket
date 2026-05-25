"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";
import { FIELD_TYPES } from "@/lib/brew";

export default function CustomFieldsSection({ fields, onAdd, onUpdate, onRemove }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("text");

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), type, value: type === "checkbox" ? false : "" });
    setName(""); setType("text"); setShow(false);
  }

  return (
    <Section label="custom fields">
      {(fields || []).map(f => (
        <div key={f.id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 mb-2">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[11px] text-[#ff6a00] uppercase tracking-wide font-semibold">{f.name}</span>
            <button onClick={() => onRemove(f.id)} className="text-zinc-700 hover:text-zinc-500 text-base px-1 transition">×</button>
          </div>

          {f.type === "text" && (
            <input
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700"
              value={f.value || ""}
              onChange={(e) => onUpdate(f.id, e.target.value)}
              placeholder="enter value..."
            />
          )}
          {f.type === "number" && (
            <input
              type="number"
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700"
              value={f.value || ""}
              onChange={(e) => onUpdate(f.id, e.target.value)}
              placeholder="0"
            />
          )}
          {f.type === "checkbox" && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all"
                style={{ border: `2px solid ${f.value ? "#ff6a00" : "#333"}`, background: f.value ? "#ff6a00" : "transparent" }}
                onClick={() => onUpdate(f.id, !f.value)}
              >
                {f.value && <span className="text-black text-xs font-bold">✓</span>}
              </div>
              <span className="text-[13px]" style={{ color: f.value ? "#ff6a00" : "#666" }}>
                {f.value ? "yes" : "no"}
              </span>
            </label>
          )}
          {f.type === "link" && (
            <input
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700"
              value={f.value || ""}
              onChange={(e) => onUpdate(f.id, e.target.value)}
              placeholder="https://..."
            />
          )}
        </div>
      ))}

      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="w-full border border-dashed border-[#333] rounded-xl py-3 text-zinc-600 text-xs mt-1 hover:border-[#555] transition"
        >
          + add field
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <input
            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700"
            placeholder="field name (e.g. Budget)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-1.5">
            {FIELD_TYPES.map(ft => (
              <button
                key={ft.key}
                onClick={() => setType(ft.key)}
                className="flex flex-col items-center gap-0.5 px-3 py-2.5 border rounded-xl flex-1 transition"
                style={{
                  background:   type === ft.key ? "#ff6a0015"  : "transparent",
                  borderColor:  type === ft.key ? "#ff6a0040"  : "#1a1a1a",
                  color:        type === ft.key ? "#ff6a00"    : "#666",
                }}
              >
                <span className="text-sm">{ft.icon}</span>
                <span className="text-[10px]">{ft.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-[#111] border border-[#222] text-[#ff6a00] rounded-xl px-4 py-2 text-xs font-semibold hover:border-[#333] transition">add</button>
            <button onClick={() => setShow(false)} className="text-zinc-600 text-xs hover:text-zinc-400 transition">cancel</button>
          </div>
        </div>
      )}
    </Section>
  );
}
