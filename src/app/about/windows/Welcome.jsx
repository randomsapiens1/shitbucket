"use client";

export default function Welcome({ onClose }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 py-4 px-2">
      {/* Logo Side */}
      <div className="w-full md:w-1/3 flex justify-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#FF6A00]/10 rounded-full blur-xl group-hover:bg-[#FF6A00]/20 transition-all" />
          <img
            src="/logo-shitBucket-day.png"
            alt="ShitBucket"
            className="relative w-32 h-32 md:w-48 md:h-48 object-contain animate-in fade-in zoom-in duration-700"
          />
        </div>
      </div>

      {/* Content Side */}
      <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-[calc((42/12)*var(--base-font-size))] font-black leading-[0.9] tracking-tighter uppercase text-black mb-8">
          Dump all <br />
          <span className="text-[#FF6A00]">nonsense</span> <br />
          in your head, <br />
          think about <br />
          it later.
        </h1>

        <button
          onClick={onClose}
          className="inline-flex items-center justify-center bg-black text-white rounded-2xl px-10 py-5 font-black uppercase tracking-[0.2em] border-2 border-black shadow-[6px_6px_0px_#000] transition-all hover:bg-[#FF6A00] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[calc((16/12)*var(--base-font-size))]"
        >
          Let's go
        </button>
      </div>
    </div>
  );
}
