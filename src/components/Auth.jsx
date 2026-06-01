"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username,        setUsername]        = useState("");
  const [isSignUp,        setIsSignUp]        = useState(false);
  const [isReset,         setIsReset]         = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [message,         setMessage]         = useState("");
  const [error,           setError]           = useState("");

  async function handleSubmit() {
    if (!email.trim() || (!isReset && !password.trim())) return;
    
    if (isSignUp) {
      if (!username.trim()) { setError("username is required"); return; }
      if (password !== confirmPassword) { setError("passwords do not match"); return; }
    }

    setLoading(true);
    setError("");
    setMessage("");

    if (isReset) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      setLoading(false);
      if (error) setError(error.message);
      else setMessage("Check your email for the reset link!");
      return;
    }

    const result = isSignUp
      ? await supabase.auth.signUp({ 
          email: email.trim(), 
          password: password.trim(),
          options: {
            data: { username: username.trim() }
          }
        })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });

    setLoading(false);
    if (result.error) setError(result.error.message);
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">

        {/* Logo + headline */}
        <div className="text-center mb-6">
          <img
            src="/shitBucket-day.png"
            alt="ShitBucket"
            className="w-56 h-auto mx-auto mb-2 object-contain"
          />
          <h1 className="text-[28px] font-extrabold text-black leading-tight tracking-tight font-mono lowercase">
            dump your ideas.
          </h1>
          <p className="text-[13px] font-bold text-black/40 mt-1 lowercase">brew them over time.</p>
        </div>

        {/* Form card */}
        <div className="bg-white border-2 border-black rounded-3xl shadow-hard p-6 flex flex-col gap-3">
          {message && (
            <div className="bg-[#CAFF00] border-2 border-black rounded-xl p-3 text-[12px] font-bold text-black text-center mb-1">
              {message}
            </div>
          )}

          {isSignUp && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-2xl px-4 py-3 text-black font-bold text-[14px] outline-none transition placeholder:text-black/30 lowercase"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-2xl px-4 py-3 text-black font-bold text-[14px] outline-none transition placeholder:text-black/30 lowercase"
          />

          {!isReset && (
            <>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-2xl px-4 py-3 text-black font-bold text-[14px] outline-none transition placeholder:text-black/30 lowercase"
              />
              {isSignUp && (
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="confirm password"
                  className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-2xl px-4 py-3 text-black font-bold text-[14px] outline-none transition placeholder:text-black/30 lowercase"
                />
              )}
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-1 rounded-2xl py-3.5 text-[14px] font-extrabold border-2 border-black shadow-hard-sm transition-all disabled:opacity-40 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] bg-black text-white hover:bg-[#FF6A00] hover:text-white uppercase tracking-widest"
          >
            {loading ? "..." : isReset ? "send reset link" : isSignUp ? "create account" : "log in"}
          </button>

          {!isSignUp && (
            <button
              onClick={() => { setIsReset(!isReset); setError(""); setMessage(""); }}
              className="text-[11px] font-bold text-black/40 hover:text-black transition-colors self-center mt-1 lowercase"
            >
              {isReset ? "back to login" : "forgot password?"}
            </button>
          )}

          {error && (
            <p className="text-red-500 text-[12px] font-bold text-center lowercase">{error}</p>
          )}
        </div>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setIsReset(false); setError(""); setMessage(""); }}
          className="w-full text-center text-black/40 font-bold text-[12px] mt-5 hover:text-black transition lowercase"
        >
          {isSignUp ? "already have an account? log in" : "first time? create account"}
        </button>

        <div className="mt-12 text-center">
          <a
            href="/about"
            className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF6A00] border-2 border-black rounded-full px-5 py-2.5 bg-white shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            What is ShitBucket?
          </a>
        </div>
      </div>
    </div>
  );
}
