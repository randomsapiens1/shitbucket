"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSharedIdea } from "@/lib/db";

const TAG_COLORS = [
  "#ff6a00", "#ff3d00", "#ffab00", "#ff6d3a", "#e85d04",
  "#ff8800", "#d45500", "#ffcc02", "#ff4400", "#c75000",
];

function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return TAG_COLORS[Math.abs(h) % TAG_COLORS.length];
}

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

const BREW_STAGES = [
  { min: 0, label: "raw dump", emoji: "💩" },
  { min: 15, label: "starting to stink", emoji: "🦨" },
  { min: 35, label: "fermenting", emoji: "🧪" },
  { min: 55, label: "bubbling up", emoji: "🫧" },
  { min: 75, label: "almost cooked", emoji: "🔥" },
  { min: 95, label: "pure gold", emoji: "✨" },
];

function getBrewStage(pct) {
  let stage = BREW_STAGES[0];
  for (const s of BREW_STAGES) if (pct >= s.min) stage = s;
  return stage;
}

export default function SharedIdeaPage() {
  const params = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.token) return;
    getSharedIdea(params.token)
      .then((data) => {
        if (data) setIdea(data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-5xl">🪣</div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-4xl">🪣</div>
        <p className="text-[#665530] text-sm text-center">this idea doesn't exist or the link has expired.</p>
        <a href="/" className="text-[#b35900] text-xs underline">go to shitbucket</a>
      </div>
    );
  }

  const brew = calcBrewProgress(idea);
  const stage = getBrewStage(brew);
  const tasksDone = (idea.tasks || []).filter(t => t.done).length;
  const tasksTotal = (idea.tasks || []).length;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e8dcc8] font-mono max-w-xl mx-auto px-4 py-6 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🪣</span>
        <span className="text-sm font-bold" style={{ background: "linear-gradient(135deg, #cc5500, #b38600)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>shitbucket</span>
        <span className="text-[10px] text-[#665530] ml-auto">shared idea</span>
      </div>

      <h1 className="text-2xl font-extrabold text-white leading-snug mb-2">{idea.title}</h1>

      {/* Brew */}
      <div className="bg-[#0c0c0c] border border-[#1a1400] rounded-xl p-3.5 mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[#665530] uppercase tracking-widest">brew status</span>
          <span className="text-[13px] text-[#ff6a00]">{stage.emoji} {stage.label}</span>
        </div>
        <div className="w-full h-1.5 bg-[#1a1200] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: brew + "%", background: "linear-gradient(90deg, #992600, #b34d00, #997300)" }} />
        </div>
      </div>

      {/* Tags */}
      {(idea.tags || []).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {idea.tags.map((t) => (
            <span key={t} className="text-xs px-3 py-1 rounded-xl font-semibold" style={{ background: hashColor(t) + "18", color: hashColor(t) }}>{t}</span>
          ))}
        </div>
      )}

      {/* Tasks */}
      {tasksTotal > 0 && (
        <div className="mb-5">
          <div className="text-[11px] text-[#ff6a00] uppercase tracking-[2px] font-semibold mb-2">tasks ({tasksDone}/{tasksTotal})</div>
          {idea.tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-2.5 py-2 border-b border-[#1a1400]" style={{ opacity: t.done ? 0.5 : 1 }}>
              <span className="text-[13px]">{t.done ? "☑" : "☐"}</span>
              <span className="text-[13px]" style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Thoughts */}
      {(idea.thoughts || []).length > 0 && (
        <div className="mb-5">
          <div className="text-[11px] text-[#ff6a00] uppercase tracking-[2px] font-semibold mb-2">thoughts</div>
          {idea.thoughts.map((t, i) => (
            <div key={i} className="bg-[#0c0c0c] border border-[#1a1400] rounded-xl px-3.5 py-2.5 mb-1.5">
              <div className="text-[13px] leading-relaxed">{t.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Links */}
      {(idea.links || []).length > 0 && (
        <div className="mb-5">
          <div className="text-[11px] text-[#ff6a00] uppercase tracking-[2px] font-semibold mb-2">links</div>
          {idea.links.map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="block text-[#ff6a00] text-[13px] py-1.5 no-underline break-all">{l.label || l.url}</a>
          ))}
        </div>
      )}

      {/* Fields */}
      {(idea.fields || []).length > 0 && (
        <div className="mb-5">
          <div className="text-[11px] text-[#ff6a00] uppercase tracking-[2px] font-semibold mb-2">details</div>
          {idea.fields.map((f, i) => (
            <div key={i} className="flex justify-between py-1.5 border-b border-[#1a1400]">
              <span className="text-[11px] text-[#665530] uppercase">{f.name}</span>
              <span className="text-[13px]">{f.type === "checkbox" ? (f.value ? "yes" : "no") : f.value || "—"}</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <a href="/" className="text-[#b35900] text-xs">start your own shitbucket →</a>
      </div>
    </div>
  );
}
