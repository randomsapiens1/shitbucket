export default function BrewStatus({ brew, stage }) {
  return (
    <div className="bg-bucket-card border border-bucket-border rounded-2xl p-4 mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] text-bucket-text-dim uppercase tracking-widest font-medium">brew status</span>
        <span className="text-[13px] text-bucket-accent font-medium">{stage.emoji} {stage.label}</span>
      </div>
      <div className="w-full h-1.5 bg-bucket-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${brew}%`, background: "linear-gradient(90deg, #ff6a00, #ff8c32)" }}
        />
      </div>
      <div className="text-[11px] text-bucket-muted mt-1.5 text-right">{brew}% brewed</div>
    </div>
  );
}
