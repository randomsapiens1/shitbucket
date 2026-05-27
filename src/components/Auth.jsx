"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth({ theme, setTheme }) {
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
    <div className="min-h-screen bg-bucket-bg flex flex-col items-center justify-center px-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-bucket-card border border-bucket-border rounded-xl p-2.5 text-bucket-text-dim hover:text-bucket-text transition shadow-sm"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-4 overflow-hidden">
          <img 
            src={theme === "dark" ? "/shitBucket-night.png" : "/shitBucket-day.png"} 
            alt="shitbucket" 
            className="w-full h-auto mx-auto object-contain" 
          />
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
          className={`w-full mt-4 border rounded-lg py-3 text-sm font-bold tracking-wide transition-all disabled:opacity-40 shadow-sm ${
            isSignUp 
              ? "bg-bucket-accent border-transparent text-black hover:brightness-110" 
              : "bg-bucket-bg border-bucket-border text-bucket-accent hover:border-bucket-border-hover"
          }`}
        >
          {loading ? "..." : isSignUp ? "create account" : "log in"}
        </button>

        {error && (
          <p className="text-red-500 text-xs mt-3 text-center">{error}</p>
        )}

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          className="w-full text-center text-bucket-muted text-xs mt-4 hover:text-bucket-text-dim transition-colors"
        >
          {isSignUp ? "already have an account? log in" : "first time? create account"}
        </button>
      </div>
    </div>
  );
}
