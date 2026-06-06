"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const GRID_BG = {
  backgroundColor: "#F5F2EA",
  backgroundImage: [
    "linear-gradient(rgba(150,190,220,0.2) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(150,190,220,0.2) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "36px 36px",
};

const inputStyle = {
  width: "100%",
  background: "#ffffff",
  border: "2px solid #1A1208",
  padding: "12px 16px",
  fontFamily: "'Barlow', sans-serif",
  fontSize: 14,
  fontWeight: 600,
  color: "#1A1208",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: "#1A1208",
  opacity: 0.4,
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
};

export default function ShitBucketApp() {
  const router = useRouter();
  const [session,         setSession]         = useState(undefined);
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username,        setUsername]        = useState("");
  const [isSignUp,        setIsSignUp]        = useState(false);
  const [isReset,         setIsReset]         = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [message,         setMessage]         = useState("");
  const [error,           setError]           = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit() {
    if (!email.trim() || (!isReset && !password.trim())) return;
    if (isSignUp && !username.trim()) { setError("username is required"); return; }
    if (isSignUp && password !== confirmPassword) { setError("passwords do not match"); return; }

    setLoading(true);
    setError("");
    setMessage("");

    if (isReset) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      setLoading(false);
      if (error) setError(error.message);
      else setMessage("Check your email for the reset link.");
      return;
    }

    const result = isSignUp
      ? await supabase.auth.signUp({ email: email.trim(), password: password.trim(), options: { data: { username: username.trim() } } })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });

    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else if (!isSignUp) {
      router.push("/");
    }
  }

  // ── Loading ──
  if (session === undefined) {
    return (
      <div className="-m-6 flex items-center justify-center" style={{ ...GRID_BG, minHeight: 300 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#1A1208", opacity: 0.4, textTransform: "uppercase" }}>
          Loading...
        </span>
      </div>
    );
  }

  // ── Logged in ──
  if (session) {
    return (
      <div className="-m-6 overflow-hidden" style={GRID_BG}>
        <div className="p-8 flex flex-col gap-6">
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#1A1208", opacity: 0.35, textTransform: "uppercase", marginBottom: 10 }}>
              / authenticated
            </p>
            <h1 style={{ fontFamily: "'Barlow', sans-serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, lineHeight: 0.95, color: "#1A1208", letterSpacing: "-0.02em" }}>
              Welcome{" "}
              <span style={{ color: "#FF6A00", fontStyle: "italic" }}>Back</span>
            </h1>
          </div>

          <div style={{ background: "#ffffff", border: "2px solid #1A1208", boxShadow: "4px 4px 0px #FF6A00", display: "flex" }}>
            <div style={{ background: "#FF6A00", borderRight: "2px solid #1A1208", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 14px", minWidth: 64 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "#F5F2EA", textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                Status
              </span>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 500, lineHeight: 1.65, color: "#1A1208", opacity: 0.65, margin: 0 }}>
                You are already logged in. Your bucket is waiting.
              </p>
            </div>
          </div>

          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
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
              padding: "14px 24px",
              textDecoration: "none",
              display: "block",
              textAlign: "center",
              transition: "all 0.1s",
            }}
          >
            Open Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  // ── Auth form ──
  return (
    <div className="-m-6 overflow-y-auto" style={GRID_BG}>
      <div className="p-8">

        <div className="mb-6">
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#1A1208", opacity: 0.35, textTransform: "uppercase", marginBottom: 10 }}>
            / {isReset ? "reset access" : isSignUp ? "create account" : "authenticate"}
          </p>
          <h1 style={{ fontFamily: "'Barlow', sans-serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, lineHeight: 0.95, color: "#1A1208", letterSpacing: "-0.02em" }}>
            {isReset ? "Reset" : isSignUp ? "Get a" : "Get in the"}{" "}
            <span style={{ color: "#FF6A00", fontStyle: "italic" }}>
              {isReset ? "Access" : "Bucket"}
            </span>
          </h1>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4 mb-5">
          {isSignUp && (
            <div>
              <label style={labelStyle}>Username</label>
              <input style={inputStyle} type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="your_name" />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          {!isReset && (
            <div>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && !isSignUp && handleSubmit()} />
            </div>
          )}
          {isSignUp && (
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input style={inputStyle} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
          )}
        </div>

        {/* Feedback */}
        {error && (
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, color: "#FF6A00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            ✕ {error}
          </p>
        )}
        {message && (
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, color: "#1A1208", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            ✓ {message}
          </p>
        )}

        {/* Primary CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: loading ? "#888" : "#1A1208",
            color: "#F5F2EA",
            border: "2px solid #1A1208",
            boxShadow: loading ? "none" : "4px 4px 0px #FF6A00",
            padding: "14px 24px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 16,
            transition: "all 0.1s",
          }}
          onMouseDown={e => { if (!loading) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; } }}
          onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = loading ? "none" : "4px 4px 0px #FF6A00"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = loading ? "none" : "4px 4px 0px #FF6A00"; }}
        >
          {loading ? "..." : isReset ? "Send Reset Link" : isSignUp ? "Create Account" : "Authorize →"}
        </button>

        {/* Secondary actions */}
        <div className="flex flex-col gap-2">
          {!isSignUp && (
            <button
              onClick={() => { setIsReset(!isReset); setError(""); setMessage(""); }}
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "#1A1208", opacity: 0.35, textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
            >
              {isReset ? "← Back to login" : "Forgot password?"}
            </button>
          )}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setIsReset(false); setError(""); setMessage(""); }}
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "#1A1208", opacity: 0.35, textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
          >
            {isSignUp ? "← Already have an account?" : "No account? Sign up →"}
          </button>
        </div>

      </div>
    </div>
  );
}
