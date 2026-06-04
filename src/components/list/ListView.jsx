"use client";
import { useState, useEffect, useRef } from "react";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import SortDropdown from "@/components/ui/SortDropdown";
import QuickDump from "@/components/list/QuickDump";
import TagFilter from "@/components/list/TagFilter";
import IdeaCard from "@/components/list/IdeaCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

function getTimeOfDayIcon(h) {
  if (h >= 5  && h < 12) return "☀";
  if (h >= 12 && h < 17) return "◑";
  if (h >= 17 && h < 21) return "◐";
  return "●";
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
  onReorderIdeas,
  sessionStart,
  userId,
  error,
  onRetry,
}) {
  const [lateNight,   setLateNight]   = useState(false);
  const [showMenu,    setShowMenu]    = useState(false);
  const [now,         setNow]         = useState(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function check() {
      const h = new Date().getHours();
      setLateNight(h >= 0 && h < 6);
    }
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = ideas.findIndex((i) => i.id === active.id);
      const newIndex = ideas.findIndex((i) => i.id === over.id);
      onReorderIdeas(oldIndex, newIndex);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#121212] pb-24 max-w-xl mx-auto">

      {/* Error state */}
      {error && (
        <div className="px-4 pt-4">
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 flex flex-col gap-3 shadow-hard-sm">
            <div className="flex items-start gap-3 text-red-700">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-[calc((13/12)*var(--base-font-size))] font-extrabold uppercase tracking-tight">Load Error</p>
                <p className="text-[calc((12/12)*var(--base-font-size))] font-bold opacity-80">{error}</p>
              </div>
            </div>
            <button
              onClick={onRetry}
              className="bg-red-500 text-white font-extrabold text-[calc((12/12)*var(--base-font-size))] px-4 py-2 rounded-xl border-2 border-red-500 shadow-hard-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              retry loading
            </button>
          </div>
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
                fontFamily: "'Inter', sans-serif",
                fontSize: 'calc((18/12)*var(--base-font-size))',
                fontWeight: 800,
                color: "#0A0A0A",
                letterSpacing: "-0.02em",
              }}
            >
              ShitBucket
            </span>
          </div>

          {/* Center: date */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {now && (
              <div className="flex flex-col items-end shrink-0" style={{ gap: 2 }}>
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: 'calc((8/12)*var(--base-font-size))', color: "rgba(10,10,10,0.35)", lineHeight: 1 }}>
                    {getTimeOfDayIcon(now.getHours())}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 'calc((8/12)*var(--base-font-size))', fontWeight: 700, color: "#FF6A00", letterSpacing: "0.14em" }}>
                    {now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                  </span>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 'calc((13/12)*var(--base-font-size))', fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                  {now.toLocaleDateString("en-US", { month: "short" }).toUpperCase()} {String(now.getDate()).padStart(2, "0")}
                </span>
              </div>
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
        <div className="bg-black text-white rounded-xl px-4 py-2.5 text-[calc((12/12)*var(--base-font-size))] font-extrabold flex items-center gap-2 shadow-hard-sm whitespace-nowrap">
          <span>{ideas.length} {ideas.length === 1 ? "idea" : "ideas"}</span>
        </div>

        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            className="w-full bg-white border-2 border-black rounded-2xl pl-10 pr-10 py-2.5 text-[calc((13/12)*var(--base-font-size))] font-bold text-black outline-none placeholder:text-black/30 focus:bg-[#FFF8EE] transition shadow-hard-sm"
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
          <span className="text-[calc((22/12)*var(--base-font-size))] font-extrabold uppercase tracking-tight text-black">
            the pile
          </span>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      )}

      {/* Idea cards */}
      <div className="px-4 pt-1 space-y-3 pb-4">
        {filtered.length === 0 && ideas.length > 0 && (
          <div className="text-center font-bold text-black/30 text-[calc((13/12)*var(--base-font-size))] py-16">
            nothing here yet.
          </div>
        )}
        {ideas.length === 0 && (
          <div className="text-center font-bold text-black/30 text-[calc((13/12)*var(--base-font-size))] py-10">
            your pile is empty. dump something!
          </div>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={filtered.map(i => i.id)} strategy={verticalListSortingStrategy}>
            {filtered.map(idea => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onClick={() => onSelectIdea(idea.id)}
                onPin={(pinned) => onUpdateIdea(idea.id, (i) => { i.pinned = pinned; })}
                userId={userId}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

    </div>
  );
}
