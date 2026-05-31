"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");

    const result = isSignUp
      ? await supabase.auth.signUp({ email: email.trim(), password: password.trim() })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });

    setLoading(false);
    if (result.error) setError(result.error.message);
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">

        {/* Logo + headline */}
        <div className="text-center mb-8">
          <img
            src="/shitBucket-day.png"
            alt="ShitBucket"
            className="w-40 h-auto mx-auto mb-5 object-contain"
          />
          <h1 className="text-[28px] font-extrabold text-black leading-tight tracking-tight">
            dump your ideas.
          </h1>
          <p className="text-[13px] font-bold text-black/40 mt-1">brew them over time.</p>
        </div>

        {/* Form card */}
        <div className="bg-white border-2 border-black rounded-3xl shadow-hard p-6 flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-2xl px-4 py-3 text-black font-bold text-[14px] outline-none transition placeholder:text-black/30"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="password"
            className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-2xl px-4 py-3 text-black font-bold text-[14px] outline-none transition placeholder:text-black/30"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-1 rounded-2xl py-3.5 text-[14px] font-extrabold border-2 border-black shadow-hard-sm transition-all disabled:opacity-40 active:shadow-none active:translate-x-[3px] active:translate-y-[3px] bg-black text-white hover:bg-[#FF6A00] hover:text-white"
          >
            {loading ? "..." : isSignUp ? "create account" : "log in"}
          </button>

          {error && (
            <p className="text-red-500 text-[12px] font-bold text-center">{error}</p>
          )}
        </div>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          className="w-full text-center text-black/40 font-bold text-[12px] mt-5 hover:text-black transition"
        >
          {isSignUp ? "already have an account? log in" : "first time? create account"}
        </button>
      </div>
    </div>
  );
}
