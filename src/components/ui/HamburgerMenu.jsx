"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function HamburgerMenu({ open, onClose, fontSize, setFontSize, onLogout, lateNight }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (open) {
      supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] z-50 flex flex-col bg-[#FFF8EE] border-l-2 border-black transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-5 border-b-2 border-black bg-white">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-black">Menu</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-black bg-[#FFF8EE] text-black shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">

          {/* Account */}
          {user && (
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black mb-2">Account</p>
              <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                  {user.email[0].toUpperCase()}
                </div>
                <p className="text-[12px] font-extrabold text-black truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Appearance */}
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black mb-2">Appearance</p>
            <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-extrabold text-black">Font Size</span>
                <span className="text-[13px] font-extrabold text-[#FF6A00]">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between mt-2 text-[10px] font-extrabold uppercase tracking-tighter text-black/40">
                <span>Tiny</span>
                <span>Normal</span>
                <span>Huge</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer: sign out */}
        <div className="px-5 py-5 border-t-2 border-black">
          <button
            onClick={() => { onClose(); onLogout(); }}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-extrabold border-2 border-black transition-all shadow-hard-sm active:shadow-none active:translate-x-[3px] active:translate-y-[3px] ${
              lateNight ? "late-night-btn" : "bg-white text-black hover:bg-[#FF6A00]/15"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {lateNight ? "🚨 get out" : "sign out"}
          </button>
          <p className="text-center text-[10px] font-bold text-black/30 mt-3">
            shitbucket v1.0.0 · made for the dumpers
          </p>
        </div>
      </div>
    </>
  );
}
