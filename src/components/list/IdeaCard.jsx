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
      className="w-full text-left rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] p-5 transition-all hover:border-[#2a2a2a] group"
    >
      {/* Title */}
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

      {/* Brew progress bar */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-1 rounded-full bg-[#1a1a1a] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${brew}%`, background: "linear-gradient(90deg, #ff6a00, #ff8c32)" }}
          />
        </div>
        <span className="text-[11px] text-zinc-500 whitespace-nowrap">
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
          <span className="text-[10px] text-zinc-600">☑ {tasksDone}/{tasksTotal}</span>
        )}
        {(idea.thoughts || []).length > 0 && (
          <span className="text-[10px] text-zinc-600">💭 {idea.thoughts.length}</span>
        )}
        {(idea.links || []).length > 0 && (
          <span className="text-[10px] text-zinc-600">🔗 {idea.links.length}</span>
        )}
      </div>
    </button>
  );
}
