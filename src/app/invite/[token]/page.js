"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCollabInvite, acceptCollabInvite } from "@/lib/db";

export default function InvitePage() {
  const { token } = useParams();
  const router = useRouter();

  const [invite,   setInvite]   = useState(null);
  const [session,  setSession]  = useState(undefined);
  const [loading,  setLoading]  = useState(true);
  const [joining,  setJoining]  = useState(false);
  const [error,    setError]    = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    async function init() {
      const [inviteData, { data: { session: sess } }] = await Promise.all([
        getCollabInvite(token),
        supabase.auth.getSession(),
      ]);
      setInvite(inviteData);
      setSession(sess);
      setLoading(false);
    }
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, sess) => {
      setSession(sess);
    });
    return () => subscription.unsubscribe();
  }, [token]);

  async function joinBucket(sess) {
    const activeSession = sess ?? session;
    if (!activeSession) return;
    setJoining(true);
    setError("");
    try {
      await acceptCollabInvite(token);
      router.push("/");
    } catch (e) {
      setError(e.message || "Failed to join. Try again.");
      setJoining(false);
    }
  }

  async function handleAuth() {
    setJoining(true);
    setError("");
    const result = isSignUp
      ? await supabase.auth.signUp({ email: email.trim(), password: password.trim() })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });

    if (result.error) {
      setError(result.error.message);
      setJoining(false);
      return;
    }
    await joinBucket(result.data.session);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8EE] flex items-center justify-center">
        <div className="text-5xl">🪣</div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-[#FFF8EE] flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-4xl">🪣</div>
        <p className="font-bold text-black/40 text-[calc((14/12)*var(--base-font-size))] text-center">
          this invite doesn&apos;t exist or has already been used.
        </p>
        <a href="/" className="text-[#FF6A00] font-extrabold text-[calc((13/12)*var(--base-font-size))] underline">
          go to shitbucket
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">

        {/* Branding */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <img src="/logo-shitBucket-day.png" alt="ShitBucket" className="w-7 h-7 object-contain" />
          <span className="font-extrabold text-[calc((16/12)*var(--base-font-size))] text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
            ShitBucket
          </span>
        </div>

        {/* Invite card */}
        <div className="bg-white border-2 border-black rounded-3xl shadow-hard p-5 mb-5">
          <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.15em] text-black/40 mb-1">
            you&apos;re invited to collaborate
          </p>
          <h1 className="text-[calc((22/12)*var(--base-font-size))] font-extrabold text-black leading-snug mb-3">
            {invite.idea_title}
          </h1>
          <p className="text-[calc((12/12)*var(--base-font-size))] font-bold text-black/50">
            from <span className="text-black">{invite.inviter_email}</span>
          </p>
        </div>

        {/* Join (logged in) */}
        {session ? (
          <div>
            <button
              onClick={() => joinBucket()}
              disabled={joining}
              className="w-full rounded-2xl py-3.5 text-[calc((14/12)*var(--base-font-size))] font-extrabold border-2 border-black shadow-hard-sm transition-all disabled:opacity-40 active:shadow-none active:translate-x-[3px] active:translate-y-[3px] bg-[#FF6A00] text-white"
            >
              {joining ? "joining..." : "👥 join this bucket"}
            </button>
            {error && (
              <p className="text-red-500 text-[calc((12/12)*var(--base-font-size))] font-bold text-center mt-3">{error}</p>
            )}
          </div>
        ) : (
          /* Auth form (not logged in) */
          <div className="bg-white border-2 border-black rounded-3xl shadow-hard p-5 flex flex-col gap-3">
            <p className="text-[calc((12/12)*var(--base-font-size))] font-bold text-black/40 text-center mb-1">
              {isSignUp ? "create an account to join" : "log in to join"}
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-2xl px-4 py-3 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              placeholder="password"
              className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-2xl px-4 py-3 text-black font-bold text-[calc((14/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
            />
            <button
              onClick={handleAuth}
              disabled={joining}
              className="w-full mt-1 rounded-2xl py-3.5 text-[calc((14/12)*var(--base-font-size))] font-extrabold border-2 border-black shadow-hard-sm transition-all disabled:opacity-40 active:shadow-none active:translate-x-[3px] active:translate-y-[3px] bg-black text-white hover:bg-[#FF6A00]"
            >
              {joining ? "..." : isSignUp ? "create account & join" : "log in & join"}
            </button>
            {error && (
              <p className="text-red-500 text-[calc((12/12)*var(--base-font-size))] font-bold text-center">{error}</p>
            )}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="text-black/40 font-bold text-[calc((12/12)*var(--base-font-size))] text-center hover:text-black transition"
            >
              {isSignUp ? "already have an account? log in" : "first time? create account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
