"use client";

const GRID_BG = {
  backgroundColor: "#F5F2EA",
  backgroundImage: [
    "linear-gradient(rgba(150,190,220,0.2) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(150,190,220,0.2) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "36px 36px",
};

const PLATFORMS = [
  {
    id: "ios",
    label: "iOS",
    title: "iPhone & iPad",
    accent: "#FF6A00",
    steps: [
      { n: "1", text: "Open shitbucket.app in Safari (must be Safari, not Chrome)." },
      { n: "2", text: 'Tap the Share button — the box with an arrow pointing up at the bottom of the screen.' },
      { n: "3", text: 'Scroll down and tap "Add to Home Screen".' },
      { n: "4", text: 'Give it a name (or keep "ShitBucket") and tap Add.' },
      { n: "5", text: "The app icon appears on your home screen. Open it — it runs full screen, no browser bar." },
    ],
  },
  {
    id: "android",
    label: "Android",
    title: "Android",
    accent: "#1A1208",
    steps: [
      { n: "1", text: "Open shitbucket.app in Chrome." },
      { n: "2", text: 'Tap the three-dot menu (⋮) in the top-right corner.' },
      { n: "3", text: 'Tap "Add to Home screen" or "Install app" if a banner appeared at the bottom.' },
      { n: "4", text: "Tap Add or Install to confirm." },
      { n: "5", text: "The app icon lands on your home screen and runs like a native app." },
    ],
  },
  {
    id: "desktop",
    label: "Desktop",
    title: "Chrome / Edge (Desktop)",
    accent: "#FF6A00",
    steps: [
      { n: "1", text: "Open shitbucket.app in Chrome or Edge." },
      { n: "2", text: "Look for the install icon (⊕) in the address bar on the right side." },
      { n: "3", text: 'Click it and select "Install".' },
      { n: "4", text: "ShitBucket opens as its own window — no tabs, no browser chrome." },
    ],
  },
];

export default function HowToInstall() {
  return (
    <div className="-m-6 overflow-y-auto" style={GRID_BG}>
      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.25em",
              color: "#1A1208",
              opacity: 0.35,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            / install
          </p>
          <h1
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 900,
              lineHeight: 0.95,
              color: "#1A1208",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Add to{" "}
            <span style={{ color: "#FF6A00", fontStyle: "italic" }}>
              Home Screen
            </span>
          </h1>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.65,
              color: "#1A1208",
              opacity: 0.65,
            }}
          >
            ShitBucket is a PWA — install it like a native app on any device. No App Store required.
          </p>
        </div>

        {/* Platform sections */}
        <div className="flex flex-col gap-6">
          {PLATFORMS.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#ffffff",
                border: "2px solid #1A1208",
                boxShadow: `4px 4px 0px ${p.accent}`,
              }}
            >
              {/* Platform header */}
              <div
                style={{
                  background: p.accent,
                  borderBottom: "2px solid #1A1208",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: "#F5F2EA",
                    textTransform: "uppercase",
                  }}
                >
                  {p.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 14,
                    fontWeight: 900,
                    color: "#F5F2EA",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                >
                  {p.title}
                </span>
              </div>

              {/* Steps */}
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                {p.steps.map((s) => (
                  <div key={s.n} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        color: "#F5F2EA",
                        background: p.accent,
                        border: `1.5px solid #1A1208`,
                        minWidth: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {s.n}
                    </span>
                    <p
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: 1.65,
                        color: "#1A1208",
                        opacity: 0.75,
                        margin: 0,
                      }}
                    >
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            border: "2px solid #1A1208",
            boxShadow: "4px 4px 0px #FF6A00",
            background: "#1A1208",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#F5F2EA",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Works offline. No App Store. No updates to approve.
          </span>
        </div>

      </div>
    </div>
  );
}
