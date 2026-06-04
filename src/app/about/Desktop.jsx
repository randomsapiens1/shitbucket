"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

import HowItWorks      from "./windows/HowItWorks";
import WhyShitBucket   from "./windows/WhyShitBucket";
import DesignPhilosophy from "./windows/DesignPhilosophy";
import ReachOut        from "./windows/ReachOut";
import ShitBucketApp   from "./windows/ShitBucketApp";

// ── Window Registry ────────────────────────────────────────────────────────────
// To edit a window's content, open its file in src/app/about/windows/

const WINDOWS = {
  "how-it-works":      { label: "How It Works",      icon: "❓", Content: HowItWorks,       defaultPos: { x: 60,  y: 40 } },
  "why-shitbucket":    { label: "Why ShitBucket?",   icon: "💡", Content: WhyShitBucket,    defaultPos: { x: 100, y: 60 } },
  "design-philosophy": { label: "Design Philosophy", icon: "🎨", Content: DesignPhilosophy, defaultPos: { x: 140, y: 50 } },
  "reach-out":         { label: "Reach Out",         icon: "✉️", Content: ReachOut,         defaultPos: { x: 120, y: 80 } },
  "shitbucket-app":    { label: "ShitBucket.exe",    icon: "🪣", Content: ShitBucketApp,    defaultPos: { x: 100, y: 100 } },
};

// ── Desktop Icons ──────────────────────────────────────────────────────────────
// Edit label/imgSrc here, content in windows/*.jsx

const LEFT_ICONS = [
  { id: "how-it-works",      imgSrc: "/icon_set/How-it-works.png",       label: "How It Works" },
  { id: "why-shitbucket",    imgSrc: "/icon_set/why-shit-bucket.png",     label: "Why ShitBucket?" },
  { id: "reach-out",         imgSrc: "/icon_set/contact me.png",          label: "Reach Out" },
];

const RIGHT_ICONS = [
  { id: "design-philosophy", imgSrc: "/icon_set/design-philosophy.png",  label: "Design Philosophy" },
];

// ── DesktopWindow ──────────────────────────────────────────────────────────────

