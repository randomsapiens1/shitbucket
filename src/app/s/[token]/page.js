"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSharedIdea } from "@/lib/db";

const BREW_STAGES = [
  { min: 0,  label: "raw dump",          emoji: "💩" },
  { min: 15, label: "starting to stink", emoji: "🦨" },
  { min: 35, label: "fermenting",        emoji: "🧪" },
  { min: 55, label: "bubbling up",       emoji: "🫧" },
  { min: 75, label: "almost cooked",     emoji: "🔥" },
  { min: 95, label: "pure gold",         emoji: "✨" },
];

const BREW_PILL_BG = { 0: "#EFEFEF", 15: "#FFE0CC", 35: "#FFD4B0", 55: "#FFD4B0", 75: "#FF6A00", 95: "#CC5500" };
const BREW_PILL_TEXT = { 0: "#555", 15: "#000", 35: "#000", 55: "#000", 75: "#fff", 95: "#fff" };

function calcBrewProgress(idea) {
  let score = 0;
  if (idea.thought) score += 10;
  score += Math.min((idea.thoughts || []).length * 6, 30);
  if ((idea.tags || []).length > 0) score += 10;
  if ((idea.links || []).length > 0) score += 10;
  const filledFields = (idea.fields || []).filter(f => f.type === "checkbox" ? f.value : f.value?.toString().trim());
  score += Math.min(filledFields.length * 5, 15);
  const tasks = idea.tasks || [];
  if (tasks.length > 0) score += 10;
  const done = tasks.filter(t => t.done).length;
  if (tasks.length > 0) score += Math.round((done / tasks.length) * 15);
  return Math.min(score, 100);
}

function getBrewStage(pct) {
  let stage = BREW_STAGES[0];
  for (const s of BREW_STAGES) if (pct >= s.min) stage = s;
  return stage;
}

function getPillStyle(pct) {
  let bg = "#EFEFEF", color = "#555";
  for (const [min, val] of Object.entries(BREW_PILL_BG)) {
    if (pct >= parseInt(min)) bg = val;
  }
  for (const [min, val] of Object.entries(BREW_PILL_TEXT)) {
    if (pct >= parseInt(min)) color = val;
  }
  return { backgroundColor: bg, color };
}

export default function SharedIdeaPage() {
  const params  = useParams();
  const [idea,    setIdea]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!params.token) return;
    getSharedIdea(params.token)
      .then(data => { if (data) setIdea(data); else setError(true); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8EE] flex items-center justify-center">
        <div className="text-5xl">🪣</div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-[#FFF8EE] flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-4xl">🪣</div>
        <p className="font-bold text-black/40 text-[14px] text-center">
          this idea doesn&apos;t exist or the link has expired.
        </p>
        <a href="/" className="text-[#FF6A00] font-extrabold text-[13px] underline">go to shitbucket</a>
      </div>
    );
  }

  const brew       = calcBrewProgress(idea);
  const stage      = getBrewStage(brew);
  const pillStyle  = getPillStyle(brew);
  const tasksDone  = (idea.tasks || []).filter(t => t.done).length;
  const tasksTotal = (idea.tasks || []).length;

  return (
    <div className="min-h-screen bg-[#FFF8EE] font-mono max-w-xl mx-auto px-4 py-6 pb-20">

      {/* Branding */}
      <div className="flex items-center gap-2 mb-6">
        <img src="/logo-shitBucket-day.png" alt="ShitBucket" className="w-7 h-7 object-contain" />
        <span className="text-[14px] font-extrabold text-black">ShitBucket</span>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-black/30 ml-auto">shared idea</span>
      </div>

      {/* Title card */}
      <div className="rounded-3xl border-2 border-black shadow-hard p-5 mb-4 bg-white">
        <h1 className="text-[22px] font-extrabold text-black leading-snug mb-3">{idea.title}</h1>

        {/* Brew pill */}
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide border border-black/15 shadow-hard-sm"
          style={pillStyle}
        >
          {stage.emoji} {brew}% · {stage.label}
        </span>
      </div>

      {/* Tags */}
      {(idea.tags || []).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.map(t => (
            <span key={t} className="px-3 py-1.5 rounded-full text-[11px] font-extrabold border-2 border-black bg-white text-black shadow-hard-sm">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Tasks */}
      {tasksTotal > 0 && (
        <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4 mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black mb-3">
            tasks ({tasksDone}/{tasksTotal})
          </p>
          {idea.tasks.map(t => (
            <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-black/10 last:border-0" style={{ opacity: t.done ? 0.5 : 1 }}>
              <div
                className="w-5 h-5 rounded-md border-2 border-black flex items-center justify-center shrink-0"
                style={{ background: t.done ? "#FF6A00" : "transparent" }}
              >
                {t.done && <span className="text-black text-xs font-black">✓</span>}
              </div>
              <span className="text-[13px] font-bold text-black" style={{ textDecoration: t.done ? "line-through" : "none" }}>
                {t.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Thoughts */}
      {(idea.thoughts || []).length > 0 && (
        <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4 mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black mb-3">thoughts</p>
          {idea.thoughts.map((t, i) => (
            <div key={i} className="bg-[#FFF8EE] border border-black/15 rounded-xl px-3.5 py-2.5 mb-2 last:mb-0">
              <div className="text-[13px] font-bold text-black leading-relaxed">{t.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Links */}
      {(idea.links || []).length > 0 && (
        <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4 mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black mb-3">links</p>
          {idea.links.map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noreferrer"
              className="block text-[#FF6A00] font-bold text-[13px] py-1.5 no-underline break-all hover:underline">
              {l.label || l.url}
            </a>
          ))}
        </div>
      )}

      {/* Fields */}
      {(idea.fields || []).length > 0 && (
        <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4 mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black mb-3">details</p>
          {idea.fields.map((f, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-black/10 last:border-0">
              <span className="text-[11px] font-extrabold uppercase text-black/40">{f.name}</span>
              <span className="text-[13px] font-bold text-black">{f.type === "checkbox" ? (f.value ? "yes" : "no") : f.value || "—"}</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <a href="/" className="text-[#FF6A00] font-extrabold text-[13px] underline">
          start your own shitbucket →
        </a>
      </div>
    </div>
  );
}
