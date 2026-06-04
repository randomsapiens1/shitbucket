"use client";

const principles = [
  { 
    label: "Capture > Org",   
    desc: "Nobody wants to build a workflow for a 2am idea. Big writing spaces only.", 
    color: "#CAFF00",
    icon: "✍️" 
  },
  { 
    label: "Big Buttons",  
    desc: "Because you're in a hurry. One-tap dumping. Very few decisions.", 
    color: "#FFB3D0",
    icon: "🔘" 
  },
  { 
    label: "Single Pile", 
    desc: "Folders are where ideas go to die. Keep everything in one bucket.", 
    color: "#B3D9FF",
    icon: "🪣" 
  },
  { 
    label: "Honest UI", 
    desc: "We stripped away the polish to make room for your rawest thoughts.", 
    color: "#FFE9A0",
    icon: "💀" 
  },
];

export default function DesignPhilosophy() {
  return (
    <div className="flex flex-col bg-[#FFF8EE] -m-6 h-full overflow-hidden">
      <div className="bg-black text-white p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[#FF6A00] text-4xl font-black">?</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>
        <h2 className="text-[calc((42/12)*var(--base-font-size))] font-black leading-[0.85] tracking-tighter uppercase mb-4">
          Capture <br />
          <span className="text-[#FF6A00]">Philosophy</span>
        </h2>
        <p className="text-[calc((11/12)*var(--base-font-size))] font-bold uppercase tracking-[0.3em] text-white/40">
          Capture_Priority_v1.0
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {principles.map((p, idx) => (
          <div 
            key={p.label}
            className="border-2 border-black rounded-2xl p-5 flex flex-col gap-3 shadow-hard transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: p.color }}
          >
            <div className="flex justify-between items-start">
              <span className="text-2xl">{p.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-black/30">P{idx + 1}</span>
            </div>
            <div>
              <h3 className="text-[calc((14/12)*var(--base-font-size))] font-black uppercase mb-1">{p.label}</h3>
              <p className="text-[calc((11/12)*var(--base-font-size))] font-bold text-black/60 leading-tight">
                {p.desc}
              </p>
            </div>
          </div>
        ))}

        <div className="sm:col-span-2 bg-black text-white border-2 border-black rounded-2xl p-6 shadow-hard flex items-center justify-between group overflow-hidden relative">
          <div className="z-10">
            <h3 className="text-[calc((16/12)*var(--base-font-size))] font-black uppercase mb-1 italic text-[#CAFF00]">The Goal</h3>
            <p className="text-[calc((12/12)*var(--base-font-size))] font-bold text-white/60 leading-tight max-w-[80%]">
              We focus on capture. When an idea shows up, you just want somewhere to put the thing before it disappears.
            </p>
          </div>
          <span className="text-6xl opacity-20 group-hover:opacity-100 group-hover:text-[#FF6A00] transition-all absolute right-4 -bottom-2 select-none">🪣</span>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-black/5 bg-white/50 flex justify-between items-center">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Design for people like us</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6A00]">I&apos;ll remember that. (No you won&apos;t).</span>
      </div>
    </div>
  );
}
