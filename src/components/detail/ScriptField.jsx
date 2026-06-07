"use client";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";

export default function ScriptField({ value, onUpdate }) {
  return (
    <div className="relative">
      <AutoResizeTextarea
        className="w-full bg-[#FFF8EE] text-black font-bold text-[calc((13/12)*var(--base-font-size))] p-4 rounded-xl border-2 border-black/10 focus:border-black outline-none min-h-[100px] placeholder:text-black/20 transition-colors"
        value={value || ""}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="enter your script or content here..."
      />
    </div>
  );
}
