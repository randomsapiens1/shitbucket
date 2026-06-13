"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

function getTimeOfDayIcon(h) {
  if (h >= 5  && h < 12) return "☀";
  if (h >= 12 && h < 17) return "◑";
  if (h >= 17 && h < 21) return "◐";
  return "●";
}

export default function HamburgerMenu({ open, onClose, fontSize, setFontSize, onLogout, lateNight }) {
  const [user, setUser] = useState(null);
  const [now,  setNow]  = useState(null);

  useEffect(() => {
    if (open) {
      supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
      setNow(new Date());
      const t = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(t);
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
          <span className="text-[calc((11/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.15em] text-black">Menu</span>
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

          {/* Date + Time */}
          {now && (
            <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4 flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 'calc((32/12)*var(--base-font-size))', fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {String(now.getHours() % 12 || 12).padStart(2, "0")}:{String(now.getMinutes()).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 'calc((11/12)*var(--base-font-size))', fontWeight: 600, color: "rgba(10,10,10,0.35)", letterSpacing: "0.06em", paddingBottom: 4 }}>
                  {now.getHours() >= 12 ? "PM" : "AM"}
                </span>
              </div>
              <div className="flex flex-col items-end" style={{ gap: 3 }}>
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: 'calc((9/12)*var(--base-font-size))', color: "rgba(10,10,10,0.35)", lineHeight: 1 }}>
                    {getTimeOfDayIcon(now.getHours())}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 'calc((9/12)*var(--base-font-size))', fontWeight: 700, color: "#FF6A00", letterSpacing: "0.14em" }}>
                    {now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                  </span>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 'calc((14/12)*var(--base-font-size))', fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                  {now.toLocaleDateString("en-US", { month: "short" }).toUpperCase()} {String(now.getDate()).padStart(2, "0")}
                </span>
              </div>
            </div>
          )}

          {/* Account */}
          {user && (
            <div>
              <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.15em] text-black mb-2">Account</p>
              <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                  {user.email[0].toUpperCase()}
                </div>
                <p className="text-[calc((12/12)*var(--base-font-size))] font-extrabold text-black truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Appearance */}
          <div>
            <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.15em] text-black mb-2">Appearance</p>
            <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[calc((13/12)*var(--base-font-size))] font-extrabold text-black">Font Size</span>
                <span className="text-[calc((13/12)*var(--base-font-size))] font-extrabold text-[#FF6A00]">{fontSize}px</span>
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
              <div className="flex justify-between mt-2 text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-tighter text-black/40">
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
            className={`w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[calc((13/12)*var(--base-font-size))] font-extrabold border-2 border-black transition-all shadow-hard-sm active:shadow-none active:translate-x-[3px] active:translate-y-[3px] ${
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
          <p className="text-center text-[calc((10/12)*var(--base-font-size))] font-bold text-black/30 mt-3">
            shitbucket v1.0.0 · made for the dumpers
          </p>
        </div>
      </div>
    </>
  );
}
