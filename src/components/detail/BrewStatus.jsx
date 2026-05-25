export default function BrewStatus({ brew, stage }) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">brew status</span>
        <span className="text-[13px] text-[#ff6a00] font-medium">{stage.emoji} {stage.label}</span>
      </div>
      <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${brew}%`, background: "linear-gradient(90deg, #ff6a00, #ff8c32)" }}
        />
      </div>
      <div className="text-[11px] text-zinc-600 mt-1.5 text-right">{brew}% brewed</div>
    </div>
  );
}
