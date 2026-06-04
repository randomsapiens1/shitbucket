import { memo } from "react";
import { calcBrewProgress, getBrewStage } from "@/lib/brew";
import { timeAgo, formatCountdown } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const BREW_PILL = {
  raw:     { bg: "#EFEFEF", color: "#555555" },
  maybe:   { bg: "#FFE0CC", color: "#000000" },
  cooking: { bg: "#FFD4B0", color: "#000000" },
  slaps:   { bg: "#FF6A00", color: "#ffffff" },
  gold:    { bg: "#CC5500", color: "#ffffff" },
};

export default memo(function IdeaCard({ idea, onClick, onPin, userId }) {
  const brew       = calcBrewProgress(idea);
  const stage      = getBrewStage(brew);
  const tasksDone  = (idea.tasks || []).filter(t => t.done).length;
  const tasksTotal = (idea.tasks || []).length;
  const pill       = BREW_PILL[stage.label] || BREW_PILL.raw;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: idea.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <button
        onClick={onClick}
        className={`w-full text-left rounded-3xl border-2 border-black shadow-hard p-5 bg-white transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] ${
          idea.pinned ? "border-l-[6px] border-l-[#FF6A00]" : ""
        } ${idea.optimistic ? "opacity-60 grayscale-[50%]" : "opacity-100"}`}
      >
        <div className="flex gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="mt-1.5 cursor-grab active:cursor-grabbing text-black/10 hover:text-black transition-colors shrink-0"
            title="Drag to reorder"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor">
              <circle cx="2" cy="3" r="1.5" /><circle cx="2" cy="9" r="1.5" /><circle cx="2" cy="15" r="1.5" />
              <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="9" r="1.5" /><circle cx="8" cy="15" r="1.5" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="text-[calc((16/12)*var(--base-font-size))] font-extrabold leading-snug text-black pr-8">
              {idea.title}
            </div>

            {/* Timestamp + expiry + shared badge */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[calc((11/12)*var(--base-font-size))] font-bold text-black/40">
                {timeAgo(idea.updated_at)}
              </span>
              {userId && idea.user_id !== userId && (
                <span className="text-[calc((10/12)*var(--base-font-size))] font-extrabold text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-full px-2 py-0.5 uppercase tracking-tight">
                  👥 shared
                </span>
              )}
              {idea.expires_at && (
                <>
                  <span className="text-black/20 text-[calc((10/12)*var(--base-font-size))]">•</span>
                  <span className="text-[calc((10/12)*var(--base-font-size))] font-extrabold text-[#FF6A00] uppercase tracking-tight">
                    {formatCountdown(idea.expires_at)}
                  </span>
                </>
              )}
            </div>

            {/* Brew pill + tags */}
            <div className="mt-3.5 flex items-center gap-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[calc((11/12)*var(--base-font-size))] font-extrabold uppercase tracking-wide border border-black/15 shadow-hard-sm"
                style={{ backgroundColor: pill.bg, color: pill.color }}
              >
                {stage.emoji} {brew}%
              </span>

              {(idea.tags || []).map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[calc((11/12)*var(--base-font-size))] font-bold border border-black/20 bg-[#FFF8EE] text-black"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Meta counts */}
            {(tasksTotal > 0 || (idea.thoughts || []).length > 0 || (idea.links || []).length > 0) && (
              <div className="flex gap-3 mt-3">
                {tasksTotal > 0 && (
                  <span className="text-[calc((11/12)*var(--base-font-size))] font-bold text-black/40">☑ {tasksDone}/{tasksTotal}</span>
                )}
                {(idea.thoughts || []).length > 0 && (
                  <span className="text-[calc((11/12)*var(--base-font-size))] font-bold text-black/40">💭 {idea.thoughts.length}</span>
                )}
                {(idea.links || []).length > 0 && (
                  <span className="text-[calc((11/12)*var(--base-font-size))] font-bold text-black/40">🔗 {idea.links.length}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Pin toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); onPin(!idea.pinned); }}
        className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all ${
          idea.pinned
            ? "opacity-100 text-[#FF6A00]"
            : "opacity-0 group-hover:opacity-40 hover:!opacity-100 text-black/50"
        }`}
        title={idea.pinned ? "Unpin idea" : "Pin idea"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={idea.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      </button>
    </div>
  );
});
