const links = [
  { icon: "✉️", label: "Email",  value: "rajkumaryhere@gmail.com", href: "mailto:rajkumaryhere@gmail.com" },
  { icon: "🐙", label: "GitHub", value: "randomsapiens1",           href: "https://github.com/randomsapiens1" },
];

export default function ReachOut() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-black/50 leading-relaxed">Built by Raj. Got a thought? Dump it.</p>
      {links.map(({ icon, label, value, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border-2 border-black rounded-2xl p-3 bg-[#FFF8EE] hover:bg-[#FF6A00] hover:text-white transition-all group shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] active:shadow-none"
        >
          <span className="text-xl leading-none">{icon}</span>
          <div>
            <p className="text-[9px] font-black tracking-widest uppercase text-black/40 group-hover:text-white/70 mb-0.5">{label}</p>
            <p className="font-bold text-xs">{value}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
