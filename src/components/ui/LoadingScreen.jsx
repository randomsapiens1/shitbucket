export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <img src="/shitbucket-header-pic.png" alt="Shitbucket" className="w-16 h-16 object-contain" />
      <div className="w-48 h-1.5 bg-[#1a1200] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full animate-pulse"
          style={{ width: "60%", background: "linear-gradient(90deg, #992600, #b34d00, #997300)" }}
        />
      </div>
      <div className="text-zinc-600 text-xs tracking-widest">loading your shit...</div>
    </div>
  );
}
