

"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { fetchIdeas, createIdea, updateIdea as dbUpdateIdea, deleteIdea as dbDeleteIdea, createShareLink } from "@/lib/db";

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

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

// ============================================================
// BREW STAGES
// ============================================================

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

// ============================================================
// FIELD TYPES
// ============================================================

const FIELD_TYPES = [
  { key: "text", label: "Text", icon: "Aa" },
  { key: "number", label: "Number", icon: "#" },
  { key: "checkbox", label: "Check", icon: "☑" },
  { key: "link", label: "Link", icon: "🔗" },
];

// ============================================================
// LIVE CLOCK
// ============================================================

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();
  };

  return (
    <span className="text-[13px] text-zinc-400 font-medium">
      time: {formatTime(time)}
    </span>
  );
}

// ============================================================
// SORT DROPDOWN
// ============================================================

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options = [
    { key: "newest", label: "Newest first" },
    { key: "oldest", label: "Oldest first" },
    { key: "brew", label: "Most brewed" },
    { key: "alpha", label: "A-Z" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[12px] text-zinc-500 bg-[#111111] border border-[#222] rounded-lg px-3 py-1.5 hover:border-[#333] transition"
      >
        {options.find(o => o.key === value)?.label || "Newest first"}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[#111111] border border-[#222] rounded-lg py-1 z-50 min-w-[120px]">
          {options.map(o => (
            <button
              key={o.key}
              onClick={() => { onChange(o.key); setOpen(false); }}
              className={`block w-full text-left px-3 py-1.5 text-[12px] ${value === o.key ? "text-[#ff6a00]" : "text-zinc-400 hover:text-white"} transition`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN BUCKET COMPONENT
// ============================================================

export default function Bucket({ onLogout }) {
  const [ideas, setIdeas] = useState([]);
  const [view, setView] = useState("list");
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [quickFocused, setQuickFocused] = useState(false);
  const quickRef = useRef(null);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => { loadIdeas(); }, []);

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

  // Sort and filter
  const filtered = ideas
    .filter((i) => !filterTag || (i.tags || []).includes(filterTag))
    .filter((i) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return i.title.toLowerCase().includes(q) ||
        (i.thought || "").toLowerCase().includes(q) ||
        (i.tags || []).some((t) => t.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.updated_at) - new Date(a.updated_at);
      if (sortBy === "oldest") return new Date(a.updated_at) - new Date(b.updated_at);
      if (sortBy === "brew") return calcBrewProgress(b) - calcBrewProgress(a);
      if (sortBy === "alpha") return a.title.localeCompare(b.title);
      return 0;
    });

  async function quickDump() {
    const val = quickRef.current?.value?.trim();
    if (!val) return;
    try {
      const newIdea = await createIdea({ title: val });
      setIdeas([newIdea, ...ideas]);
      quickRef.current.value = "";
      setCharCount(0);
      setQuickFocused(false);
    } catch (e) {
      console.error("Failed to create:", e);
    }
  }

  async function handleUpdateIdea(id, fn) {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    const updated = { ...idea };
    fn(updated);
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
      let text = `💡 ${idea.title}\\n`;
      if (idea.thought) text += `\\n${idea.thought}\\n`;
      text += `\\n— from shitbucket`;
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  }

  async function handleGetOut() {
    await supabase.auth.signOut();
    onLogout();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <img src="/shitbucket-header-pic.png" alt="Shitbucket" className="w-16 h-16 object-contain" />
        <div className="w-48 h-1.5 bg-[#1a1200] rounded-full overflow-hidden">
          <div className="h-full rounded-full animate-pulse" style={{ width: "60%", background: "linear-gradient(90deg, #992600, #b34d00, #997300)" }} />
        </div>
        <div className="text-zinc-600 text-xs tracking-widest">loading your shit...</div>
      </div>
    );
  }

  // ============================================================
  // LIST VIEW
  // ============================================================
  if (view === "list") {
    return (
      <div className="min-h-screen bg-black text-white pb-24 relative overflow-hidden max-w-xl mx-auto">

        {/* Top glow */}
        <div
          className="absolute top-0 left-0 right-0 h-[320px] pointer-events-none"
          style={{
            background: "radial-gradient(circle at top center, rgba(255,106,0,0.12), transparent 60%)",
          }}
        />

        {/* HEADER */}
        <div className="relative px-4 pt-5 pb-2 flex flex-col items-center">
          {/* Top row: time + get out */}
          <div className="w-full flex justify-between items-center mb-6">
            <div className="bg-[#111111] border border-[#222] rounded-xl px-4 py-2.5">
              <LiveClock />
            </div>

            <button
              onClick={handleGetOut}
              className="flex items-center gap-2 bg-[#111111] border border-[#222] rounded-xl px-4 py-2.5 hover:border-[#333] transition text-[13px] text-zinc-400"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              get out
            </button>
          </div>

          {/* Logo */}
          <img
            src="/shitbucket-header-pic.png"
            alt="Shitbucket"
            className="w-40 md:w-48 object-contain drop-shadow-[0_0_35px_rgba(255,106,0,0.18)]"
          />

          <p className="text-zinc-500 text-sm mt-3 tracking-wide">
            idea dumping ground
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-between w-full mt-8 gap-3">
            <div className="bg-[#111111] border border-[#222] rounded-xl px-4 py-3 text-[13px] text-zinc-400 flex items-center gap-2 flex-1">
              <span>{ideas.length} idea{ideas.length !== 1 ? "s" : ""}</span>
              <span>💡</span>
            </div>

            <div className="relative flex-1">
              <input
                className="w-full bg-[#111111] border border-[#222] rounded-xl px-4 py-3 text-[13px] text-white outline-none placeholder:text-zinc-600 focus:border-[#333] transition"
                placeholder="search for $ ideas"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs hover:text-zinc-400"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* QUICK DUMP */}
        <div className="relative px-4 pt-6">
          <div className="rounded-3xl bg-[#0d0d0d] border border-[#1a1a1a] p-5 shadow-[0_0_25px_rgba(255,106,0,0.03)]">
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-white">
                What\\'s in your head?
              </h2>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-zinc-500">
                  Write it down. Get it out.
                </p>
                <span className="text-[11px] text-zinc-600">
                  {charCount} / 500
                </span>
              </div>
            </div>

            <textarea
              ref={quickRef}
              rows={4}
              maxLength={500}
              placeholder="Type your idea here..."
              onFocus={() => setQuickFocused(true)}
              onBlur={() => setQuickFocused(false)}
              onChange={(e) => setCharCount(e.target.value.length)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  quickDump();
                }
              }}
              className="w-full rounded-2xl bg-black px-4 py-4 text-white resize-none outline-none placeholder:text-zinc-700 transition-all text-[14px] leading-relaxed"
              style={{
                border: `2px solid ${quickFocused ? "#ff6a00" : "#1a1a1a"}`,
                boxShadow: quickFocused ? "0 0 20px rgba(255,106,0,0.08)" : "none",
              }}
            />

            <button
              onClick={quickDump}
              className="mt-4 ml-auto flex items-center gap-2 rounded-2xl bg-[#ff6a00] px-6 py-3 font-semibold text-black hover:brightness-110 transition shadow-[0_0_25px_rgba(255,106,0,0.18)] text-[14px]"
            >
              🪣 Dump in bucket
            </button>
          </div>
        </div>

        {/* TAG FILTERS */}
        {allTags.length > 0 && (
          <div className="flex gap-1.5 px-4 pt-5 overflow-x-auto scrollbar-hide">
            <button
              className="shrink-0 border rounded-full px-3.5 py-1.5 text-[11px] transition"
              style={{
                background: !filterTag ? "#ff6a0018" : "transparent",
                borderColor: !filterTag ? "#ff6a0040" : "#222",
                color: !filterTag ? "#ff6a00" : "#666",
              }}
              onClick={() => setFilterTag(null)}
            >
              all
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                className="shrink-0 border rounded-full px-3.5 py-1.5 text-[11px] transition"
                style={{
                  background: filterTag === t ? hashColor(t) + "18" : "transparent",
                  borderColor: filterTag === t ? hashColor(t) + "40" : "#222",
                  color: filterTag === t ? hashColor(t) : "#666",
                }}
                onClick={() => setFilterTag(filterTag === t ? null : t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* SECTION HEADER */}
        {ideas.length > 0 && (
          <div className="flex items-center justify-between px-4 pt-6 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <span className="text-[14px] font-semibold text-white">Your Ideas</span>
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        )}

        {/* IDEA LIST */}
        <div className="px-4 pt-2 space-y-3">
          {filtered.length === 0 && ideas.length > 0 && (
            <div className="text-center text-zinc-600 text-[13px] py-16">
              nothing matches your search.
            </div>
          )}
          {filtered.map((idea) => {
            const brew = calcBrewProgress(idea);
            const stage = getBrewStage(brew);
            const tasksDone = (idea.tasks || []).filter((t) => t.done).length;
            const tasksTotal = (idea.tasks || []).length;

            return (
              <button
                key={idea.id}
                onClick={() => {
                  setActiveId(idea.id);
                  setView("detail");
                }}
                className="w-full text-left rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] p-5 transition-all hover:border-[#2a2a2a] group"
              >
                {/* Title + menu dots */}
                <div className="flex justify-between items-start gap-3">
                  <div className="text-[15px] font-semibold leading-snug text-white flex-1">
                    {idea.title}
                  </div>
                  <span className="text-zinc-600 text-lg leading-none group-hover:text-zinc-500 transition">⋯</span>
                </div>

                {/* Timestamp */}
                <div className="text-[11px] text-zinc-600 mt-2">
                  {timeAgo(idea.updated_at)}
                </div>

                {/* Progress bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-1 rounded-full bg-[#1a1a1a] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${brew}%`,
                        background: "linear-gradient(90deg, #ff6a00, #ff8c32)",
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 whitespace-nowrap">
                    {stage.emoji} {brew}%
                  </span>
                </div>

                {/* Tags & meta */}
                <div className="flex gap-2 mt-3 flex-wrap items-center">
                  {(idea.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-1 rounded-md font-medium"
                      style={{
                        background: `${hashColor(tag)}15`,
                        color: hashColor(tag),
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {tasksTotal > 0 && (
                    <span className="text-[10px] text-zinc-600">
                      ☑ {tasksDone}/{tasksTotal}
                    </span>
                  )}
                  {(idea.thoughts || []).length > 0 && (
                    <span className="text-[10px] text-zinc-600">
                      💭 {idea.thoughts.length}
                    </span>
                  )}
                  {(idea.links || []).length > 0 && (
                    <span className="text-[10px] text-zinc-600">
                      🔗 {idea.links.length}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================
  // DETAIL VIEW
  // ============================================================
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

// ============================================================
// DETAIL VIEW
// ============================================================
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
    <div className="min-h-screen bg-black text-white pb-24 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-zinc-500 text-[13px] hover:text-white transition">← back</button>
        <div className="flex gap-2">
          <button onClick={onShare} className="border border-[#222] text-zinc-500 hover:text-white hover:border-[#333] text-base px-2.5 py-1.5 rounded-lg transition">↗</button>
          <button onClick={() => setShowMenu(!showMenu)} className="border border-[#222] text-zinc-500 hover:text-white hover:border-[#333] text-base px-2.5 py-1.5 rounded-lg transition">⋯</button>
        </div>
      </div>

      {/* Menu */}
      {showMenu && (
        <div className="bg-[#111] border border-[#222] rounded-xl mx-4 mt-2 p-1 overflow-hidden">
          {!confirmDelete ? (
            <button className="block w-full text-left text-zinc-400 text-[13px] px-3 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition" onClick={() => setConfirmDelete(true)}>
              🗑 delete idea
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="text-red-500 text-[13px]">sure?</span>
              <button className="text-red-500 text-[13px] px-2 py-1 hover:underline" onClick={onDelete}>yes, delete</button>
              <button className="text-zinc-600 text-[13px] px-2 py-1 hover:text-zinc-400" onClick={() => { setConfirmDelete(false); setShowMenu(false); }}>cancel</button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-10">
        <h1 className="text-[22px] font-bold text-white leading-snug pt-5 pb-1">{idea.title}</h1>
        <div className="text-[11px] text-zinc-600 mb-5">
          created {new Date(idea.created_at).toLocaleDateString()} · updated {timeAgo(idea.updated_at)}
        </div>

        {/* Brew status */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">brew status</span>
            <span className="text-[13px] text-[#ff6a00] font-medium">{stage.emoji} {stage.label}</span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: brew + "%", background: "linear-gradient(90deg, #ff6a00, #ff8c32)" }} />
          </div>
          <div className="text-[11px] text-zinc-600 mt-1.5 text-right">{brew}% brewed</div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            {(idea.tags || []).map((t) => (
              <span key={t} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-medium" style={{ background: hashColor(t) + "15", color: hashColor(t), border: `1px solid ${hashColor(t)}30` }}>
                {t}<button onClick={() => removeTag(t)} className="opacity-50 hover:opacity-100 text-sm ml-0.5">×</button>
              </span>
            ))}
            <input
              className="bg-transparent border border-dashed border-[#333] rounded-xl px-3 py-1.5 text-zinc-500 text-xs outline-none w-24 focus:border-[#555] transition"
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
            <div key={t.id} className="flex items-center gap-3 py-3 border-b border-[#1a1a1a]" style={{ opacity: t.done ? 0.4 : 1 }}>
              <button onClick={() => toggleTask(t.id)} className="shrink-0">
                <div className="w-5 h-5 rounded-md flex items-center justify-center transition-all" style={{ border: `2px solid ${t.done ? "#ff6a00" : "#333"}`, background: t.done ? "#ff6a00" : "transparent" }}>
                  {t.done && <span className="text-black text-xs font-bold">✓</span>}
                </div>
              </button>
              <span className="flex-1 text-[13px] text-zinc-300" style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
              <button onClick={() => removeTask(t.id)} className="text-zinc-700 hover:text-zinc-500 text-base px-1 transition">×</button>
            </div>
          ))}
          <div className="flex gap-2 items-center mt-3">
            <input className="flex-1 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700" placeholder="add a task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
            {newTask.trim() && <button onClick={addTask} className="bg-[#111] border border-[#222] text-[#ff6a00] rounded-xl px-4 py-2.5 text-xs font-semibold hover:border-[#333] transition">add</button>}
          </div>
        </Section>

        {/* Thoughts */}
        <Section label="thoughts">
          {(idea.thoughts || []).map((t) => (
            <div key={t.id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3 mb-2">
              <div className="text-[13px] text-zinc-300 leading-relaxed">{t.text}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-zinc-600">{timeAgo(t.ts)}</span>
                <button onClick={() => removeThought(t.id)} className="text-zinc-700 hover:text-zinc-500 text-base px-1 transition">×</button>
              </div>
            </div>
          ))}
          <textarea className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3 text-zinc-300 text-[13px] outline-none resize-none mt-2 focus:border-[#333] transition placeholder:text-zinc-700" placeholder="add a thought..." value={newThought} onChange={(e) => setNewThought(e.target.value)} rows={2} />
          {newThought.trim() && <button onClick={addThought} className="bg-[#111] border border-[#222] text-[#ff6a00] rounded-xl px-4 py-2 text-xs font-semibold mt-2 hover:border-[#333] transition">add</button>}
        </Section>

        {/* Links */}
        <Section label="links">
          {(idea.links || []).map((l) => (
            <div key={l.id} className="flex justify-between items-center py-2.5 border-b border-[#1a1a1a]">
              <a href={l.url} target="_blank" rel="noreferrer" className="text-[#ff6a00] text-[13px] no-underline break-all flex-1 hover:underline">{l.label || l.url}</a>
              <button onClick={() => removeLink(l.id)} className="text-zinc-700 hover:text-zinc-500 text-base px-1 ml-2 transition">×</button>
            </div>
          ))}
          {!showAddLink ? (
            <button onClick={() => setShowAddLink(true)} className="w-full border border-dashed border-[#333] rounded-xl py-3 text-zinc-600 text-xs mt-1 hover:border-[#555] transition">+ add link</button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <input className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700" placeholder="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
              <input className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700" placeholder="label (optional)" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={addLink} className="bg-[#111] border border-[#222] text-[#ff6a00] rounded-xl px-4 py-2 text-xs font-semibold hover:border-[#333] transition">add</button>
                <button onClick={() => setShowAddLink(false)} className="text-zinc-600 text-xs hover:text-zinc-400 transition">cancel</button>
              </div>
            </div>
          )}
        </Section>

        {/* Custom fields */}
        <Section label="custom fields">
          {(idea.fields || []).map((f) => (
            <div key={f.id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 mb-2">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[11px] text-[#ff6a00] uppercase tracking-wide font-semibold">{f.name}</span>
                <button onClick={() => removeField(f.id)} className="text-zinc-700 hover:text-zinc-500 text-base px-1 transition">×</button>
              </div>
              {f.type === "text" && <input className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700" value={f.value || ""} onChange={(e) => updateField(f.id, e.target.value)} placeholder="enter value..." />}
              {f.type === "number" && <input className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700" type="number" value={f.value || ""} onChange={(e) => updateField(f.id, e.target.value)} placeholder="0" />}
              {f.type === "checkbox" && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all" style={{ border: `2px solid ${f.value ? "#ff6a00" : "#333"}`, background: f.value ? "#ff6a00" : "transparent" }} onClick={() => updateField(f.id, !f.value)}>
                    {f.value && <span className="text-black text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-[13px]" style={{ color: f.value ? "#ff6a00" : "#666" }}>{f.value ? "yes" : "no"}</span>
                </label>
              )}
              {f.type === "link" && <input className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700" value={f.value || ""} onChange={(e) => updateField(f.id, e.target.value)} placeholder="https://..." />}
            </div>
          ))}
          {!showAddField ? (
            <button onClick={() => setShowAddField(true)} className="w-full border border-dashed border-[#333] rounded-xl py-3 text-zinc-600 text-xs mt-1 hover:border-[#555] transition">+ add field</button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <input className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-zinc-300 text-[13px] outline-none focus:border-[#333] transition placeholder:text-zinc-700" placeholder="field name (e.g. Budget)" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
              <div className="flex gap-1.5">
                {FIELD_TYPES.map((ft) => (
                  <button key={ft.key} className="flex flex-col items-center gap-0.5 px-3 py-2.5 border rounded-xl flex-1 transition" style={{ background: fieldType === ft.key ? "#ff6a0015" : "transparent", borderColor: fieldType === ft.key ? "#ff6a0040" : "#1a1a1a", color: fieldType === ft.key ? "#ff6a00" : "#666" }} onClick={() => setFieldType(ft.key)}>
                    <span className="text-sm">{ft.icon}</span>
                    <span className="text-[10px]">{ft.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={addField} className="bg-[#111] border border-[#222] text-[#ff6a00] rounded-xl px-4 py-2 text-xs font-semibold hover:border-[#333] transition">add</button>
                <button onClick={() => setShowAddField(false)} className="text-zinc-600 text-xs hover:text-zinc-400 transition">cancel</button>
              </div>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

// ============================================================
// SECTION COMPONENT
// ============================================================
function Section({ label, children }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] text-[#ff6a00] uppercase tracking-[2px] font-semibold mb-3">
        {label}
      </div>
      {children}
    </div>
  );
}
