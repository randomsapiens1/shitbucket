export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(255,106,0,0.15) 0%, transparent 70%)" }}
      />
      
      <div className="flex flex-col items-center gap-12 z-10">
        <div className="animate-breathe">
          <img 
            src="/shitbucket-header-pic.png" 
            alt="Shitbucket" 
            className="w-64 md:w-80 object-contain" 
          />
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-56 h-1 bg-[#111] rounded-full overflow-hidden border border-[#222]">
            <div
              className="h-full rounded-full animate-loading-bar"
              style={{ 
                width: "40%", 
                background: "linear-gradient(90deg, #ff6a00, #ff8c32)",
                boxShadow: "0 0 15px rgba(255,106,0,0.5)"
              }}
            />
          </div>
          <div className="text-zinc-500 text-[11px] tracking-[0.3em] uppercase font-medium animate-pulse">
            scouring the bucket
          </div>
        </div>
      </div>
    </div>
  );
}
