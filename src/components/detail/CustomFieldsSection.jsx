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
        <div key={f.id} className="bg-bucket-card border border-bucket-border rounded-xl p-4 mb-2">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[11px] text-bucket-accent uppercase tracking-wide font-semibold">{f.name}</span>
            <button onClick={() => onRemove(f.id)} className="text-bucket-muted hover:text-bucket-text-dim text-base px-1 transition">×</button>
          </div>

          {f.type === "text" && (
            <input
              className="w-full bg-bucket-bg border border-bucket-border rounded-xl px-3 py-2.5 text-bucket-text text-[13px] outline-none focus:border-bucket-border-hover transition placeholder:text-bucket-muted"
              value={f.value || ""}
              onChange={(e) => onUpdate(f.id, e.target.value)}
              placeholder="enter value..."
            />
          )}
          {f.type === "number" && (
            <input
              type="number"
              className="w-full bg-bucket-bg border border-bucket-border rounded-xl px-3 py-2.5 text-bucket-text text-[13px] outline-none focus:border-bucket-border-hover transition placeholder:text-bucket-muted"
              value={f.value || ""}
              onChange={(e) => onUpdate(f.id, e.target.value)}
              placeholder="0"
            />
          )}
          {f.type === "checkbox" && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all"
                style={{ border: `2px solid ${f.value ? "#ff6a00" : "var(--border-hover)"}`, background: f.value ? "#ff6a00" : "transparent" }}
                onClick={() => onUpdate(f.id, !f.value)}
              >
                {f.value && <span className="text-black text-xs font-bold">✓</span>}
              </div>
              <span className="text-[13px]" style={{ color: f.value ? "#ff6a00" : "var(--muted)" }}>
                {f.value ? "yes" : "no"}
              </span>
            </label>
          )}
          {f.type === "link" && (
            <input
              className="w-full bg-bucket-bg border border-bucket-border rounded-xl px-3 py-2.5 text-bucket-text text-[13px] outline-none focus:border-bucket-border-hover transition placeholder:text-bucket-muted"
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
          className="w-full border border-dashed border-bucket-border-hover rounded-xl py-3 text-bucket-muted text-xs mt-1 hover:border-bucket-border-hover transition"
        >
          + add field
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <input
            className="w-full bg-bucket-bg border border-bucket-border rounded-xl px-3 py-2.5 text-bucket-text text-[13px] outline-none focus:border-bucket-border-hover transition placeholder:text-bucket-muted"
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
                  background:   type === ft.key ? "rgba(255, 106, 0, 0.08)"  : "transparent",
                  borderColor:  type === ft.key ? "rgba(255, 106, 0, 0.25)"  : "var(--border)",
                  color:        type === ft.key ? "var(--accent)"    : "var(--muted)",
                }}
              >
                <span className="text-sm">{ft.icon}</span>
                <span className="text-[10px]">{ft.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-bucket-card border border-bucket-border text-bucket-accent rounded-xl px-4 py-2 text-xs font-semibold hover:border-bucket-border-hover transition">add</button>
            <button onClick={() => setShow(false)} className="text-bucket-muted text-xs hover:text-bucket-text-dim transition">cancel</button>
          </div>
        </div>
      )}
    </Section>
  );
}
