const steps = [
  { n: "01", icon: "📝", title: "DUMP", desc: "Capture the thought raw. No editing, no organizing. Just get it out of your head." },
  { n: "02", icon: "🔄", title: "BREW", desc: "Add to it over time — thoughts, tasks, links, tags, custom fields." },
  { n: "03", icon: "🏆", title: "GOLD", desc: "Hit 95% brew score. Ship it, share it, or act on it." },
];

export default function HowItWorks() {
  return (
    <div className="space-y-3">
      {steps.map(s => (
        <div key={s.n} className="flex gap-3 border-2 border-black rounded-2xl p-3 bg-[#FFF8EE]">
          <span className="text-2xl leading-none mt-0.5">{s.icon}</span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-0.5">{s.n}</p>
            <p className="font-black text-xs uppercase tracking-wider">{s.title}</p>
            <p className="text-xs text-black/60 mt-0.5 leading-relaxed">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
