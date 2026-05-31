"use client";
import { useState, useEffect, useRef } from "react";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import SortDropdown from "@/components/ui/SortDropdown";
import QuickDump from "@/components/list/QuickDump";
import TagFilter from "@/components/list/TagFilter";
import IdeaCard from "@/components/list/IdeaCard";

function getTimeOfDayIcon(h) {
  if (h >= 5  && h < 12) return "☀";
  if (h >= 12 && h < 17) return "◑";
  if (h >= 17 && h < 21) return "◐";
  return "●";
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25, 0.5].forEach((offset, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 520 + i * 120;
      gain.gain.setValueAtTime(0.4, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.2);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.2);
    });
  } catch (_e) {}
}

export default function ListView({
  ideas,
  filtered,
  allTags,
  filterTag,
  setFilterTag,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  fontSize,
  setFontSize,
  onDump,
  onSelectIdea,
  onLogout,
  onUpdateIdea,
  sessionStart,
  userId,
  error,
  onRetry,
}) {
  const [lateNight,   setLateNight]   = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showMenu,    setShowMenu]    = useState(false);
  const [now,         setNow]         = useState(null);
  const triggered = useRef(false);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function check() {
      const now     = new Date();
      const hour    = now.getHours();
      const elapsed = Date.now() - sessionStart;
      if (hour >= 2 && hour < 6 && elapsed >= 30 * 60 * 1000 && !triggered.current) {
        triggered.current = true;
        setLateNight(true);
        setShowWarning(true);
        playBeep();
        setTimeout(() => setShowWarning(false), 5000);
      }
    }
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, [sessionStart]);

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#121212] pb-24 max-w-xl mx-auto">

      {/* Error state */}
      {error && (
        <div className="px-4 pt-4">
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 flex flex-col gap-3 shadow-hard-sm">
            <div className="flex items-start gap-3 text-red-700">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-[13px] font-extrabold uppercase tracking-tight">Load Error</p>
                <p className="text-[12px] font-bold opacity-80">{error}</p>
              </div>
            </div>
            <button
              onClick={onRetry}
              className="bg-red-500 text-white font-extrabold text-[12px] px-4 py-2 rounded-xl border-2 border-red-500 shadow-hard-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              retry loading
            </button>
          </div>
        </div>
      )}

      {/* Late night warning */}
      {showWarning && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#FF6A00] text-[#121212] text-[13px] font-extrabold px-5 py-3 rounded-2xl border-2 border-[#121212] shadow-hard-lg animate-bounce">
          <span>🚨</span>
          <span>it&apos;s past 2am. go to sleep.</span>
          <button onClick={() => setShowWarning(false)} className="ml-1 opacity-60 hover:opacity-100 text-base leading-none">×</button>
        </div>
      )}

      <HamburgerMenu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onLogout={onLogout}
        lateNight={lateNight}
      />

      {/* ── Header (logo + clock + menu merged) ── */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="flex items-center gap-3"
          style={{
            height: 64,
            borderRadius: 20,
            padding: "0 16px",
            background: "#F5F2EA",
            boxShadow:
              "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)",
            border: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          {/* Left: logo + wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/logo-shitBucket-day.png"
              alt="ShitBucket"
              style={{ width: 28, height: 28, objectFit: "contain" }}
            />
            <span
              className="leading-none select-none"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                fontWeight: 800,
                color: "#0A0A0A",
                letterSpacing: "-0.02em",
              }}
            >
              ShitBucket
            </span>
          </div>

          {/* Center: clock */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {now && (
              <>
                {/* Time */}
                <div className="flex items-baseline gap-1 shrink-0">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.03em" }}>
                    {String(now.getHours() % 12 || 12).padStart(2, "0")}:{String(now.getMinutes()).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: "rgba(10,10,10,0.35)", letterSpacing: "0.06em" }}>
                    {now.getHours() >= 12 ? "PM" : "AM"}
                  </span>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 24, background: "rgba(0,0,0,0.1)", flexShrink: 0 }} />

                {/* Date */}
                <div className="flex flex-col items-end shrink-0" style={{ gap: 2 }}>
                  <div className="flex items-center gap-1">
                    <span style={{ fontSize: 8, color: "rgba(10,10,10,0.35)", lineHeight: 1 }}>
                      {getTimeOfDayIcon(now.getHours())}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 700, color: "#FF6A00", letterSpacing: "0.14em" }}>
                      {now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                    {now.toLocaleDateString("en-US", { month: "short" }).toUpperCase()} {String(now.getDate()).padStart(2, "0")}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Right: menu button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu(true)}
              className="flex items-center justify-center transition-all duration-150 active:scale-95"
              style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                background: "#FFFFFF",
                boxShadow: "0 1px 6px rgba(0,0,0,0.09), 0 1px 2px rgba(0,0,0,0.05)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
              title="Menu"
            >
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <rect x="0" y="0"   width="16" height="2" rx="1" fill="#0A0A0A"/>
                <rect x="0" y="5"   width="11" height="2" rx="1" fill="#0A0A0A"/>
                <rect x="0" y="10"  width="7"  height="2" rx="1" fill="#0A0A0A"/>
              </svg>
            </button>
            <span
              className="absolute top-[8px] right-[8px] pointer-events-none"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#FF6A00",
                border: "1.5px solid #F5F2EA",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats + search */}
      <div className="px-4 pb-2 flex items-center gap-2">
        <div className="bg-black text-white rounded-xl px-4 py-2.5 text-[12px] font-extrabold flex items-center gap-2 shadow-hard-sm whitespace-nowrap">
          <span>💡</span>
          <span>{ideas.length} {ideas.length === 1 ? "idea" : "ideas"}</span>
        </div>

        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            className="w-full bg-white border-2 border-black rounded-2xl pl-10 pr-10 py-2.5 text-[13px] font-bold text-black outline-none placeholder:text-black/30 focus:bg-[#FFF8EE] transition shadow-hard-sm"
            placeholder="search your pile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Quick dump */}
      <QuickDump onDump={onDump} allTags={allTags} />

      {/* Tag filters */}
      {allTags.length > 0 && (
        <TagFilter tags={allTags} activeTag={filterTag} onSelect={setFilterTag} />
      )}

      {/* Section header */}
      {ideas.length > 0 && (
        <div className="flex items-center justify-between px-4 pt-7 pb-3">
          <span className="text-[22px] font-extrabold uppercase tracking-tight text-black">
            the pile
          </span>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      )}

      {/* Idea cards */}
      <div className="px-4 pt-1 space-y-3 pb-4">
        {filtered.length === 0 && ideas.length > 0 && (
          <div className="text-center font-bold text-black/30 text-[13px] py-16">
            nothing here yet.
          </div>
        )}
        {ideas.length === 0 && (
          <div className="text-center font-bold text-black/30 text-[13px] py-10">
            your pile is empty. dump something!
          </div>
        )}
        {filtered.map(idea => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onClick={() => onSelectIdea(idea.id)}
            onPin={(pinned) => onUpdateIdea(idea.id, (i) => { i.pinned = pinned; })}
            userId={userId}
          />
        ))}
      </div>

    </div>
  );
}
