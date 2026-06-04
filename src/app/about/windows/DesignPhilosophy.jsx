const principles = [
  ["Hard shadows",   "Borders that commit."],
  ["High contrast",  "Black on cream. No apologies."],
  ["Zero gradients", "Your ideas don't need decoration."],
  ["Extrabold type", "Text that doesn't whisper."],
  ["Brutalism",      "Honest UI for honest thinking."],
];

export default function DesignPhilosophy() {
  return (
    <div className="space-y-4">
      <p className="font-black text-sm uppercase leading-snug">Honest UI for honest thinking.</p>
      <div className="space-y-2.5">
        {principles.map(([label, desc]) => (
          <div key={label} className="flex gap-2 items-start">
            <span className="text-[#FF6A00] font-black text-xs shrink-0 mt-px">—</span>
            <p className="text-xs leading-relaxed">
              <span className="font-black uppercase tracking-wider">{label} </span>
              <span className="text-black/50">{desc}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
