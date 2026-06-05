"use client";

export default function Welcome({ onClose }) {
  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4 text-center">
      {/* Font Demo Header */}
      <div className="space-y-6 max-w-lg">
        <h1 
          style={{ fontFamily: "'VT323', monospace" }}
          className="text-6xl sm:text-7xl text-black leading-none"
        >
          SHITBUCKET.EXE
        </h1>

        <h2 
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          className="text-3xl sm:text-4xl font-extrabold text-[#FF6A00] leading-tight tracking-tight"
        >
          Dump ideas before <br className="hidden sm:block" /> they disappear.
        </h2>

        <p 
          style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }}
          className="text-lg sm:text-xl text-black/70 leading-relaxed font-medium"
        >
          ShitBucket is a brutalist refinery for your rawest thoughts. 
          Most ideas start as "shit"—raw, messy, and incomplete. 
          We provide the bucket; you provide the raw material. 
          Let them brew, refine the details, and turn them into gold.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center bg-black text-white rounded-2xl px-10 py-5 font-black uppercase tracking-[0.2em] border-2 border-black shadow-[6px_6px_0px_#000] transition-all hover:bg-[#FF6A00] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-base"
        >
          Let's go
        </button>
      </div>
    </div>
  );
}
