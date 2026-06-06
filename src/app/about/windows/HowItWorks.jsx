"use client";

const GRID_BG = {
  backgroundColor: "#F5F2EA",
  backgroundImage: [
    "linear-gradient(rgba(150,190,220,0.2) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(150,190,220,0.2) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "36px 36px",
};

const STEPS = [
  {
    n: "01",
    title: "Dump It",
    img: "/icon_howItWorks/dump-it.png",
    desc: "Write whatever is floating around in your head. Tasks, links, half-baked ideas. The bucket doesn't judge.",
    accent: "#FF6A00",
  },
  {
    n: "02",
    title: "Let It Brew",
    img: "/icon_howItWorks/Let-it-brew.png",
    desc: "Some things matter tomorrow. Some never matter again. Let them sit until you know which is which.",
    accent: "#1A1208",
  },
  {
    n: "03",
    title: "Find It",
    img: "/icon_howItWorks/keep-what-matters.png",
    desc: "Search, filter by tag, or sort by brew score. Future-you will know exactly where to look.",
    accent: "#FF6A00",
  },
  {
    n: "04",
    title: "Or Forget It",
    img: "/icon_howItWorks/work-it.png",
    desc: "Set an expiry. If it hasn't grown legs by then, let it go. Keep the pile clean.",
    accent: "#1A1208",
  },
];

export default function HowItWorks() {
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
            / workflow
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
            How It{" "}
            <span style={{ color: "#FF6A00", fontStyle: "italic" }}>Works</span>
          </h1>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                background: "#ffffff",
                border: "2px solid #1A1208",
                boxShadow: `4px 4px 0px ${s.accent}`,
              }}
            >
              {/* Step label bar */}
              <div
                style={{
                  borderBottom: "2px solid #1A1208",
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: s.accent === "#FF6A00" ? "#FF6A00" : "#1A1208",
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: "#F5F2EA",
                    textTransform: "uppercase",
                  }}
                >
                  Step {s.n}
                </span>
                <span
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#F5F2EA",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.title}
                </span>
              </div>

              {/* Illustration */}
              <div
                style={{
                  borderBottom: "2px solid #1A1208",
                  background: "#F5F2EA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                  height: 180,
                }}
              >
                <img
                  src={s.img}
                  alt={s.title}
                  style={{ height: "100%", width: "auto", objectFit: "contain" }}
                />
              </div>

              {/* Description */}
              <div style={{ padding: "16px" }}>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.65,
                    color: "#1A1208",
                    opacity: 0.7,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
