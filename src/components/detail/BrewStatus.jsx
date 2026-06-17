import { calcBrewProgress } from "@/lib/brew";

export default function BrewStatus({ idea }) {
  const brew  = calcBrewProgress(idea);

  return (
    <div className="bg-white border-2 border-black/10 rounded-2xl p-5 mb-8 shadow-hard-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[calc((10/12)*var(--base-font-size))] text-black/40 uppercase tracking-[0.15em] font-extrabold">brew status</span>
        <span className="text-[calc((13/12)*var(--base-font-size))] text-[#FF6A00] font-extrabold">{brew}%</span>
      </div>
      <div className="w-full h-3 bg-[#FFF8EE] border-2 border-black/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${brew}%`, background: "linear-gradient(90deg, #FF6A00, #FFD4B0)" }}
        />
      </div>
    </div>
  );
}
