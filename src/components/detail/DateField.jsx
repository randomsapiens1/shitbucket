"use client";

export default function DateField({ name, value, onUpdate, ideaTitle }) {
  // value is expected to be an ISO date string or empty
  const dateVal = value || "";

  const handleGCal = () => {
    if (!dateVal) return;
    const date = new Date(dateVal);
    const start = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ideaTitle + ": " + name)}&dates=${start}/${end}&details=Added from ShitBucket`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="datetime-local"
        className="w-full bg-[#FFF8EE] border-2 border-black/10 focus:border-black rounded-xl px-4 py-2.5 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition"
        value={dateVal}
        onChange={(e) => onUpdate(e.target.value)}
      />
      
      {dateVal && (
        <button
          onClick={handleGCal}
          className="flex items-center justify-center gap-2 w-full bg-white border-2 border-black rounded-xl py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-hard-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Add to Google Calendar
        </button>
      )}
    </div>
  );
}
