"use client";

const principles = [
  { 
    label: "Hard Shadows",   
    desc: "Borders that commit. No blurs, no indecision.", 
    color: "#CAFF00", // Lime
    icon: "⬛" 
  },
  { 
    label: "High Contrast",  
    desc: "Black on cream. No apologies for being loud.", 
    color: "#FFB3D0", // Pink
    icon: "◑" 
  },
  { 
    label: "Zero Gradients", 
    desc: "Your ideas don't need decoration. Just data.", 
    color: "#B3D9FF", // Blue
    icon: "⊘" 
  },
  { 
    label: "Extrabold Type", 
    desc: "Text that doesn't whisper. Say it like you mean it.", 
    color: "#FFE9A0", // Yellow
    icon: "Aa" 
  },
];

export default function DesignPhilosophy() {
  return (
    <div className="flex flex-col bg-[#FFF8EE] -m-6 h-full overflow-hidden">
      {/* Header Banner */}
      <div className="bg-black text-white p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[#FF6A00] text-4xl font-black">!</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>
        <h2 className="text-[calc((42/12)*var(--base-font-size))] font-black leading-[0.85] tracking-tighter uppercase mb-4">
          Design <br />
          <span className="text-[#FF6A00]">Philosophy</span>
        </h2>
        <p className="text-[calc((11/12)*var(--base-font-size))] font-bold uppercase tracking-[0.3em] text-white/40">
          Certified_Raw_v1.0.exe
        </p>
      </div>

      {/* Principles Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {principles.map((p, idx) => (
          <div 
            key={p.label}
            className="border-2 border-black rounded-2xl p-5 flex flex-col gap-3 shadow-hard transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: p.color }}
          >
            <div className="flex justify-between items-start">
              <span className="text-2xl">{p.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-black/30">0{idx + 1}</span>
            </div>
            <div>
              <h3 className="text-[calc((14/12)*var(--base-font-size))] font-black uppercase mb-1">{p.label}</h3>
              <p className="text-[calc((11/12)*var(--base-font-size))] font-bold text-black/60 leading-tight">
                {p.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Full Width Footer Card */}
        <div className="sm:col-span-2 bg-black text-white border-2 border-black rounded-2xl p-6 shadow-hard flex items-center justify-between group overflow-hidden relative">
          <div className="z-10">
            <h3 className="text-[calc((16/12)*var(--base-font-size))] font-black uppercase mb-1 italic text-[#CAFF00]">Brutalism</h3>
            <p className="text-[calc((12/12)*var(--base-font-size))] font-bold text-white/60 leading-tight max-w-[80%]">
              Honest UI for honest thinking. We stripped away the polish to make room for your rawest thoughts.
            </p>
          </div>
          <span className="text-6xl opacity-20 group-hover:opacity-100 group-hover:text-[#FF6A00] transition-all absolute right-4 -bottom-2 select-none">🪣</span>
        </div>
      </div>

      {/* The Palette */}
      <div className="mt-4 px-6 pb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20 mb-4 ml-1">The DNA / Palette</p>
        <div className="flex gap-2">
          {["#CAFF00", "#FFB3D0", "#B3D9FF", "#FFE9A0", "#FF6A00", "#000000"].map(c => (
            <div 
              key={c} 
              className="flex-1 h-8 rounded-lg border border-black/10 shadow-hard-sm" 
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* System info */}
      <div className="mt-auto p-4 border-t border-black/5 bg-white/50 flex justify-between items-center">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Rendering Core: 1.0.0</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6A00]">Commit to the mess.</span>
      </div>
    </div>
  );
}