function DesktopWindow({ id, zIndex, onClose, onFocus }) {
  const cfg = WINDOWS[id];
  const [pos, setPos] = useState(cfg.defaultPos);
  const winRef = useRef(null);

  useEffect(() => {
    const vw = window.innerWidth;
    const w  = Math.min(Math.max(380, vw * 0.65), 960);
    setPos({
      x: Math.max(8, (vw - w) / 2),
      y: Math.max(40, window.innerHeight * 0.1),
    });
  }, []);

  const handleTitleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    onFocus();
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;
    const onMove = (ev) => {
      const w = winRef.current?.offsetWidth  || 600;
      const h = winRef.current?.offsetHeight || 400;
      setPos({
        x: Math.min(Math.max(0, ev.clientX - startX), window.innerWidth  - w),
        y: Math.min(Math.max(0, ev.clientY - startY), window.innerHeight - 64 - h),
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
      setPos({
        x: Math.min(Math.max(0, t.clientX - startX), window.innerWidth  - w),
        y: Math.min(Math.max(0, t.clientY - startY), window.innerHeight - 64 - h),
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
      style={{ position: "fixed", left: pos.x, top: pos.y, zIndex, width: "clamp(380px, 65vw, 960px)" }}
      className="border-2 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_#000] select-none"
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-2.5 bg-black text-white cursor-grab active:cursor-grabbing"
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm leading-none">{cfg.icon}</span>
          <span className="font-black text-[10px] uppercase tracking-widest">{cfg.label}</span>
        </div>
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={onClose}
          className="w-4 h-4 rounded-full bg-[#FF6A00] flex items-center justify-center text-white text-xs font-black hover:bg-red-500 transition-colors leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Content — edit in windows/*.jsx */}
      <div className="p-6 bg-white overflow-y-auto" style={{ maxHeight: "calc(70vh - 2.5rem)" }}>
        <cfg.Content />
      </div>
    </div>
  );
}

// ── Desktop Icon ───────────────────────────────────────────────────────────────

function DesktopIcon({ icon, imgSrc, label, onClick, darkBg }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/15 active:bg-white/25 transition-colors group w-[100px] focus:outline-none"
    >
      <div className={`w-20 h-20 border-2 rounded-2xl flex items-center justify-center text-5xl leading-none transition-all shadow-[3px_3px_0px_rgba(0,0,0,0.4)] ${darkBg ? "bg-black border-black/60 group-hover:border-black" : "bg-white/20 border-white/30 backdrop-blur-sm group-hover:border-white/60 group-hover:bg-white/35"}`}>
        {imgSrc
          ? <img src={imgSrc} alt={label} className="w-14 h-14 object-contain" />
          : icon}
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
      <span className="font-black text-black text-xl tabular-nums leading-none tracking-tight">{time}</span>
      <span className="font-black text-black/60 text-xs uppercase tracking-widest leading-none">{date}</span>
    </div>
  );
}

// ── Desktop ────────────────────────────────────────────────────────────────────

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState([]);
  const topZ = useRef(100);

  const openWindow = useCallback((id) => {
    topZ.current += 1;
    const z = topZ.current;
    setOpenWindows(prev => {
      const exists = prev.find(w => w.id === id);
      if (exists) return prev.map(w => w.id === id ? { ...w, zIndex: z } : w);
      return [...prev, { id, zIndex: z }];
    });
  }, []);

  const closeWindow  = useCallback((id) => setOpenWindows(prev => prev.filter(w => w.id !== id)), []);

  const focusWindow = useCallback((id) => {
    topZ.current += 1;
    const z = topZ.current;
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: z } : w));
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ backgroundImage: "url('/wallpaper.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
    >
      {/* ── Taskbar (Top) ── */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#f1dbbe] border-b-2 border-black/10 flex items-center gap-4 px-4 z-[9999] shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
        <img
          src="/logo-shitBucket-day.png"
          alt="ShitBucket"
          className="w-[42px] h-[42px] object-contain shrink-0"
        />
        <Link
          href="/"
          className="font-black text-xl tracking-tight hover:opacity-60 transition-opacity shrink-0 flex items-center gap-1"
        >
          <span className="text-black">ShitBucket</span>
          <span className="text-black/30 font-light text-lg">›</span>
        </Link>

        <div className="w-px h-8 bg-black/20 shrink-0" />

        <div className="flex-1 flex items-center gap-2 overflow-x-auto min-w-0">
          {openWindows.map(({ id }) => {
            const cfg = WINDOWS[id];
            return (
              <button
                key={id}
                onClick={() => focusWindow(id)}
                className="flex items-center gap-1.5 bg-black/10 border border-black/10 rounded-lg px-3 py-1.5 text-black font-black text-xs uppercase tracking-wider hover:bg-black/20 transition-colors whitespace-nowrap shrink-0"
              >
                <span>{cfg.icon}</span>
                <span className="hidden sm:inline">{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 bg-[#FF6A00] border-2 border-black rounded-xl px-4 py-2 text-white font-black text-sm uppercase tracking-wider hover:bg-[#ff7b1a] transition-all shadow-[3px_3px_0px_#000] shrink-0"
        >
          Dashboard
        </Link>

        <div className="shrink-0">
          <TaskbarDateTime />
        </div>
      </div>

      {/* ── Left column icons ── */}
      <div className="absolute top-20 left-3 flex flex-col gap-1 pb-14">
        <DesktopIcon imgSrc="/icon_set/shit-bucket.exe.png" label="ShitBucket.exe" onClick={() => openWindow("shitbucket-app")} darkBg />
        {LEFT_ICONS.map(ic => (
          <DesktopIcon key={ic.id} icon={ic.icon} imgSrc={ic.imgSrc} label={ic.label} onClick={() => openWindow(ic.id)} />
        ))}
      </div>

      {/* ── Right column icons ── */}
      <div className="absolute top-20 right-3 flex flex-col gap-1 pb-14">
        {RIGHT_ICONS.map(ic => (
          <DesktopIcon key={ic.id} icon={ic.icon} imgSrc={ic.imgSrc} label={ic.label} onClick={() => openWindow(ic.id)} />
        ))}
      </div>

      {/* ── Open windows ── */}
      {openWindows.map(({ id, zIndex }) => (
        <DesktopWindow
          key={id}
          id={id}
          zIndex={zIndex}
          onClose={() => closeWindow(id)}
          onFocus={() => focusWindow(id)}
        />
      ))}
    </div>
  );
}
