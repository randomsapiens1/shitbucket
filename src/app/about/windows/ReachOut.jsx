"use client";

const contactMethods = [
  { 
    label: "Email", 
    value: "rajkumaryhere@gmail.com", 
    href: "mailto:rajkumaryhere@gmail.com",
    icon: "✉️",
    desc: "Got a bug? A feature idea? Want to tell me the name is terrible?",
    color: "#CAFF00" // Lime
  },
  { 
    label: "Source", 
    value: "github.com/randomsapiens1", 
    href: "https://github.com/randomsapiens1",
    icon: "🐙",
    desc: "Peek into the bucket's internals. Fork it. Break it. Improve it.",
    color: "#B3D9FF" // Blue
  },
];

export default function ReachOut() {
  return (
    <div className="flex flex-col bg-[#FFF8EE] -m-6 h-full overflow-hidden">
      {/* Header Banner */}
      <div className="bg-black text-white p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[#FF6A00] text-4xl font-black">@</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>
        <h2 className="text-[calc((42/12)*var(--base-font-size))] font-black leading-[0.85] tracking-tighter uppercase mb-4">
          Reach <br />
          <span className="text-[#FF6A00]">Out</span>
        </h2>
        <p className="text-[calc((11/12)*var(--base-font-size))] font-bold uppercase tracking-[0.3em] text-white/40">
          Operative_Contact_v1.0
        </p>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-6">
        <div className="px-2">
          <p className="text-[calc((14/12)*var(--base-font-size))] font-bold text-black/60 leading-relaxed max-w-md">
            I read everything. Some of the best features started as messages from people like you using the product.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 gap-4">
          {contactMethods.map((m) => (
            <a
              key={m.label}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-4 border-black rounded-[32px] p-6 shadow-hard transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex flex-col sm:flex-row sm:items-center gap-6"
              style={{ backgroundColor: m.color }}
            >
              <div className="w-16 h-16 bg-white border-2 border-black rounded-2xl flex items-center justify-center text-3xl shadow-hard-sm shrink-0 group-hover:bg-[#FF6A00] transition-colors">
                {m.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/30">{m.label}</span>
                  <div className="h-px bg-black/10 flex-1" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-black mb-1">{m.value}</h3>
                <p className="text-[calc((12/12)*var(--base-font-size))] font-bold text-black/50 leading-tight">
                  {m.desc}
                </p>
              </div>
              <div className="hidden sm:block text-2xl opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                ↗
              </div>
            </a>
          ))}
        </div>

        {/* Footer Memo */}
        <div className="bg-[#FFE9A0] border-2 border-black rounded-2xl p-5 shadow-hard-sm mx-2">
          <p className="text-[calc((11/12)*var(--base-font-size))] font-bold text-black/70 italic text-center">
            "Design for people with a brain full of unfinished things. People like us."
          </p>
        </div>
      </div>

      {/* System info */}
      <div className="mt-auto p-4 border-t border-black/5 bg-white/50 flex justify-between items-center">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Handcrafted by Raj</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6A00]">Commit to the mess.</span>
      </div>
    </div>
  );
}
