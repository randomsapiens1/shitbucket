"use client";
import { useState } from "react";

export default function ManifestoWindow({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Window Container */}
      <div className="relative w-full max-w-2xl bg-[#FFF8EE] border-4 border-black shadow-hard-lg rounded-[2px] pointer-events-auto overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* OS-Style Title Bar */}
        <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF6A00]" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>
            <span className="font-black text-[calc((12/12)*var(--base-font-size))] uppercase tracking-widest">
              system_manifesto.txt
            </span>
          </div>
          <button 
            onClick={onClose}
            className="hover:text-[#FF6A00] transition-colors font-black text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 sm:p-12 max-h-[80vh] overflow-y-auto">
          <h2 className="text-[calc((48/12)*var(--base-font-size))] font-black leading-[0.85] tracking-tighter uppercase mb-12">
            Why <br />
            <span className="text-[#FF6A00]">Shitbucket?</span>
          </h2>

          <div className="space-y-12">
            {/* Point 1 */}
            <div className="grid sm:grid-cols-[100px_1fr] gap-4">
              <span className="text-[calc((14/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase">01 / Speed</span>
              <div>
                <h3 className="text-[calc((20/12)*var(--base-font-size))] font-black uppercase mb-3">Speed is God.</h3>
                <p className="text-[calc((15/12)*var(--base-font-size))] font-bold leading-relaxed text-black/70">
                  Most ideas die because the friction of recording them is too high. 
                  Shitbucket is built to capture raw thoughts in <span className="text-black">under 5 seconds</span>. 
                  Don't organize. Just dump.
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="grid sm:grid-cols-[100px_1fr] gap-4">
              <span className="text-[calc((14/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase">02 / Brew</span>
              <div>
                <h3 className="text-[calc((20/12)*var(--base-font-size))] font-black uppercase mb-3">Brewing {">"} Polishing.</h3>
                <p className="text-[calc((15/12)*var(--base-font-size))] font-bold leading-relaxed text-black/70">
                  A good idea needs time to sit. Our <span className="text-black">Brew Progress</span> system 
                  rewards you for returning to your thoughts, adding context, and letting them mature 
                  from "Raw" to "Gold."
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="grid sm:grid-cols-[100px_1fr] gap-4">
              <span className="text-[calc((14/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase">03 / Mess</span>
              <div>
                <h3 className="text-[calc((20/12)*var(--base-font-size))] font-black uppercase mb-3">Embrace the Mess.</h3>
                <p className="text-[calc((15/12)*var(--base-font-size))] font-bold leading-relaxed text-black/70">
                  Folders are where ideas go to be forgotten. Shitbucket is a single, 
                  unfiltered "Pile." If it's important, you'll find it. If it's shit, let it expire.
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 pt-8 border-t-2 border-black/10">
            <button 
              onClick={onClose}
              className="w-full bg-black text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] shadow-hard hover:bg-[#FF6A00] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              Back to the Pile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
