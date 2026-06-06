"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

import HowItWorks      from "./windows/HowItWorks";
import WhyShitBucket   from "./windows/WhyShitBucket";
import DesignPhilosophy from "./windows/DesignPhilosophy";
import ReachOut        from "./windows/ReachOut";
import ShitBucketApp   from "./windows/ShitBucketApp";
import Welcome         from "./windows/Welcome";

// ── Window Registry ────────────────────────────────────────────────────────────
// To edit a window's content, open its file in src/app/about/windows/

const WINDOWS = {
  "welcome":           { label: "Welcome to ShitBucket.exe", Content: Welcome,         defaultPos: { x: 0,   y: 0 } },
  "how-it-works":      { label: "How It Works",      icon: "❓", imgSrc: "/icon_set/How-it-works.png", Content: HowItWorks,       defaultPos: { x: 60,  y: 40 } },
  "why-shitbucket":    { label: "Why ShitBucket?",   icon: "💡", imgSrc: "/icon_set/why-shit-bucket.png", Content: WhyShitBucket,    defaultPos: { x: 100, y: 60 } },
  "design-philosophy": { label: "Design Philosophy", icon: "🎨", imgSrc: "/icon_set/design-philosophy.png", Content: DesignPhilosophy, defaultPos: { x: 140, y: 50 } },
  "reach-out":         { label: "Reach Out",         icon: "✉️", imgSrc: "/icon_set/contact me.png", Content: ReachOut,         defaultPos: { x: 120, y: 80 } },
  "shitbucket-app":    { label: "ShitBucket.exe",    icon: "🪣", imgSrc: "/icon_set/shit-bucket.exe.png", Content: ShitBucketApp,    defaultPos: { x: 100, y: 100 } },
};

// ── Desktop Icons ──────────────────────────────────────────────────────────────

const ALL_ICONS = [
  { id: "shitbucket-app",    imgSrc: "/logo-shitBucket-day.png",          label: "ShitBucket.exe" },
  { id: "how-it-works",      imgSrc: "/icon_set/How-it-works.png",        label: "How It Works" },
  { id: "why-shitbucket",    imgSrc: "/icon_set/why-shit-bucket.png",     label: "Why ShitBucket?" },
  { id: "reach-out",         imgSrc: "/icon_set/contact me.png",          label: "Reach Out" },
  { id: "design-philosophy", imgSrc: "/icon_set/design-philosophy.png",   label: "Design Philosophy" },
];

// ── DesktopWindow ──────────────────────────────────────────────────────────────

function DesktopWindow({ id, zIndex, onClose, onFocus, openWindow }) {
  const cfg = WINDOWS[id];
  const [pos, setPos] = useState(cfg.defaultPos);
  const winRef = useRef(null);

  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight - 80 - 80; // Total height minus both 80px bars
    const isMobile = vw < 640;
    const w  = isMobile ? Math.max(300, vw * 0.92) : Math.min(Math.max(420, vw * 0.7), 960);
    
    // For welcome window, center it more aggressively
    if (id === "welcome") {
       setPos({
        x: (vw - w) / 2,
        y: isMobile ? 20 : Math.max(20, (vh - 500) / 2),
      });
    } else {
      setPos({
        x: Math.max(8, (vw - w) / 2),
        y: Math.max(isMobile ? 20 : 20, vh * 0.1),
      });
    }
  }, [id]);

  const handleTitleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    onFocus();
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;
    const onMove = (ev) => {
      const w = winRef.current?.offsetWidth  || 600;
      const h = winRef.current?.offsetHeight || 400;
      const desktopHeight = window.innerHeight - 80 - 80;
      setPos({
        x: Math.min(Math.max(0, ev.clientX - startX), window.innerWidth  - w),
        y: Math.min(Math.max(0, ev.clientY - startY), desktopHeight - h),
      });
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const handleTitleTouchStart = (e) => {
    onFocus();
    const touch  = e.touches[0];
    const startX = touch.clientX - pos.x;
    const startY = touch.clientY - pos.y;
    const onMove = (ev) => {
      const t = ev.touches[0];
      const w = winRef.current?.offsetWidth  || 600;
      const h = winRef.current?.offsetHeight || 400;
      const desktopHeight = window.innerHeight - 80 - 80;
      setPos({
        x: Math.min(Math.max(0, t.clientX - startX), window.innerWidth  - w),
        y: Math.min(Math.max(0, t.clientY - startY), desktopHeight - h),
      });
    };
    const onUp = () => {
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onUp);
  };

  return (
    <div
      ref={winRef}
      style={{ position: "absolute", left: pos.x, top: pos.y, zIndex, width: "clamp(300px, 92vw, 960px)", maxWidth: "calc(100vw - 16px)" }}
      className="border-2 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_#000] select-none"
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-black text-white cursor-grab active:cursor-grabbing"
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
      >
        <div className="flex items-center gap-2">
          {cfg.imgSrc ? (
            <img src={cfg.imgSrc} alt="" className="w-4 h-4 object-contain" />
          ) : (
            cfg.icon && <span className="text-sm leading-none">{cfg.icon}</span>
          )}
          <span className="font-black text-[10px] uppercase tracking-widest">{cfg.label}</span>
        </div>

        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={onClose}
          aria-label="Close"
          className="w-7 h-7 rounded-full flex items-center justify-center font-black text-lg leading-none hover:bg-red-500 transition-colors"
          style={{ background: "#FF6A00", color: "#fff" }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-6 bg-white overflow-y-auto" style={{ maxHeight: "calc(70vh - 2.5rem)" }}>
        <cfg.Content onClose={onClose} openWindow={openWindow} />
      </div>
    </div>
  );
}

// ── Desktop Icon ───────────────────────────────────────────────────────────────

function DesktopIcon({ icon, imgSrc, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/15 active:bg-white/25 transition-colors group w-[100px] focus:outline-none"
    >
      <div className="w-20 h-20 rounded-2xl overflow-hidden transition-all">
        {imgSrc
          ? <img src={imgSrc} alt={label} className="w-full h-full object-contain" />
          : <span className="w-full h-full flex items-center justify-center text-5xl leading-none bg-white">{icon}</span>}
      </div>
      <span className="text-black text-[10px] font-black text-center leading-tight uppercase tracking-wide w-full [text-shadow:0px_0px_6px_rgba(255,255,255,0.9),0px_1px_2px_rgba(255,255,255,0.8)]">
        {label}
      </span>
    </button>
  );
}

// ── Taskbar DateTime ───────────────────────────────────────────────────────────

function TaskbarDateTime() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!now) return null;

  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="font-black text-black text-3xl tabular-nums leading-none tracking-tight">{time}</span>
      <span className="font-black text-black/60 text-base uppercase tracking-widest leading-none">{date}</span>
    </div>
  );
}

