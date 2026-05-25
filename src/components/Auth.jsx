"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) setError(error.message);
  }

  async function handleEmail(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="min-h-screen bg-bucket-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🪣</div>
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #cc5500, #b38600)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            shitbucket
          </h1>
          <p className="text-bucket-muted text-xs mt-2 tracking-widest uppercase">
            dump your ideas
          </p>
        </div>

        {/* Google login */}
        <button
          onClick={handleGoogle}
          className="w-full bg-[#0a0a08] border border-bucket-border rounded-lg py-3 text-sm font-bold tracking-wide flex items-center justify-center gap-2 text-bucket-text"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-bucket-border"></div>
          <span className="text-bucket-muted text-[10px] uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-bucket-border"></div>
        </div>

        {/* Email login */}
        {!sent ? (
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmail(e)}
              placeholder="your email"
              className="w-full bg-bucket-card border border-bucket-border rounded-lg px-4 py-3 text-bucket-text text-sm outline-none focus:border-bucket-accent-dim transition-colors"
            />
            <button
              onClick={handleEmail}
              disabled={loading}
              className="w-full mt-3 bg-[#0a0a08] border border-bucket-border text-bucket-accent rounded-lg py-3 text-sm font-bold tracking-wide disabled:opacity-40"
            >
              {loading ? "sending..." : "send magic link"}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-bucket-card border border-bucket-border rounded-lg p-6">
              <div className="text-2xl mb-2">📬</div>
              <p className="text-bucket-text text-sm">check your email</p>
              <p className="text-bucket-muted text-xs mt-2">
                we sent a magic link to{" "}
                <span className="text-bucket-accent-dim">{email}</span>
              </p>
            </div>
            <button
              onClick={() => setSent(false)}
              className="text-bucket-muted text-xs mt-4 underline"
            >
              try a different email
            </button>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-xs mt-3 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}