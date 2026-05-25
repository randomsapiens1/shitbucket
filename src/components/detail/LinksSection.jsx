"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";

export default function LinksSection({ links, onAdd, onRemove }) {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");

  function handleAdd() {
    if (!url.trim()) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = "https://" + finalUrl;
    onAdd({ url: finalUrl, label: label.trim() });
    setUrl(""); setLabel(""); setShow(false);
  }

  return (
    <Section label="links">
      {(links || []).map(l => (
        <div key={l.id} className="flex justify-between items-center py-2.5 border-b border-[#1a1a1a]">
          <a
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="text-[#ff6a00] text-[13px] no-underline break-all flex-1 hover:underline"
          >
            {l.label || l.url}
          </a>
          <button onClick={() => onRemove(l.id)} className="text-zinc-700 hover:text-zinc-500 text-base px-1 ml-2 transition">×</button>
        </div>
      ))}

      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="w-full border border-dashed border-[#333] rounded-xl py-3 text-zinc-600 text-xs mt-1 hover:border-[#555] transition"
        >
          + add link
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <input
            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700"
            placeholder="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700"
            placeholder="label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-[#111] border border-[#222] text-[#ff6a00] rounded-xl px-4 py-2 text-xs font-semibold hover:border-[#333] transition">add</button>
            <button onClick={() => setShow(false)} className="text-zinc-600 text-xs hover:text-zinc-400 transition">cancel</button>
          </div>
        </div>
      )}
    </Section>
  );
}
