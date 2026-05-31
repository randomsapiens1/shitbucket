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

  const inputClass = "w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[13px] outline-none transition placeholder:text-black/30";

  return (
    <Section label="custom fields">
      {(fields || []).map(f => (
        <div key={f.id} className="bg-[#FFF8EE] border border-black/15 rounded-xl p-4 mb-2">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-black">{f.name}</span>
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
              <span className="text-[13px] font-bold text-black/50">
                {f.value ? "yes" : "no"}
              </span>
            </label>
          )}
        </div>
      ))}

      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="w-full border-2 border-dashed border-black/20 hover:border-black rounded-xl py-3 text-black/40 hover:text-black font-extrabold text-[12px] mt-1 transition"
        >
          + add field
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <input
            className={inputClass}
            placeholder="field name (e.g. Budget)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-1.5">
            {FIELD_TYPES.map(ft => (
              <button
                key={ft.key}
                onClick={() => setType(ft.key)}
                className="flex flex-col items-center gap-0.5 px-3 py-2.5 border-2 rounded-xl flex-1 font-extrabold transition-all"
                style={{
                  background:  type === ft.key ? "#000" : "#fff",
                  borderColor: "#000",
                  color:       type === ft.key ? "#fff" : "#000",
                }}
              >
                <span className="text-sm">{ft.icon}</span>
                <span className="text-[10px]">{ft.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-black text-white border-2 border-black rounded-xl px-4 py-2 text-[12px] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white"
            >
              add
            </button>
            <button onClick={() => setShow(false)} className="text-black/40 text-[12px] font-bold hover:text-black transition">cancel</button>
          </div>
        </div>
      )}
    </Section>
  );
}
