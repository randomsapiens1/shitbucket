export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#FFF8EE] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-10"
        style={{ background: `radial-gradient(circle, rgba(255,106,0,0.1) 0%, transparent 70%)` }}
      />
      
      <div className="flex flex-col items-center gap-12 z-10">
        <div className="animate-pulse">
          <img 
            src="/shitBucket-day.png" 
            alt="Shitbucket" 
            className="w-48 md:w-56 object-contain" 
          />
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-56 h-1 bg-white rounded-full overflow-hidden border border-black/10">
            <div
              className="h-full rounded-full animate-loading-bar"
              style={{ 
                width: "40%", 
                background: "linear-gradient(90deg, #ff6a00, #ff8c32)",
                boxShadow: "0 0 10px rgba(255,106,0,0.3)"
              }}
            />
          </div>
          <div className="text-black/40 text-[11px] tracking-[0.3em] uppercase font-bold animate-pulse font-mono">
            scouring the bucket
          </div>
        </div>
      </div>
    </div>
  );
}
