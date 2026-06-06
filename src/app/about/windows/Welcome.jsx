"use client";

const GRID_BG = {
  backgroundColor: "#F5F2EA",
  backgroundImage: [
    "linear-gradient(rgba(150,190,220,0.2) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(150,190,220,0.2) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "36px 36px",
};

export default function Welcome({ onClose, openWindow }) {
  return (
    <div className="-m-6 overflow-hidden" style={GRID_BG}>
      <div className="flex flex-col sm:flex-row min-h-[480px] items-center">

        {/* ── Left Column 30%: Logo ── */}
        <div
          className="hidden sm:flex flex-col items-center justify-center shrink-0 overflow-hidden"
          style={{ width: "30%" }}
        >
          <img
            src="/shitBucket-day.png"
            alt="ShitBucket"
            style={{ width: "91%", height: "auto", objectFit: "contain" }}
          />
        </div>

        {/* ── Right Column 70% ── */}
        <div className="flex flex-col justify-center p-8 gap-8" style={{ width: "70%" }}>

          {/* Headline */}
          <div>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#1A1208",
                opacity: 0.35,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Personal Workspace
            </p>
            <h1
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "clamp(28px, 5vw, 40px)",
                fontWeight: 900,
                lineHeight: 1,
                color: "#1A1208",
              }}
            >
              welcome to{" "}
              <span style={{ color: "#FF6A00", fontStyle: "italic" }}>
                ShitBucket
              </span>
            </h1>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4">
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.7,
                color: "#1A1208",
                opacity: 0.7,
              }}
            >
              ShitBucket is a personal workspace for everything on your mind.
              Capture ideas, tasks, notes, shopping lists, reminders, links, and
              anything else before it&apos;s forgotten. Whether you&apos;re planning a
              startup, organising your day, saving research, or just keeping
              track of what to buy later, ShitBucket gives everything a place to
              live.
            </p>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.7,
                color: "#1A1208",
                opacity: 0.7,
              }}
            >
              Use it as a note app, a task manager, an idea incubator, or all
              three at once. No complicated systems. No mandatory structure. Just
              a flexible workspace that adapts to how your brain works.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={() => { onClose(); openWindow("how-it-works"); }}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "#F5F2EA",
                color: "#1A1208",
                border: "2px solid #1A1208",
                boxShadow: "4px 4px 0px #1A1208",
                padding: "12px 24px",
                cursor: "pointer",
                transition: "all 0.1s",
              }}
              onMouseDown={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
              onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0px #1A1208"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0px #1A1208"; }}
            >
              How It Works
            </button>
            <button
              onClick={onClose}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "#1A1208",
                color: "#F5F2EA",
                border: "2px solid #1A1208",
                boxShadow: "4px 4px 0px #FF6A00",
                padding: "12px 24px",
                cursor: "pointer",
                transition: "all 0.1s",
              }}
              onMouseDown={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
              onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0px #FF6A00"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0px #FF6A00"; }}
            >
              Start Dumping →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
