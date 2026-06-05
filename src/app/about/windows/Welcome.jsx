"use client";

export default function Welcome({ onClose, openWindow }) {
  return (
    <div className="flex flex-col py-4 px-2 max-w-lg mx-auto font-['Inter'] selection:bg-[#FF6A00]/20 antialiased">
      
      {/* ── System Meta (Drawing from the '6 ideas' and 'SAT JUN 06' headers) ── */}
      <div className="flex items-center justify-between mb-8">
        <div className="bg-black text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
          <span>system status</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#CAFF00] animate-pulse" />
        </div>
        <div className="text-black/30 text-[10px] font-black uppercase tracking-widest">
          SB-OS // v1.0.4
        </div>
      </div>

      {/* ── Sophisticated Brutalist Headline ── */}
      <div className="mb-10 text-center">
        <h1 className="text-[40px] sm:text-[48px] font-black text-black leading-[0.85] tracking-[-0.04em] uppercase">
          Dump ideas <br />
          before they <br />
          <span className="text-[#FF6A00]">disappear.</span>
        </h1>
        <p className="mt-5 text-[14px] font-medium text-black/50 leading-relaxed max-w-[320px] mx-auto">
          Capture raw thoughts in under 5 seconds. <br />
          Let them brew. Turn them into gold.
        </p>
      </div>

      {/* ── Featured Content (Using the Card & Border tokens from the screenshot) ── */}
      <div className="space-y-5 mb-10">
        <div className="bg-white border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0px_#000] transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000]">
          <h3 className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-3">
            01 / the philosophy
          </h3>
          <p className="text-[16px] font-bold text-black leading-tight mb-1">
            Most ideas start messy.
          </p>
          <p className="text-[13px] font-medium text-black/60 leading-relaxed">
            Store thoughts, tasks, and links until you&apos;re ready to build something real.
          </p>
        </div>

        <div className="bg-[#FFF8EE] border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0px_#FF6A00] transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#FF6A00]">
          <h3 className="text-[10px] font-black text-[#FF6A00] uppercase tracking-[0.2em] mb-3">
            02 / the process
          </h3>
          <p className="text-[16px] font-bold text-black leading-tight mb-1">
            Capture before they&apos;re gone.
          </p>
          <p className="text-[13px] font-medium text-black/60 leading-relaxed">
            A brutalist refinery designed for speed, focus, and mental clarity.
          </p>
        </div>
      </div>

      {/* ── CTA Area (Matching the 'dump it' button perfectly) ── */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onClose}
          className="w-full bg-black text-white rounded-2xl px-8 py-5 font-black text-[16px] uppercase tracking-[0.2em] border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-[#FF6A00] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          [ start dumping ]
        </button>

        <button
          onClick={() => {
            onClose();
            openWindow("how-it-works");
          }}
          className="group flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors"
        >
          <span>Explore the workflow</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* ── Background Polish (Faint watermark) ── */}
      <div className="fixed -bottom-4 -right-4 pointer-events-none opacity-[0.04] select-none">
        <img src="/logo-shitBucket-day.png" alt="" className="w-48 h-48 grayscale" />
      </div>
    </div>
  );
}
