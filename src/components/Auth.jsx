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

  const inputClass = `w-full bg-[#FFF8EE] border-2 border-black rounded-xl px-5 py-4 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/20 focus:border-[#FF6A00] focus:shadow-hard-sm`;
  const labelClass = `text-[10px] font-black uppercase tracking-[0.2em] text-black/40 ml-1 mb-1.5 block`;

  return (
    <div className="min-h-screen bg-[#FFF8EE] flex flex-col items-center justify-center p-4">
      
      {/* Background Decorative Element */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-10%] left-[-10%] text-[40vw] font-black leading-none select-none">SHIT</div>
        <div className="absolute bottom-[-10%] right-[-10%] text-[40vw] font-black leading-none select-none text-[#FF6A00]">BUCKET</div>
      </div>

      <div className="w-full max-w-sm z-10">
        
        {/* Branding Area */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="relative mb-6 group">
            <div className="absolute -inset-4 bg-[#FF6A00]/10 rounded-full blur-xl group-hover:bg-[#FF6A00]/20 transition-all" />
            <img
              src="/logo-shitBucket-day.png"
              alt="ShitBucket"
              className="relative w-20 h-20 object-contain animate-in fade-in zoom-in duration-500"
            />
          </div>
          <h1 className="text-[calc((42/12)*var(--base-font-size))] font-black leading-[0.85] tracking-tighter uppercase text-black">
            Get / <br />
            <span className="text-[#FF6A00]">A Bucket</span>
          </h1>
        </div>

        {/* Auth Window */}
        <div className="bg-white border-4 border-black shadow-hard-lg rounded-[2px] overflow-hidden">
          
          {/* Title Bar */}
          <div className="bg-black text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#FF6A00]" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
              <span className="font-black text-[9px] uppercase tracking-widest">not_a_tax_form.exe</span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-white/20" />
              <div className="w-2 h-2 bg-white/20" />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {message && (
              <div className="bg-[#CAFF00] border-2 border-black rounded-xl p-3 text-[calc((12/12)*var(--base-font-size))] font-black text-black text-center uppercase tracking-tight">
                {message}
              </div>
            )}

            <div className="space-y-4">
              {isSignUp && (
                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="NAME_YOUR_BUCKET"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>Email / Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="USER@HOST.COM"
                  className={inputClass}
                />
              </div>

              {!isReset && (
                <div>
                  <label className={labelClass}>Key / Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className={labelClass}>Verify Key</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-2 bg-black text-white rounded-xl py-4.5 font-black uppercase tracking-[0.2em] border-2 border-black shadow-hard-sm transition-all hover:bg-[#FF6A00] disabled:opacity-40 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[calc((13/12)*var(--base-font-size))]"
            >
              {loading ? "..." : isReset ? "Reset Access" : isSignUp ? "Create Identity" : "Authorize"}
            </button>

            {error && (
              <p className="text-red-500 text-[calc((11/12)*var(--base-font-size))] font-black text-center uppercase tracking-tight bg-red-50 border border-red-200 p-2 rounded-lg">{error}</p>
            )}

            {!isSignUp && (
              <button
                onClick={() => { setIsReset(!isReset); setError(""); setMessage(""); }}
                className="w-full text-center text-[calc((10/12)*var(--base-font-size))] font-black text-black/30 hover:text-black transition-colors uppercase tracking-widest"
              >
                {isReset ? "Return to Auth" : "Lost access / reset key?"}
              </button>
            )}
          </div>
        </div>

        {/* Footer Toggle */}
        <button
          onClick={() => { setIsSignUp(!isSignUp); setIsReset(false); setError(""); setMessage(""); }}
          className="w-full text-center mt-8 group"
        >
          <span className="text-black/30 font-black text-[calc((11/12)*var(--base-font-size))] uppercase tracking-widest group-hover:text-black transition-colors">
            {isSignUp ? "Already identified?" : "New operative?"}
          </span>
          <span className="block text-black font-black text-[calc((12/12)*var(--base-font-size))] uppercase tracking-[0.15em] group-hover:text-[#FF6A00] transition-colors">
            {isSignUp ? "Authenticate" : "Create Account"}
          </span>
        </button>

      </div>
    </div>
  );
}
