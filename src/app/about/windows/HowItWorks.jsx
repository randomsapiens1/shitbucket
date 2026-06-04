"use client";

const sections = [
  {
    title: "Dump",
    icon: "/icon_howItWorks/dump-it.png",
    color: "#CAFF00",
    desc: "Throw ideas raw into the bucket before you forget them."
  },
  {
    title: "Develop",
    icon: "/icon_howItWorks/Let-it-brew.png",
    color: "#B3D9FF",
    desc: "Add notes, tasks, and links whenever inspiration strikes."
  },
  {
    title: "Filter",
    icon: "/icon_howItWorks/keep-what-matters.png",
    color: "#FFB3D0",
    desc: "Keep what matters. Let the rest go and expire."
  },
  {
    title: "Build",
    icon: "/icon_howItWorks/work-it.png",
    color: "#FFE9A0",
    desc: "Turn ideas that survive into something real."
  }
];

export default function HowItWorks() {
  return (
    <div className="flex flex-col h-full py-4 max-w-5xl mx-auto">
      {/* Centered Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
          The Life of an Idea
        </h1>
        <div className="h-1.5 w-16 bg-black mx-auto mt-6" />
      </div>

      {/* Static 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((s, idx) => (
          <div 
            key={s.title}
            className="flex flex-col border-4 border-black rounded-[40px] overflow-hidden shadow-hard transition-transform hover:scale-[1.02]"
          >
            {/* Visual Header - Increased Height */}
            <div 
              className="h-48 flex items-center justify-center p-8 border-b-4 border-black"
              style={{ backgroundColor: s.color }}
            >
              <img 
                src={s.icon} 
                alt={s.title} 
                className="w-full h-full object-contain" 
              />
            </div>
            
            {/* Content Area - Increased Padding and Text Size */}
            <div className="bg-white p-8 flex-1 flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-black uppercase tracking-widest text-black/20 border-2 border-black/10 rounded-full px-2 py-0.5">0{idx + 1}</span>
                <h2 className="text-xl font-black uppercase tracking-tight">{s.title}</h2>
              </div>
              <p className="text-sm font-bold text-black/60 leading-tight">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
