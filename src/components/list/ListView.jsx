"use client";
import { useState, useEffect, useRef } from "react";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import LiveClock from "@/components/ui/LiveClock";
import SortDropdown from "@/components/ui/SortDropdown";
import QuickDump from "@/components/list/QuickDump";
import TagFilter from "@/components/list/TagFilter";
import IdeaCard from "@/components/list/IdeaCard";

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
}) {
  const [lateNight,   setLateNight]   = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showMenu,    setShowMenu]    = useState(false);
  const triggered = useRef(false);

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
    <div className="min-h-screen bg-[#FFF8EE] text-black pb-24 max-w-xl mx-auto">

      {/* Late night warning */}
      {showWarning && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#FF6A00] text-black text-[13px] font-extrabold px-5 py-3 rounded-2xl border-2 border-black shadow-hard-lg animate-bounce">
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

      {/* ── Header ── */}
      <div className="sticky top-0 z-30 px-4 pt-4 pb-2 bg-[#FFF8EE]">
        <div
          className="flex items-center justify-between"
          style={{
            height: 88,
            borderRadius: 28,
            padding: "0 20px",
            background: "#F5F2EA",
            boxShadow:
              "0 2px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
            border: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          {/* Left: logo tile + wordmark */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo tile */}
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 54,
                height: 54,
                borderRadius: 17,
                background: "#FFFFFF",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <img
                src="/logo-shitBucket-day.png"
                alt="ShitBucket"
                style={{ width: 34, height: 34, objectFit: "contain" }}
              />
            </div>

            {/* Wordmark */}
            <span
              className="leading-none select-none truncate"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(24px, 7.5vw, 44px)",
                fontWeight: 800,
                color: "#0A0A0A",
                letterSpacing: "-0.03em",
              }}
            >
              ShitBucket
            </span>
          </div>

          {/* Right: menu button */}
          <div className="relative shrink-0 ml-3">
            <button
              onClick={() => setShowMenu(true)}
              className="flex items-center justify-center transition-all duration-150 hover:-translate-y-[2px] active:translate-y-[1px]"
              style={{
                width: 54,
                height: 54,
                borderRadius: 17,
                background: "#FFFFFF",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
              title="Menu"
            >
              {/* Staggered-width lines — premium feel */}
              <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
                <rect x="0" y="0"  width="18" height="2" rx="1" fill="#0A0A0A"/>
                <rect x="0" y="5.5" width="13" height="2" rx="1" fill="#0A0A0A"/>
                <rect x="0" y="11" width="8"  height="2" rx="1" fill="#0A0A0A"/>
              </svg>
            </button>
            {/* Orange notification dot */}
            <span
              className="absolute top-[10px] right-[10px] pointer-events-none"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#FF6A00",
                border: "1.5px solid #F5F2EA",
              }}
            />
          </div>
        </div>
      </div>

      {/* Time / date bar */}
      <LiveClock />

      {/* Stats + search */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
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
          />
        ))}
      </div>

    </div>
  );
}
