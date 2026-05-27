import { calcBrewProgress, getBrewStage } from "@/lib/brew";
import { hashColor, timeAgo } from "@/lib/utils";

export default function IdeaCard({ idea, onClick, onPin }) {
  const brew = calcBrewProgress(idea);
  const stage = getBrewStage(brew);
  const tasksDone = (idea.tasks || []).filter(t => t.done).length;
  const tasksTotal = (idea.tasks || []).length;

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full text-left rounded-2xl bg-bucket-card border transition-all hover:border-bucket-border-hover p-5 ${
          idea.pinned ? "border-l-4 border-l-bucket-accent border-y-bucket-border border-r-bucket-border" : "border-bucket-border"
        }`}
      >
        {/* Title */}
        <div className="flex justify-between items-start gap-3 pr-6">
          <div className="text-[15px] font-semibold leading-snug text-bucket-text flex-1">
            {idea.title}
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-[11px] text-bucket-muted mt-2">
          {timeAgo(idea.updated_at)}
        </div>

        {/* Brew progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1 rounded-full bg-bucket-bg overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${brew}%`, background: "linear-gradient(90deg, var(--bucket-accent), #ff8c32)" }}
            />
          </div>
          <span className="text-[11px] text-bucket-text-dim whitespace-nowrap">
            {stage.emoji} {brew}%
          </span>
        </div>

        {/* Tags & meta counts */}
        <div className="flex gap-2 mt-3 flex-wrap items-center">
          {(idea.tags || []).map(tag => (
            <span
              key={tag}
              className="text-[10px] px-2 py-1 rounded-md font-medium"
              style={{ background: `${hashColor(tag)}15`, color: hashColor(tag) }}
            >
              {tag}
            </span>
          ))}
          {tasksTotal > 0 && (
            <span className="text-[10px] text-bucket-muted">☑ {tasksDone}/{tasksTotal}</span>
          )}
          {(idea.thoughts || []).length > 0 && (
            <span className="text-[10px] text-bucket-muted">💭 {idea.thoughts.length}</span>
          )}
          {(idea.links || []).length > 0 && (
            <span className="text-[10px] text-bucket-muted">🔗 {idea.links.length}</span>
          )}
        </div>
      </button>

      {/* Pin Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPin(!idea.pinned);
        }}
        className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all ${
          idea.pinned 
            ? "text-bucket-accent opacity-100" 
            : "text-bucket-muted opacity-0 group-hover:opacity-100 hover:text-bucket-text-dim"
        }`}
        title={idea.pinned ? "Unpin idea" : "Pin idea"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={idea.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      </button>
    </div>
  );
}
