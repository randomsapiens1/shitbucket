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
        <div key={l.id} className="flex justify-between items-center py-2.5 border-b border-bucket-border">
          <a
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="text-bucket-accent text-[13px] no-underline break-all flex-1 hover:underline"
          >
            {l.label || l.url}
          </a>
          <button onClick={() => onRemove(l.id)} className="text-bucket-muted hover:text-bucket-text-dim text-base px-1 ml-2 transition">×</button>
        </div>
      ))}

      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="w-full border border-dashed border-bucket-border rounded-xl py-3 text-bucket-muted text-xs mt-1 hover:border-bucket-border-hover transition"
        >
          + add link
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <input
            className="w-full bg-bucket-card border border-bucket-border rounded-xl px-3 py-2.5 text-bucket-text text-[13px] outline-none focus:border-bucket-border-hover transition placeholder:text-bucket-muted"
            placeholder="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            className="w-full bg-bucket-card border border-bucket-border rounded-xl px-3 py-2.5 text-bucket-text text-[13px] outline-none focus:border-bucket-border-hover transition placeholder:text-bucket-muted"
            placeholder="label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-bucket-card border border-bucket-border text-bucket-accent rounded-xl px-4 py-2 text-xs font-semibold hover:border-bucket-border-hover transition">add</button>
            <button onClick={() => setShow(false)} className="text-bucket-muted text-xs hover:text-bucket-text-dim transition">cancel</button>
          </div>
        </div>
      )}
    </Section>
  );
}
