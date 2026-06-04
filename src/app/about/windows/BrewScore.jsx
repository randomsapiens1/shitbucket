const stages = [
  { emoji: "🪨", label: "RAW",     pct: 0,  desc: "Just the title." },
  { emoji: "🤔", label: "MAYBE",   pct: 20, desc: "A note or two." },
  { emoji: "🔥", label: "COOKING", pct: 45, desc: "Getting somewhere." },
  { emoji: "💥", label: "SLAPS",   pct: 70, desc: "This might actually work." },
  { emoji: "🥇", label: "GOLD",    pct: 95, desc: "Ship it." },
];

export default function BrewScore() {
  return (
    <div className="space-y-2">
      {stages.map(({ emoji, label, pct, desc }) => (
        <div key={label} className="border-2 border-black rounded-xl p-2.5 bg-[#FFF8EE]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{emoji}</span>
              <div>
                <p className="font-black text-[10px] uppercase tracking-widest leading-none">{label}</p>
                <p className="text-[9px] text-black/50 mt-0.5">{desc}</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-black/30 shrink-0">{pct}%</span>
          </div>
          <div className="h-2 bg-black/10 rounded-full overflow-hidden border border-black/10">
            <div
              className="h-full bg-[#FF6A00] rounded-full transition-all"
              style={{ width: `${pct === 0 ? 2 : pct}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-[9px] text-black/40 text-center pt-1">
        Score builds from thoughts, tasks, links, tags & fields.
      </p>
    </div>
  );
}
