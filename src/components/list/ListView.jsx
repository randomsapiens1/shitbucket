"use client";
import LiveClock from "@/components/ui/LiveClock";
import SortDropdown from "@/components/ui/SortDropdown";
import QuickDump from "@/components/list/QuickDump";
import TagFilter from "@/components/list/TagFilter";
import IdeaCard from "@/components/list/IdeaCard";

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
  onDump,
  onSelectIdea,
  onLogout,
}) {
  return (
    <div className="min-h-screen bg-black text-white pb-24 relative overflow-hidden max-w-xl mx-auto">

      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[320px] pointer-events-none"
        style={{ background: "radial-gradient(circle at top center, rgba(255,106,0,0.12), transparent 60%)" }}
      />

      {/* HEADER */}
      <div className="relative px-4 pt-5 pb-2 flex flex-col items-center">

        {/* Top bar: clock + logout */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="bg-[#111111] border border-[#222] rounded-xl px-4 py-2.5">
            <LiveClock />
          </div>
          <button
            onClick={onLogout}
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
        <p className="text-zinc-500 text-sm mt-3 tracking-wide">idea dumping ground</p>

        {/* Stats + search */}
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

      {/* Quick dump */}
      <QuickDump onDump={onDump} />

      {/* Tag filters */}
      {allTags.length > 0 && (
        <TagFilter tags={allTags} activeTag={filterTag} onSelect={setFilterTag} />
      )}

      {/* Section header */}
      {ideas.length > 0 && (
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span className="text-[14px] font-semibold text-white">Your Ideas</span>
          </div>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      )}

      {/* Idea cards */}
      <div className="px-4 pt-2 space-y-3">
        {filtered.length === 0 && ideas.length > 0 && (
          <div className="text-center text-zinc-600 text-[13px] py-16">
            nothing matches your search.
          </div>
        )}
        {filtered.map(idea => (
          <IdeaCard key={idea.id} idea={idea} onClick={() => onSelectIdea(idea.id)} />
        ))}
      </div>

    </div>
  );
}
