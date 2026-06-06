"use client";

const GRID_BG = {
  backgroundColor: "#F5F2EA",
  backgroundImage: [
    "linear-gradient(rgba(150,190,220,0.2) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(150,190,220,0.2) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "36px 36px",
};

const CONTACTS = [
  {
    label: "Email",
    value: "rajkumaryhere@gmail.com",
    href: "mailto:rajkumaryhere@gmail.com",
    desc: "Got a bug? A feature idea? Want to tell me the name is terrible?",
    accent: "#FF6A00",
  },
  {
    label: "Source",
    value: "github.com/randomsapiens1",
    href: "https://github.com/randomsapiens1",
    desc: "Peek into the bucket's internals. Fork it. Break it. Improve it.",
    accent: "#1A1208",
  },
];

export default function ReachOut() {
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
            / contact
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
            Reach{" "}
            <span style={{ color: "#FF6A00", fontStyle: "italic" }}>Out</span>
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
            I read everything. Some of the best features started as messages
            from people using the product.
          </p>
        </div>

        {/* Contact cards */}
        <div className="flex flex-col gap-4 mb-8">
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#ffffff",
                border: "2px solid #1A1208",
                boxShadow: `4px 4px 0px ${c.accent}`,
                display: "flex",
                textDecoration: "none",
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `4px 4px 0px ${c.accent}`; }}
            >
              {/* Accent column */}
              <div
                style={{
                  background: c.accent,
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
                  {c.label}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: "20px 24px", flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1A1208",
                    marginBottom: 6,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.value}
                </p>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.55,
                    color: "#1A1208",
                    opacity: 0.6,
                    margin: 0,
                  }}
                >
                  {c.desc}
                </p>
              </div>

              {/* Arrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingRight: 20,
                  color: "#1A1208",
                  opacity: 0.25,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                ↗
              </div>
            </a>
          ))}
        </div>

        {/* Footer quote */}
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
            Commit to the mess.
          </span>
        </div>

      </div>
    </div>
  );
}
