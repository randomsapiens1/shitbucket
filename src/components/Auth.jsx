"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth({ embedded = false }) {
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
    <div className={`${embedded ? "" : "min-h-screen bg-[#FFF8EE] pt-8 sm:pt-0"} flex flex-col items-center sm:justify-center px-3 sm:px-5`}>
      <div className="w-full sm:max-w-sm">

        {/* Playful Branding Area */}
        <div className={`flex flex-col items-center ${embedded ? "mb-4" : "mb-8"}`}>
          <div className={`relative ${embedded ? "mb-2" : "mb-6"}`}>
            <div className={`absolute -inset-6 bg-[#FF6A00]/10 rounded-full blur-2xl ${embedded ? "hidden" : ""}`} />
            <img
              src="/shitBucket-day.png"
              alt="ShitBucket"
              className={`relative ${embedded ? "w-32" : "w-48 sm:w-64"} h-auto object-contain`}
            />
          </div>
          
          <h1 className={`${embedded ? "text-xl" : "text-[calc((36/12)*var(--base-font-size))] sm:text-[calc((42/12)*var(--base-font-size))]"} font-black text-black leading-[0.9] tracking-tighter uppercase text-center`} style={{ fontFamily: "'Inter', sans-serif" }}>
            Dump your <br />
            thoughts. <br />
            <span className="text-[#FF6A00]">RAW.</span>
          </h1>
        </div>

        {/* Form Card - Mobile Friendly Refinement */}
        <div className="bg-white border-2 border-black rounded-[32px] sm:rounded-[40px] shadow-hard p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden w-full">
          {/* Subtle accent corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF6A00]/5 -mr-8 -mt-8 rounded-full" />
          
          {message && (
            <div className="bg-[#CAFF00] border-2 border-black rounded-2xl p-3 text-[calc((12/12)*var(--base-font-size))] font-bold text-black text-center mb-1">
              {message}
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="name your bucket"
                  className="w-full bg-[#FFF8EE] border-2 border-black rounded-2xl px-5 py-4 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/20 focus:border-[#FF6A00]"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-[#FFF8EE] border-2 border-black rounded-2xl px-5 py-4 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30 focus:border-[#FF6A00]"
              />
            </div>

            {!isReset && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFF8EE] border-2 border-black rounded-2xl px-5 py-4 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30 focus:border-[#FF6A00]"
                />
              </div>
            )}

            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full bg-[#FFF8EE] border-2 border-black rounded-2xl px-5 py-4 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30 focus:border-[#FF6A00]"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-2 rounded-[24px] py-4.5 text-[calc((15/12)*var(--base-font-size))] font-black border-2 border-black shadow-hard-sm transition-all disabled:opacity-40 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] bg-black text-white hover:bg-[#FF6A00] uppercase tracking-widest"
          >
            {loading ? "..." : isReset ? "Reset Access" : isSignUp ? "Create Account" : "Let's Brew"}
          </button>

          {!isSignUp && (
            <button
              onClick={() => { setIsReset(!isReset); setError(""); setMessage(""); }}
              className="text-[calc((11/12)*var(--base-font-size))] font-black text-black/40 hover:text-black transition-colors self-center uppercase tracking-wider"
            >
              {isReset ? "back to login" : "forgot password?"}
            </button>
          )}

          {error && (
            <p className="text-red-500 text-[calc((12/12)*var(--base-font-size))] font-bold text-center lowercase">{error}</p>
          )}
        </div>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setIsReset(false); setError(""); setMessage(""); }}
          className="w-full text-center text-black font-black text-[calc((12/12)*var(--base-font-size))] mt-8 hover:text-[#FF6A00] transition uppercase tracking-widest"
        >
          {isSignUp ? "Already brewing? log in" : "Need a bucket? create account"}
        </button>
      </div>
    </div>
  );
}
