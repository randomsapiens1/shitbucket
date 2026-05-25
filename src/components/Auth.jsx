"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
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
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
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

        {!sent ? (
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
              placeholder="your email"
              className="w-full bg-bucket-card border border-bucket-border rounded-lg px-4 py-3 text-bucket-text text-sm outline-none focus:border-bucket-accent-dim transition-colors"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-3 bg-[#0a0a08] border border-bucket-border text-bucket-accent rounded-lg py-3 text-sm font-bold tracking-wide disabled:opacity-40"
            >
              {loading ? "sending..." : "send magic link"}
            </button>
            {error && (
              <p className="text-red-500 text-xs mt-3 text-center">{error}</p>
            )}
            <p className="text-bucket-muted text-[10px] mt-4 text-center leading-relaxed">
              no password needed. we send a login link to your email.
            </p>
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
      </div>
    </div>
  );
}
