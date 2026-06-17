"use client";

const GRID_BG = {
  backgroundColor: "#F5F2EA",
  backgroundImage: [
    "linear-gradient(rgba(150,190,220,0.2) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(150,190,220,0.2) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "36px 36px",
};

const PRINCIPLES = [
  {
    n: "P1",
    title: "Speed over Structure",
    desc: "An idea captured in 3 seconds beats a perfectly organised note that never gets written. The Quick Dump is a deliberate design decision, not a shortcut.",
    accent: "#FF6A00",
  },
  {
    n: "P2",
    title: "One Pile, Zero Folders",
    desc: "Folders are where ideas go to die. Everything lives in one searchable, filterable pile. Tags replace hierarchy. Simplicity beats taxonomy.",
    accent: "#1A1208",
  },
  {
    n: "P3",
    title: "Brutalist by Design",
    desc: "The hard shadows and raw typography aren't a trend. They're a statement. This tool is honest about what it is. No gradients hiding complexity.",
    accent: "#FF6A00",
  },
  {
    n: "P4",
    title: "Earn Your Polish",
    desc: "Ideas start messy. ShitBucket rewards clarity over time. Structure emerges when an idea deserves it — not before.",
    accent: "#1A1208",
  },
];

export default function DesignPhilosophy() {
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
            / philosophy
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
            Design{" "}
            <span style={{ color: "#FF6A00", fontStyle: "italic" }}>
              Philosophy
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
            Every decision in ShitBucket was made in service of one thing: getting the thought out of your head and into the bucket as fast as possible.
          </p>
        </div>

        {/* Principles */}
        <div className="flex flex-col gap-4 mb-8">
          {PRINCIPLES.map((p) => (
            <div
              key={p.n}
              style={{
                background: "#ffffff",
                border: "2px solid #1A1208",
                boxShadow: `4px 4px 0px ${p.accent}`,
                display: "flex",
              }}
            >
              {/* Accent column */}
              <div
                style={{
                  background: p.accent,
                  borderRight: "2px solid #1A1208",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 14px",
                  minWidth: 64,
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "#F5F2EA",
                    textTransform: "uppercase",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {p.n}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: "20px 24px", flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 17,
                    fontWeight: 900,
                    color: "#1A1208",
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                    marginBottom: 8,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.65,
                    color: "#1A1208",
                    opacity: 0.65,
                    margin: 0,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
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
            Expiry is a feature. Let the bad ideas go.
          </span>
        </div>

      </div>
    </div>
  );
}
