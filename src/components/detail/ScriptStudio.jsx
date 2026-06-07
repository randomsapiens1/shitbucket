"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";

export default function ScriptStudio({ initialTitle = "New Script", onClose }) {
  // --- State ---
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState("");
  const [activeSection, setActiveSection] = useState("body"); // hook, body, cta
  const [targetWordCount, setTargetWordCount] = useState(300);

  const [inspo, setInspo] = useState([
    { id: 1, tag: "hook", text: "Imagine if you could dump every thought..." },
    { id: 2, tag: "stat", text: "80% of ideas are lost within 24 hours." },
    { id: 3, tag: "cta", text: "Click the link in bio to join the waitlist." },
  ]);

  const [shots, setShots] = useState([
    { id: 1, section: "hook", type: "CU", desc: "Talking head, high energy", time: "0:00 - 0:05" },
  ]);

  const [showAddInspo, setShowAddInspo] = useState(false);
  const [showAddShot, setShowAddShot] = useState(false);

  const editorRef = useRef(null);

  // --- Stats ---
  const stats = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const readTime = Math.ceil(words / 200); // mins
    const speakingSecs = Math.round(words / 2.2);
    return { words, readTime, speakingSecs };
  }, [content]);

  // --- Actions ---
  const injectText = (text) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = content.substring(0, start) + text + content.substring(end);
    
    setContent(newText);
    
    // Reset focus and cursor position (delayed to let react update)
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert("Script copied to clipboard!");
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addInspo = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const tag = fd.get("tag");
    const text = fd.get("text");
    if (!text) return;
    setInspo([...inspo, { id: Date.now(), tag, text }]);
    setShowAddInspo(false);
  };

  const addShot = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setShots([...shots, {
      id: Date.now(),
      section: fd.get("section"),
      type: fd.get("type"),
      desc: fd.get("desc"),
      time: fd.get("time"),
    }]);
    setShowAddShot(false);
  };

  const getTagColor = (tag) => {
    switch (tag) {
      case "hook": return "var(--card-lime)";
      case "reference": return "var(--card-blue)";
      case "stat": return "var(--card-pink)";
      case "cta": return "var(--accent)";
      case "body": return "var(--card-yellow)";
      default: return "#eee";
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#FFF8EE] flex flex-col md:flex-row overflow-hidden font-bold">
      
      {/* --- PANEL 1: INSPO (Left) --- */}
      <div className="w-full md:w-72 border-r-2 border-black flex flex-col bg-white overflow-hidden shrink-0">
        <div className="p-4 border-b-2 border-black bg-black text-white flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest font-black">Panel 1 / Inspo</span>
          <button onClick={() => setShowAddInspo(!showAddInspo)} className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors">+</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {showAddInspo && (
            <form onSubmit={addInspo} className="p-3 border-2 border-black rounded-xl bg-[#FFF8EE] mb-4 space-y-2 shadow-hard-sm">
              <select name="tag" className="w-full bg-white border-2 border-black rounded-lg px-2 py-1 text-xs outline-none font-black uppercase">
                <option value="hook">Hook</option>
                <option value="reference">Reference</option>
                <option value="stat">Stat</option>
                <option value="cta">CTA</option>
              </select>
              <textarea name="text" placeholder="Inspo text..." className="w-full bg-white border-2 border-black rounded-lg px-2 py-1 text-xs outline-none" rows={3} autoFocus />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-black text-white text-[10px] uppercase py-1.5 rounded-lg">Add</button>
                <button type="button" onClick={() => setShowAddInspo(false)} className="flex-1 border-2 border-black text-[10px] uppercase py-1.5 rounded-lg">Cancel</button>
              </div>
            </form>
          )}

          {inspo.map(item => (
            <button
              key={item.id}
              onClick={() => injectText(item.text)}
              className="w-full text-left p-3 border-2 border-black rounded-xl bg-white shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group"
            >
              <span 
                className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mb-2 border border-black/10"
                style={{ background: getTagColor(item.tag) }}
              >
                {item.tag}
              </span>
              <p className="text-xs leading-relaxed text-black/70 group-hover:text-black transition-colors">{item.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* --- PANEL 2: EDITOR (Center) --- */}
      <div className="flex-1 border-r-2 border-black flex flex-col min-w-0">
        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-white sticky top-0 z-20">
          <input 
            className="text-lg font-black uppercase tracking-tight outline-none bg-transparent flex-1 mr-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Section Toggles */}
          <div className="flex gap-1 mb-6 max-w-sm mx-auto p-1 bg-black/5 rounded-2xl border-2 border-black/10">
            {['hook', 'body', 'cta'].map(s => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeSection === s ? 'bg-black text-white shadow-hard-sm' : 'text-black/40 hover:text-black'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <textarea
            ref={editorRef}
            className="w-full bg-transparent text-xl md:text-2xl leading-relaxed outline-none resize-none placeholder:text-black/10 min-h-[400px]"
            placeholder="Start writing your script..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Editor Footer / Stats */}
        <div className="p-6 bg-white border-t-2 border-black flex flex-col gap-4">
          <div className="flex flex-wrap gap-6 items-end">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Words</span>
              <span className="text-3xl font-black">{stats.words}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Read Time</span>
              <span className="text-xl font-black">{stats.readTime}m</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Speak Duration</span>
              <span className="text-xl font-black">{stats.speakingSecs}s</span>
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              <button onClick={handleCopy} className="px-4 py-2 border-2 border-black rounded-xl text-xs uppercase font-black hover:bg-black hover:text-white transition-all">Copy</button>
              <button onClick={handleExport} className="px-4 py-2 bg-black text-white rounded-xl text-xs uppercase font-black shadow-hard-sm hover:bg-[#FF6A00] transition-all">Export .txt</button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] uppercase tracking-widest font-black">Target: {targetWordCount} words</span>
              <button 
                onClick={() => {
                  const n = prompt("Enter target word count:", targetWordCount);
                  if (n) setTargetWordCount(parseInt(n));
                }}
                className="text-[8px] uppercase font-black opacity-30 hover:opacity-100 underline"
              >
                Set Goal
              </button>
            </div>
            <div className="h-4 bg-black/5 rounded-full border-2 border-black overflow-hidden relative">
              <div 
                className="h-full bg-[#FF6A00] transition-all duration-500 ease-out"
                style={{ width: `${Math.min((stats.words / targetWordCount) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- PANEL 3: SHOT LIST (Right) --- */}
      <div className="w-full md:w-80 border-black flex flex-col bg-white overflow-hidden shrink-0">
        <div className="p-4 border-b-2 border-black bg-black text-white flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest font-black">Panel 3 / Shot List</span>
          <button onClick={() => setShowAddShot(!showAddShot)} className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors">+</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showAddShot && (
            <form onSubmit={addShot} className="p-4 border-2 border-black rounded-xl bg-[#FFF8EE] mb-4 space-y-3 shadow-hard">
              <div className="grid grid-cols-2 gap-2">
                <select name="section" className="bg-white border-2 border-black rounded-lg px-2 py-1.5 text-[10px] font-black uppercase">
                  <option value="hook">Hook</option>
                  <option value="body">Body</option>
                  <option value="cta">CTA</option>
                </select>
                <input name="type" placeholder="Type (CU, Wide...)" className="bg-white border-2 border-black rounded-lg px-2 py-1.5 text-[10px]" />
              </div>
              <textarea name="desc" placeholder="Shot description..." className="w-full bg-white border-2 border-black rounded-lg px-2 py-1.5 text-[10px]" rows={2} />
              <input name="time" placeholder="Time range (e.g. 0:05-0:10)" className="w-full bg-white border-2 border-black rounded-lg px-2 py-1.5 text-[10px]" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-black text-white text-[10px] uppercase py-2 rounded-lg">Save Shot</button>
                <button type="button" onClick={() => setShowAddShot(false)} className="flex-1 border-2 border-black text-[10px] uppercase py-2 rounded-lg">Cancel</button>
              </div>
            </form>
          )}

          {shots.map((shot, idx) => (
            <div 
              key={shot.id} 
              className="border-2 border-black rounded-xl overflow-hidden shadow-hard-sm"
              style={{ borderLeftWidth: '8px', borderLeftColor: getTagColor(shot.section) }}
            >
              <div className="p-3 bg-white space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-black/30">Shot {idx + 1} / {shot.section}</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 bg-black text-white rounded">{shot.type}</span>
                </div>
                <p className="text-xs leading-snug">{shot.desc}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] font-bold text-[#FF6A00] tracking-tighter">{shot.time}</span>
                  <button onClick={() => setShots(shots.filter(s => s.id !== shot.id))} className="text-[10px] opacity-20 hover:opacity-100">delete</button>
                </div>
              </div>
            </div>
          ))}

          {shots.length === 0 && (
            <div className="text-center py-12 opacity-20 italic text-xs px-8">
              No shots yet. Add one to start visualizing your content.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
