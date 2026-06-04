"use client";
import { useRef } from "react";

const sections = [
  {
    title: "Dump It",
    icon: "/icon_howItWorks/dump-it.png",
    color: "#CAFF00",
    desc: "Write whatever is floating around in your head. Tasks, links, ideas. The bucket doesn't care."
  },
  {
    title: "Let It Sit",
    icon: "/icon_howItWorks/Let-it-brew.png",
    color: "#B3D9FF",
    desc: "Some things matter tomorrow. Some never matter again. You decide how long it stays."
  },
  {
    title: "Find It",
    icon: "/icon_howItWorks/keep-what-matters.png",
    color: "#FFB3D0",
    desc: "Search, filter, or sort. Or just forget about it until future-you suddenly needs it."
  },
  {
    title: "Or Forget It",
    icon: "/icon_howItWorks/work-it.png",
    color: "#FFE9A0",
    desc: "If it's shit, let it expire. The things you throw into the bucket stay yours."
  }
];

export default function HowItWorks() {
  const scrollRef = useRef(null);

  return (
    <div className="flex flex-col h-full py-6 px-2 sm:px-4 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-[calc((32/12)*var(--base-font-size))] sm:text-5xl font-black uppercase tracking-tighter leading-none text-black">
          How It Works
        </h1>
        <div className="h-2 w-20 bg-[#FF6A00] mx-auto mt-6 rounded-full" />
      </div>

      {/* Mobile Slider / Desktop Flex Row */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none no-scrollbar gap-6 pb-8 -mx-2 px-4 sm:px-0 sm:flex-wrap sm:justify-center lg:flex-nowrap"
      >
        {sections.map((s, idx) => (
          <div 
            key={s.title}
            className="flex-shrink-0 w-[280px] sm:w-[calc(50%-12px)] lg:flex-1 snap-center flex flex-col border-4 border-black rounded-[40px] overflow-hidden shadow-hard transition-transform hover:scale-[1.02] bg-white"
          >
            {/* Visual Header */}
            <div 
              className="h-44 sm:h-52 flex items-center justify-center p-8 border-b-4 border-black"
              style={{ backgroundColor: s.color }}
            >
              <img 
                src={s.icon} 
                alt={s.title} 
                className="w-full h-full object-contain pointer-events-none" 
              />
            </div>
            
            {/* Content Area */}
            <div className="p-8 flex-1 flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20 border-2 border-black/10 rounded-full px-2.5 py-1 shrink-0">
                  STEP {idx + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black truncate">{s.title}</h2>
              </div>
              <p className="text-[calc((14/12)*var(--base-font-size))] font-bold text-black/60 leading-snug">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Indicator (Mobile Only) */}
      <div className="flex justify-center gap-2 mt-2 sm:hidden">
        {sections.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-black/10" />
        ))}
      </div>
    </div>
  );
}
