"use client";
import { useState, useEffect } from "react";
import { fetchIdeas, createIdea } from "@/lib/db";
import { calcBrewProgress, getBrewStage } from "@/lib/brew";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

export default function WidgetView({ userId }) {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dumping, setDumping] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadLatest();
  }, []);

  async function loadLatest() {
    try {
      const ideas = await fetchIdeas();
      if (ideas && ideas.length > 0) {
        // Prefer pinned, then newest
        const pinned = ideas.find(i => i.pinned);
        setIdea(pinned || ideas[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickDump(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setDumping(true);
    try {
      await createIdea({ title: title.trim() });
      setTitle("");
      loadLatest();
      alert("Dumped!");
    } catch (e) {
      alert("Failed to dump");
    } finally {
      setDumping(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FFF8EE] flex items-center justify-center p-6 text-black font-mono uppercase text-xs tracking-widest">
      Brewing...
    </div>
  );

  const brew = idea ? calcBrewProgress(idea) : 0;
  const stage = idea ? getBrewStage(brew) : null;

  return (
    <div className="min-h-screen bg-[#FFF8EE] p-4 flex flex-col font-sans text-black select-none">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-black text-xl tracking-tighter uppercase italic">
          Shit<span className="text-[#FF6A00]">Bucket</span>
        </h1>
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
          Open Full
        </Link>
      </div>

      {/* Main Idea Card */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {idea ? (
          <Link 
            href={`/?view=detail&id=${idea.id}`}
            className="block bg-white border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/30">
                {idea.pinned ? "📌 Pinned Idea" : "🕒 Last Edited"}
              </span>
              <span className="text-[10px] font-black uppercase text-black/30">
                {timeAgo(idea.updated_at)}
              </span>
            </div>
            
            <h2 className="text-3xl font-black leading-[0.9] mb-4 break-words">
              {idea.title}
            </h2>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/5 h-4 rounded-full overflow-hidden border-2 border-black">
                <div 
                  className="h-full bg-[#FF6A00] transition-all duration-1000" 
                  style={{ width: `${brew}%` }}
                />
              </div>
              <span className="font-black text-sm">{brew}%</span>
            </div>
            
            <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-[#FF6A00]">
              Stage: {stage?.label} {stage?.emoji}
            </div>
          </Link>
        ) : (
          <div className="text-center p-8 border-4 border-dashed border-black/20 rounded-3xl">
            <p className="font-black text-black/20 uppercase italic">Bucket is empty</p>
          </div>
        )}

        {/* Quick Dump */}
        <form onSubmit={handleQuickDump} className="mt-8 flex gap-2">
          <input 
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="DUMP AN IDEA..."
            className="flex-1 bg-white border-4 border-black p-4 font-black uppercase placeholder:text-black/20 outline-none shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
          />
          <button 
            type="submit"
            disabled={dumping}
            className="bg-[#FF6A00] border-4 border-black p-4 font-black text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {dumping ? "..." : "GO"}
          </button>
        </form>
      </div>

      <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-black/20 mt-8">
        Designed for the home screen
      </p>
    </div>
  );
}
