"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { fetchIdeas, createIdea, updateIdea as dbUpdateIdea, deleteIdea as dbDeleteIdea, createShareLink } from "@/lib/db";

const TAG_COLORS = [
  "#ff6a00", "#ff3d00", "#ffab00", "#ff6d3a", "#e85d04",
  "#ff8800", "#d45500", "#ffcc02", "#ff4400", "#c75000",
];

function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return TAG_COLORS[Math.abs(h) % TAG_COLORS.length];
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function timeAgo(ts) {
  const d = typeof ts === "string" ? new Date(ts) : new Date(ts);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString();
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

const FIELD_TYPES = [
  { key: "text", label: "Text", icon: "Aa" },
  { key: "number", label: "Number", icon: "#" },
  { key: "checkbox", label: "Check", icon: "☑" },
  { key: "link", label: "Link", icon: "🔗" },
];

export default function Bucket({ onLogout }) {
  const [ideas, setIdeas] = useState([]);
  const [view, setView] = useState("list");
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickFocused, setQuickFocused] = useState(false);
  const quickRef = useRef(null);

  // Load ideas from Supabase
  useEffect(() => {
    loadIdeas();
  }, []);

  async function loadIdeas() {
    try {
      const data = await fetchIdeas();
      setIdeas(data);
    } catch (e) {
      console.error("Failed to load:", e);
    }
    setLoading(false);
  }

  const activeIdea = ideas.find((i) => i.id === activeId);
  const allTags = [...new Set(ideas.flatMap((i) => i.tags || []))];

  const filtered = ideas
    .filter((i) => !filterTag || (i.tags || []).includes(filterTag))
    .filter((i) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return i.title.toLowerCase().includes(q) || (i.thought || "").toLowerCase().includes(q) || (i.tags || []).some((t) => t.toLowerCase().includes(q));
    });

  // Quick dump from main page
  async function quickDump() {
    const val = quickRef.current?.value?.trim();
    if (!val) return;
    try {
      const newIdea = await createIdea({ title: val });
      setIdeas([newIdea, ...ideas]);
      quickRef.current.value = "";
      setQuickFocused(false);
    } catch (e) {
      console.error("Failed to create:", e);
    }
  }

  // Update idea
  async function handleUpdateIdea(id, fn) {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    const updated = { ...idea };
    fn(updated);
    // Only send the mutable fields
    const payload = {
      title: updated.title,
      thought: updated.thought,
      thoughts: updated.thoughts,
      tags: updated.tags,
      links: updated.links,
      fields: updated.fields,
      tasks: updated.tasks,
    };
    try {
      const result = await dbUpdateIdea(id, payload);
      setIdeas(ideas.map((i) => (i.id === id ? result : i)));
    } catch (e) {
      console.error("Failed to update:", e);
    }
  }

  // Delete idea
  async function handleDeleteIdea(id) {
    try {
      await dbDeleteIdea(id);
      setIdeas(ideas.filter((i) => i.id !== id));
      setView("list");
      setActiveId(null);
    } catch (e) {
      console.error("Failed to delete:", e);
    }
  }

  // Share idea
  async function handleShareIdea(idea) {
    try {
      const token = await createShareLink(idea.id);
      const url = `${window.location.origin}/s/${token}`;
      if (navigator.share) {
        navigator.share({ title: idea.title, url }).catch(() => {
          navigator.clipboard.writeText(url);
          alert("Link copied!");
        });
      } else {
        navigator.clipboard.writeText(url);
        alert("Share link copied!");
      }
    } catch (e) {
      // Fallback to text share
      let text = `💡 ${idea.title}\n`;
      if (idea.thought) text += `\n${idea.thought}\n`;
      text += `\n— from shitbucket`;
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  }

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bucket-bg flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🪣</div>
        <div className="w-48 h-1.5 bg-[#1a1200] rounded-full overflow-hidden">
          <div className="h-full rounded-full animate-pulse" style={{ width: "60%", background: "linear-gradient(90deg, #992600, #b34d00, #997300)" }} />
        </div>
        <div className="text-bucket-muted text-xs tracking-widest">loading your shit...</div>
      </div>
    );
  }

  // ========== LIST VIEW ==========
  if (view === "list") {
    return (
      <div className="min-h-screen bg-bucket-bg pb-24 max-w-xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-4 pt-5 pb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🪣</span>
            <span className="text-xl font-extrabold" style={{ background: "linear-gradient(135deg, #cc5500, #b38600)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>shitbucket</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-bucket-muted">{ideas.length} idea{ideas.length !== 1 ? "s" : ""}</span>
            <button onClick={handleLogout} className="text-[11px] text-bucket-muted hover:text-bucket-accent-dim">logout</button>
          </div>
        </div>

        {/* Quick dump */}
        <div className="px-4 pt-1 pb-4">
          <textarea
            ref={quickRef}
            className="w-full bg-bucket-card rounded-xl px-3.5 py-3.5 text-white text-base outline-none resize-none transition-all"
            style={{
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: quickFocused ? "#804000" : "#1a1400",
              boxShadow: quickFocused ? "0 0 12px #ff6a0011" : "none",
              lineHeight: 1.5,
            }}
            placeholder="what's in your head?"
            rows={3}
            onFocus={() => setQuickFocused(true)}
            onBlur={() => setQuickFocused(false)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); quickDump(); } }}
          />
          <button onClick={quickDump} className="w-full mt-2.5 bg-[#0a0a08] border border-bucket-border text-bucket-accent rounded-xl py-3.5 text-[15px] font-bold tracking-wide">
            🪣 dump in bucket
          </button>
        </div>

        {/* Search + tags */}
        {ideas.length > 0 && (
          <>
            <div className="px-4 pb-2 relative">
              <input
                className="w-full bg-bucket-card border border-bucket-border rounded-lg px-3 py-2.5 text-bucket-text text-[13px] outline-none"
                placeholder="search the bucket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-6 top-2.5 text-bucket-muted text-sm">✕</button>
              )}
            </div>

            {allTags.length > 0 && (
              <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto">
                <button
                  className="shrink-0 border rounded-full px-3 py-1 text-[11px]"
                  style={{ background: !filterTag ? "#ff6a0033" : "transparent", borderColor: !filterTag ? "#ff6a0066" : "#1a1400", color: !filterTag ? "#ff6a00" : "#665530" }}
                  onClick={() => setFilterTag(null)}
                >all</button>
                {allTags.map((t) => (
                  <button
                    key={t}
                    className="shrink-0 border rounded-full px-3 py-1 text-[11px]"
                    style={{ background: filterTag === t ? hashColor(t) + "22" : "transparent", borderColor: filterTag === t ? hashColor(t) + "66" : "#1a1400", color: filterTag === t ? hashColor(t) : "#665530" }}
                    onClick={() => setFilterTag(filterTag === t ? null : t)}
                  >{t}</button>
                ))}
              </div>
            )}

            <div className="px-4 pb-1.5">
              <div className="text-[11px] text-bucket-muted uppercase tracking-[2px]">your ideas</div>
            </div>
          </>
        )}

        {/* Cards */}
        <div className="px-4">
          {filtered.length === 0 && ideas.length > 0 && (
            <div className="text-center text-bucket-muted text-[13px] py-16">nothing matches.</div>
          )}
          {filtered.map((idea) => {
            const brew = calcBrewProgress(idea);
            const stage = getBrewStage(brew);
            const tasksDone = (idea.tasks || []).filter(t => t.done).length;
            const tasksTotal = (idea.tasks || []).length;
            return (
              <button
                key={idea.id}
                className="block w-full text-left bg-bucket-card border border-bucket-border rounded-xl px-4 py-3.5 mb-2 cursor-pointer"
                onClick={() => { setActiveId(idea.id); setView("detail"); }}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="text-sm font-bold text-white leading-snug flex-1">{idea.title}</div>
                  <div className="text-[10px] text-bucket-muted whitespace-nowrap">{timeAgo(idea.updated_at)}</div>
                </div>
                {idea.thought && <div className="text-xs text-bucket-text-dim mt-1.5 leading-relaxed">{idea.thought.length > 80 ? idea.thought.slice(0, 80) + "..." : idea.thought}</div>}
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex-1 h-1 bg-[#1a1200] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: brew + "%", background: "linear-gradient(90deg, #992600, #b34d00, #997300)" }} />
                  </div>
                  <span className="text-[11px] text-bucket-muted whitespace-nowrap">{stage.emoji} {brew}%</span>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap items-center">
                  {(idea.tags || []).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-lg font-semibold" style={{ background: hashColor(t) + "18", color: hashColor(t) }}>{t}</span>
                  ))}
                  {(idea.thoughts || []).length > 0 && <span className="text-[10px] text-bucket-muted">💭 {idea.thoughts.length}</span>}
                  {tasksTotal > 0 && <span className="text-[10px] text-bucket-muted">☑ {tasksDone}/{tasksTotal}</span>}
                  {(idea.links || []).length > 0 && <span className="text-[10px] text-bucket-muted">🔗 {idea.links.length}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ========== DETAIL VIEW ==========
  if (view === "detail" && activeIdea) {
    return (
      <DetailView
        idea={activeIdea}
        onBack={() => { setView("list"); setActiveId(null); }}
        onUpdate={(fn) => handleUpdateIdea(activeId, fn)}
        onDelete={() => handleDeleteIdea(activeId)}
        onShare={() => handleShareIdea(activeIdea)}
      />
    );
  }

  return null;
}

// ========== DETAIL VIEW COMPONENT ==========
function DetailView({ idea, onBack, onUpdate, onDelete, onShare }) {
  const [newThought, setNewThought] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [showAddField, setShowAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newTask, setNewTask] = useState("");

  const brew = calcBrewProgress(idea);
  const stage = getBrewStage(brew);

  function addThought() {
    if (!newThought.trim()) return;
    onUpdate((i) => { i.thoughts = [...(i.thoughts || []), { id: genId(), text: newThought.trim(), ts: Date.now() }]; });
    setNewThought("");
  }
  function removeThought(tid) { onUpdate((i) => { i.thoughts = (i.thoughts || []).filter((t) => t.id !== tid); }); }
  function addTag() {
    const t = newTag.trim().toLowerCase();
    if (!t || (idea.tags || []).includes(t)) return;
    onUpdate((i) => { i.tags = [...(i.tags || []), t]; });
    setNewTag("");
  }
  function removeTag(tag) { onUpdate((i) => { i.tags = (i.tags || []).filter((t) => t !== tag); }); }
  function addLink() {
    if (!linkUrl.trim()) return;
    let url = linkUrl.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    onUpdate((i) => { i.links = [...(i.links || []), { id: genId(), url, label: linkLabel.trim() }]; });
    setLinkUrl(""); setLinkLabel(""); setShowAddLink(false);
  }
  function removeLink(lid) { onUpdate((i) => { i.links = (i.links || []).filter((l) => l.id !== lid); }); }
  function addField() {
    if (!fieldName.trim()) return;
    onUpdate((i) => { i.fields = [...(i.fields || []), { id: genId(), name: fieldName.trim(), type: fieldType, value: fieldType === "checkbox" ? false : "" }]; });
    setFieldName(""); setFieldType("text"); setShowAddField(false);
  }
  function updateField(fid, value) { onUpdate((i) => { i.fields = (i.fields || []).map((f) => f.id === fid ? { ...f, value } : f); }); }
  function removeField(fid) { onUpdate((i) => { i.fields = (i.fields || []).filter((f) => f.id !== fid); }); }
  function addTask() {
    if (!newTask.trim()) return;
    onUpdate((i) => { i.tasks = [...(i.tasks || []), { id: genId(), text: newTask.trim(), done: false, ts: Date.now() }]; });
    setNewTask("");
  }
  function toggleTask(tid) { onUpdate((i) => { i.tasks = (i.tasks || []).map((t) => t.id === tid ? { ...t, done: !t.done } : t); }); }
  function removeTask(tid) { onUpdate((i) => { i.tasks = (i.tasks || []).filter((t) => t.id !== tid); }); }

  return (
    <div className="min-h-screen bg-bucket-bg pb-24 max-w-xl mx-auto">
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-bucket-border">
        <button onClick={onBack} className="text-bucket-accent-dim text-[13px]">← back</button>
        <div className="flex gap-2">
          <button onClick={onShare} className="border border-bucket-border text-bucket-accent-dim text-base px-2.5 py-1 rounded-md">↗</button>
          <button onClick={() => setShowMenu(!showMenu)} className="border border-bucket-border text-bucket-accent-dim text-base px-2.5 py-1 rounded-md">⋯</button>
        </div>
      </div>

      {showMenu && (
        <div className="bg-[#111100] border border-bucket-border rounded-lg mx-4 mt-1 p-1">
          {!confirmDelete ? (
            <button className="block w-full text-left text-bucket-text text-[13px] px-3 py-2 rounded-md" onClick={() => setConfirmDelete(true)}>🗑 delete idea</button>
          ) : (
            <div className="flex items-center gap-2 px-2 py-1">
              <span className="text-red-500 text-[13px]">sure?</span>
              <button className="text-red-500 text-[13px] px-2 py-1" onClick={onDelete}>yes, delete</button>
              <button className="text-bucket-muted text-[13px] px-2 py-1" onClick={() => { setConfirmDelete(false); setShowMenu(false); }}>cancel</button>
            </div>
          )}
        </div>
      )}

      <div className="px-4 pb-10">
        <h1 className="text-2xl font-extrabold text-white leading-snug pt-4 pb-1">{idea.title}</h1>
        <div className="text-[11px] text-bucket-muted mb-4">
          created {new Date(idea.created_at).toLocaleDateString()} · updated {timeAgo(idea.updated_at)}
        </div>

        {/* Brew */}
        <div className="bg-bucket-card border border-bucket-border rounded-xl p-3.5 mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-bucket-muted uppercase tracking-widest">brew status</span>
            <span className="text-[13px] text-bucket-accent">{stage.emoji} {stage.label}</span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1200] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: brew + "%", background: "linear-gradient(90deg, #992600, #b34d00, #997300)" }} />
          </div>
          <div className="text-[11px] text-bucket-muted mt-1 text-right">{brew}% brewed</div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1.5 items-center">
            {(idea.tags || []).map((t) => (
              <span key={t} className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-xl font-semibold" style={{ background: hashColor(t) + "18", color: hashColor(t), border: `1px solid ${hashColor(t)}33` }}>
                {t}<button onClick={() => removeTag(t)} className="opacity-60 text-sm">×</button>
              </span>
            ))}
            <input
              className="bg-transparent border border-dashed border-bucket-border-hover rounded-xl px-2.5 py-1 text-bucket-muted text-xs outline-none w-20"
              placeholder="+ tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
            />
          </div>
        </div>

        {/* Tasks */}
        <Section label="tasks">
          {(idea.tasks || []).map((t) => (
            <div key={t.id} className="flex items-center gap-2.5 py-2.5 border-b border-bucket-border" style={{ opacity: t.done ? 0.5 : 1 }}>
              <button onClick={() => toggleTask(t.id)} className="shrink-0">
                <div className="w-[18px] h-[18px] rounded flex items-center justify-center transition-all" style={{ border: `2px solid ${t.done ? "#ff6a00" : "#2a2000"}`, background: t.done ? "#ff6a00" : "transparent" }}>
                  {t.done && <span className="text-black text-xs font-bold">✓</span>}
                </div>
              </button>
              <span className="flex-1 text-[13px] text-bucket-text" style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
              <button onClick={() => removeTask(t.id)} className="text-bucket-muted text-base px-1">×</button>
            </div>
          ))}
          <div className="flex gap-2 items-center mt-2">
            <input className="flex-1 bg-bucket-card border border-bucket-border rounded-lg px-3 py-2.5 text-bucket-text text-[13px] outline-none" placeholder="add a task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
            {newTask.trim() && <button onClick={addTask} className="bg-[#0a0a08] border border-bucket-border text-bucket-accent-dim rounded-md px-3.5 py-1.5 text-xs font-semibold">add</button>}
          </div>
        </Section>

        {/* Thoughts */}
        <Section label="thoughts">
          {(idea.thoughts || []).map((t) => (
            <div key={t.id} className="bg-bucket-card border border-bucket-border rounded-xl px-3.5 py-2.5 mb-1.5">
              <div className="text-[13px] text-bucket-text leading-relaxed">{t.text}</div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-bucket-muted">{timeAgo(t.ts)}</span>
                <button onClick={() => removeThought(t.id)} className="text-bucket-muted text-base px-1">×</button>
              </div>
            </div>
          ))}
          <textarea className="w-full bg-bucket-card border border-bucket-border rounded-lg px-3 py-2.5 text-bucket-text text-[13px] outline-none resize-none mt-2" placeholder="add a thought..." value={newThought} onChange={(e) => setNewThought(e.target.value)} rows={2} />
          {newThought.trim() && <button onClick={addThought} className="bg-[#0a0a08] border border-bucket-border text-bucket-accent-dim rounded-md px-3.5 py-1.5 text-xs font-semibold mt-1.5">add</button>}
        </Section>

        {/* Links */}
        <Section label="links">
          {(idea.links || []).map((l) => (
            <div key={l.id} className="flex justify-between items-center py-2 border-b border-bucket-border">
              <a href={l.url} target="_blank" rel="noreferrer" className="text-bucket-accent text-[13px] no-underline break-all flex-1">{l.label || l.url}</a>
              <button onClick={() => removeLink(l.id)} className="text-bucket-muted text-base px-1 ml-2">×</button>
            </div>
          ))}
          {!showAddLink ? (
            <button onClick={() => setShowAddLink(true)} className="w-full border border-dashed border-bucket-border-hover rounded-lg py-2.5 text-bucket-muted text-xs mt-1">+ add link</button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <input className="w-full bg-[#080804] border border-bucket-border rounded-md px-2.5 py-2 text-bucket-text text-[13px] outline-none" placeholder="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
              <input className="w-full bg-[#080804] border border-bucket-border rounded-md px-2.5 py-2 text-bucket-text text-[13px] outline-none" placeholder="label (optional)" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={addLink} className="bg-[#0a0a08] border border-bucket-border text-bucket-accent-dim rounded-md px-3.5 py-1.5 text-xs font-semibold">add</button>
                <button onClick={() => setShowAddLink(false)} className="text-bucket-muted text-xs">cancel</button>
              </div>
            </div>
          )}
        </Section>

        {/* Custom fields */}
        <Section label="custom fields">
          {(idea.fields || []).map((f) => (
            <div key={f.id} className="bg-bucket-card border border-bucket-border rounded-xl p-3 mb-1.5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] text-bucket-accent uppercase tracking-wide">{f.name}</span>
                <button onClick={() => removeField(f.id)} className="text-bucket-muted text-base px-1">×</button>
              </div>
              {f.type === "text" && <input className="w-full bg-[#080804] border border-bucket-border rounded-md px-2.5 py-2 text-bucket-text text-[13px] outline-none" value={f.value || ""} onChange={(e) => updateField(f.id, e.target.value)} placeholder="enter value..." />}
              {f.type === "number" && <input className="w-full bg-[#080804] border border-bucket-border rounded-md px-2.5 py-2 text-bucket-text text-[13px] outline-none" type="number" value={f.value || ""} onChange={(e) => updateField(f.id, e.target.value)} placeholder="0" />}
              {f.type === "checkbox" && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="w-[18px] h-[18px] rounded flex items-center justify-center cursor-pointer" style={{ border: `2px solid ${f.value ? "#ff6a00" : "#2a2000"}`, background: f.value ? "#ff6a00" : "transparent" }} onClick={() => updateField(f.id, !f.value)}>
                    {f.value && <span className="text-black text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-[13px]" style={{ color: f.value ? "#ff6a00" : "#665530" }}>{f.value ? "yes" : "no"}</span>
                </label>
              )}
              {f.type === "link" && <input className="w-full bg-[#080804] border border-bucket-border rounded-md px-2.5 py-2 text-bucket-text text-[13px] outline-none" value={f.value || ""} onChange={(e) => updateField(f.id, e.target.value)} placeholder="https://..." />}
            </div>
          ))}
          {!showAddField ? (
            <button onClick={() => setShowAddField(true)} className="w-full border border-dashed border-bucket-border-hover rounded-lg py-2.5 text-bucket-muted text-xs mt-1">+ add field</button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <input className="w-full bg-[#080804] border border-bucket-border rounded-md px-2.5 py-2 text-bucket-text text-[13px] outline-none" placeholder="field name (e.g. Budget)" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
              <div className="flex gap-1.5">
                {FIELD_TYPES.map((ft) => (
                  <button key={ft.key} className="flex flex-col items-center gap-0.5 px-3 py-2 border rounded-lg flex-1" style={{ background: fieldType === ft.key ? "#ff6a0033" : "transparent", borderColor: fieldType === ft.key ? "#ff6a0066" : "#1a1400", color: fieldType === ft.key ? "#ff6a00" : "#665530" }} onClick={() => setFieldType(ft.key)}>
                    <span>{ft.icon}</span>
                    <span className="text-[10px]">{ft.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={addField} className="bg-[#0a0a08] border border-bucket-border text-bucket-accent-dim rounded-md px-3.5 py-1.5 text-xs font-semibold">add</button>
                <button onClick={() => setShowAddField(false)} className="text-bucket-muted text-xs">cancel</button>
              </div>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] text-bucket-accent uppercase tracking-[2px] font-semibold mb-2.5">{label}</div>
      {children}
    </div>
  );
}
