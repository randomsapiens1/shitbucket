"use client";

const GRID_BG = {
  backgroundColor: "#F5F2EA",
  backgroundImage: [
    "linear-gradient(rgba(150,190,220,0.2) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(150,190,220,0.2) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "36px 36px",
};

const REASONS = [
  {
    n: "01",
    label: "Ideas",
    title: "Shower thoughts.",
    desc: "That startup you'll build \"someday.\" That grocery list you keep losing. The stuff that doesn't have a home yet.",
    accent: "#FF6A00",
  },
  {
    n: "02",
    label: "Tabs",
    title: "Close the browser.",
    desc: "For that tab you've kept open for three months because you might need it. Dump the link and breathe.",
    accent: "#1A1208",
  },
  {
    n: "03",
    label: "Peace",
    title: "Offload your brain.",
    desc: "Your brain has better things to do than remember everything. Commit to the mess. Offload to the bucket.",
    accent: "#FF6A00",
  },
];

export default function WhyShitBucket() {
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
            / rationale
          </p>
          <h1
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 900,
              lineHeight: 0.95,
              color: "#1A1208",
              letterSpacing: "-0.02em",
            }}
          >
            A bucket for{" "}
            <span style={{ color: "#FF6A00", fontStyle: "italic" }}>
              unfinished things.
            </span>
          </h1>
        </div>

        {/* Reason rows */}
        <div className="flex flex-col gap-4 mb-8">
          {REASONS.map((r) => (
            <div
              key={r.n}
              style={{
                background: "#ffffff",
                border: "2px solid #1A1208",
                boxShadow: `4px 4px 0px ${r.accent}`,
                display: "flex",
              }}
            >
              {/* Left accent column */}
              <div
                style={{
                  background: r.accent,
                  borderRight: "2px solid #1A1208",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 14px",
                  gap: 6,
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
                  {r.n} / {r.label}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: "20px 24px", flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 18,
                    fontWeight: 900,
                    color: "#1A1208",
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                    marginBottom: 8,
                  }}
                >
                  {r.title}
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
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
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
              letterSpacing: "0.15em",
              color: "#F5F2EA",
              textTransform: "uppercase",
            }}
          >
            Note, not a tax form.
          </span>
        </div>

      </div>
    </div>
  );
}
