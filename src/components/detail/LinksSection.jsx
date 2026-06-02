"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";

export default function LinksSection({ links, onAdd, onRemove }) {
  const [show,  setShow]  = useState(false);
  const [url,   setUrl]   = useState("");
  const [label, setLabel] = useState("");

  function handleAdd() {
    if (!url.trim()) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = "https://" + finalUrl;
    onAdd({ url: finalUrl, label: label.trim() });
    setUrl(""); setLabel(""); setShow(false);
  }

  return (
    <Section label="links & inspo">
      {(links || []).map(l => (
        <div key={l.id} className="flex justify-between items-center py-2.5 border-b border-black/10 last:border-0">
          <a
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="text-[#FF6A00] text-[calc((13/12)*var(--base-font-size))] font-bold no-underline break-all flex-1 hover:underline"
          >
            {l.label || l.url}
          </a>
          <button onClick={() => onRemove(l.id)} className="text-black/30 hover:text-black text-base px-1 ml-2 transition font-bold">×</button>
        </div>
      ))}

      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="w-full border-2 border-dashed border-black/20 hover:border-black rounded-xl py-3 text-black/40 hover:text-black font-extrabold text-[calc((12/12)*var(--base-font-size))] mt-1 transition"
        >
          + add link
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
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