// ── Desktop ────────────────────────────────────────────────────────────────────

const ICON_W = 104;
const ICON_H = 116;

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState([{ id: "welcome", zIndex: 100 }]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [iconPositions, setIconPositions] = useState(null);
  const topZ = useRef(100);

  // Initialise icon positions once we know the viewport
  useEffect(() => {
    const vw = window.innerWidth;
    const gap = 8;
    setIconPositions({
      "shitbucket-app":    { x: 12,              y: 16 },
      "how-it-works":      { x: 12,              y: 16 + (ICON_H + gap) },
      "why-shitbucket":    { x: 12,              y: 16 + (ICON_H + gap) * 2 },
      "reach-out":         { x: 12,              y: 16 + (ICON_H + gap) * 3 },
      "design-philosophy": { x: vw - ICON_W - 12, y: 16 },
    });
  }, []);

  const iconPositionsRef = useRef(iconPositions);
  useEffect(() => { iconPositionsRef.current = iconPositions; }, [iconPositions]);

  const startIconDrag = useCallback((e, id, openWindow) => {
    const isTouch = e.type === "touchstart";
    if (!isTouch && e.button !== 0) return;

    const getXY = ev => isTouch
      ? { x: ev.touches[0].clientX, y: ev.touches[0].clientY }
      : { x: ev.clientX, y: ev.clientY };

    const origin = getXY(e);
    const cur = iconPositionsRef.current[id];
    const offsetX = origin.x - cur.x;
    const offsetY = origin.y - cur.y;
    let moved = false;

    const onMove = (ev) => {
      const { x, y } = getXY(ev);
      if (Math.hypot(x - origin.x, y - origin.y) < 10) return;
      moved = true;
      const desktopH = window.innerHeight - 160;
      setIconPositions(p => ({
        ...p,
        [id]: {
          x: Math.min(Math.max(0, x - offsetX), window.innerWidth - ICON_W),
          y: Math.min(Math.max(0, y - offsetY), desktopH - ICON_H),
        },
      }));
    };

    const onUp = () => {
      document.removeEventListener(isTouch ? "touchmove" : "mousemove", onMove);
      document.removeEventListener(isTouch ? "touchend"  : "mouseup",  onUp);
      if (!moved) openWindow(id);
    };

    document.addEventListener(isTouch ? "touchmove" : "mousemove", onMove, isTouch ? { passive: true } : undefined);
    document.addEventListener(isTouch ? "touchend"  : "mouseup",  onUp);
  }, []);

  const openWindow = useCallback((id) => {
    topZ.current += 1;
    const z = topZ.current;
    setOpenWindows(prev => {
      const exists = prev.find(w => w.id === id);
      if (exists) return prev.map(w => w.id === id ? { ...w, zIndex: z } : w);
      return [...prev, { id, zIndex: z }];
    });
    setStartMenuOpen(false);
  }, []);

  const closeWindow  = useCallback((id) => setOpenWindows(prev => prev.filter(w => w.id !== id)), []);

  const focusWindow = useCallback((id) => {
    topZ.current += 1;
    const z = topZ.current;
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: z } : w));
  }, []);

  return (
    <div className="fixed inset-0 h-[100dvh] overflow-hidden bg-[#f1dbbe] select-none">
      {/* ── Wallpaper Area ── */}
      <div 
        className="absolute left-0 right-0 top-0 bottom-20"
        style={{ 
          backgroundImage: "url('/wallpaper.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "bottom", 
          backgroundRepeat: "no-repeat" 
        }}
      />

      {/* ── Taskbar (Top) ── */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-[#f1dbbe]/85 backdrop-blur-md border-b-2 border-black flex items-center gap-4 px-4 z-[9999] shadow-sm">
        <img
          src="/logo-shitBucket-day.png"
          alt="ShitBucket"
          className="w-[48px] h-[48px] object-contain shrink-0"
        />
        <Link
          href="/about"
          className="font-black text-2xl tracking-tight hover:opacity-60 transition-opacity shrink-0 flex items-center gap-1"
        >
          <span className="text-black">ShitBucket</span>
          <span className="text-black/30 font-light text-xl">›</span>
        </Link>

        <div className="flex-1" />

        <button
          className="flex items-center justify-center w-12 h-12 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] hover:bg-black hover:text-white transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shrink-0"
          title="WiFi: Connected"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <line x1="12" y1="20" x2="12.01" y2="20"/>
          </svg>
        </button>
      </div>

      {/* ── Main Desktop Interaction Area ── */}
      <div className="absolute top-20 left-0 right-0 bottom-20 overflow-hidden">
        {/* Draggable desktop icons */}
        {iconPositions && ALL_ICONS.map(ic => (
          <div
            key={ic.id}
            style={{ position: "absolute", left: iconPositions[ic.id].x, top: iconPositions[ic.id].y, zIndex: 20 }}
            onMouseDown={(e) => startIconDrag(e, ic.id, openWindow)}
            onTouchStart={(e) => startIconDrag(e, ic.id, openWindow)}
          >
            <DesktopIcon imgSrc={ic.imgSrc} label={ic.label} onClick={() => {}} />
          </div>
        ))}

        {/* Open windows */}
        {openWindows.map(({ id, zIndex }) => (
          <DesktopWindow
            key={id}
            id={id}
            zIndex={zIndex}
            onClose={() => closeWindow(id)}
            onFocus={() => focusWindow(id)}
            openWindow={openWindow}
          />
        ))}
      </div>

      {/* ── Bottom Taskbar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f1dbbe] border-t-2 border-black flex items-center px-4 z-[9999]">
        <button
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black transition-all shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${startMenuOpen ? "bg-black text-white" : "bg-white text-black hover:bg-[#FF6A00] hover:text-white"}`}
        >
          <img
            src="/logo-shitBucket-day.png"
            alt="Start"
            className={`w-8 h-8 object-contain ${startMenuOpen ? "invert" : ""}`}
          />
          <span className="font-black text-base uppercase tracking-widest">Start</span>
        </button>

        {/* Start Menu Popup */}
        {startMenuOpen && (
          <div className="absolute bottom-22 left-4 w-64 bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_#000] overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            <div className="bg-black text-white px-4 py-3 flex items-center gap-2">
              <img src="/logo-shitBucket-day.png" alt="SB" className="w-5 h-5 object-contain invert" />
              <span className="font-black text-[10px] uppercase tracking-widest">ShitBucket OS v1.0</span>
            </div>
            <div className="p-2">
              <button
                onClick={() => openWindow("welcome")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#FF6A00] hover:text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-3"
              >
                <span className="w-5 h-5 flex items-center justify-center text-base">👋</span> Welcome
              </button>
              <button
                onClick={() => openWindow("how-it-works")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#FF6A00] hover:text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-3"
              >
                <img src="/icon_set/How-it-works.png" alt="" className="w-5 h-5 object-contain" /> How It Works
              </button>
              <button
                onClick={() => openWindow("shitbucket-app")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#FF6A00] hover:text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-3"
              >
                <img src="/icon_set/shit-bucket.exe.png" alt="" className="w-5 h-5 object-contain" /> ShitBucket.exe
              </button>
              <div className="h-px bg-black/10 my-2" />
              <Link
                href="/"
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-black hover:text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-3"
              >
                <span className="w-5 h-5 flex items-center justify-center text-base">🚀</span> Open Dashboard
              </Link>
            </div>
          </div>
        )}

        <div className="w-px h-10 bg-black/20 mx-4 shrink-0" />

        <div className="flex-1 flex items-center gap-2 overflow-x-auto min-w-0 pr-4">
          {openWindows.map(({ id }) => {
            const cfg = WINDOWS[id];
            return (
              <button
                key={id}
                onClick={() => focusWindow(id)}
                className="flex items-center gap-2 bg-white border-2 border-black rounded-lg px-4 py-2 text-black font-black text-base uppercase tracking-widest hover:bg-[#FF6A00] hover:text-white transition-all shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none whitespace-nowrap shrink-0"
              >
                {cfg.imgSrc ? (
                  <img src={cfg.imgSrc} alt="" className="w-8 h-8 sm:w-5 sm:h-5 object-contain" />
                ) : (
                  <span className="text-2xl sm:text-base leading-none">{cfg.icon}</span>
                )}
                <span className="hidden sm:inline">{cfg.label}</span>
              </button>

            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-black/40 hover:text-black transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>
          <TaskbarDateTime />
        </div>
      </div>
    </div>
  );
}
