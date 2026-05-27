import { calcBrewProgress, getBrewStage } from "@/lib/brew";
import { hashColor, timeAgo } from "@/lib/utils";

export default function IdeaCard({ idea, onClick }) {
  const brew = calcBrewProgress(idea);
  const stage = getBrewStage(brew);
  const tasksDone = (idea.tasks || []).filter(t => t.done).length;
  const tasksTotal = (idea.tasks || []).length;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl bg-bucket-card border border-bucket-border p-5 transition-all hover:border-bucket-border-hover group"
    >
      {/* Title */}
      <div className="flex justify-between items-start gap-3">
        <div className="text-[15px] font-semibold leading-snug text-bucket-text flex-1">
          {idea.title}
        </div>
        <span className="text-bucket-muted text-lg leading-none group-hover:text-bucket-text-dim transition">⋯</span>
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
  );
}
