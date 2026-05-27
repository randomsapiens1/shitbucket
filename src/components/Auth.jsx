"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");

    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });
    } else {
      result = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
    }

    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    }
  }

  return (
    <div className="min-h-screen bg-bucket-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/logo-shitBucket.png" alt="shitbucket" className="w-16 h-16 mx-auto mb-3" />
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

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="w-full bg-bucket-card border border-bucket-border rounded-lg px-4 py-3 text-bucket-text text-sm outline-none focus:border-bucket-accent-dim transition-colors mb-3"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="password"
          className="w-full bg-bucket-card border border-bucket-border rounded-lg px-4 py-3 text-bucket-text text-sm outline-none focus:border-bucket-accent-dim transition-colors"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-bucket-bg border border-bucket-border text-bucket-accent rounded-lg py-3 text-sm font-bold tracking-wide disabled:opacity-40"
        >
          {loading ? "..." : isSignUp ? "create account" : "log in"}
        </button>

        {error && (
          <p className="text-red-500 text-xs mt-3 text-center">{error}</p>
        )}

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          className="w-full text-center text-bucket-muted text-xs mt-4"
        >
          {isSignUp ? "already have an account? log in" : "first time? create account"}
        </button>
      </div>
    </div>
  );
}