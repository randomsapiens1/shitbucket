"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";
import Link from "next/link";

export default function ShitBucketApp() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return <div className="p-8 text-center font-black uppercase animate-pulse">Loading...</div>;

  if (!session) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full max-w-sm">
          <p className="text-center font-black uppercase text-[10px] tracking-widest mb-4 opacity-40">Please log in to continue</p>
          <Auth embedded={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-6">
      <div className="w-20 h-20 bg-[#FF6A00] rounded-2xl flex items-center justify-center shadow-hard-sm border-2 border-black">
        <img src="/logo-shitBucket-day.png" alt="Logo" className="w-12 h-12" />
      </div>
      <div className="text-center">
        <h2 className="font-black text-xl uppercase tracking-tighter">Welcome Back!</h2>
        <p className="text-xs text-black/50 font-bold mt-1">You are already logged into your bucket.</p>
      </div>
      <Link 
        href="/"
        className="bg-black text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs border-2 border-black shadow-hard-sm hover:bg-[#FF6A00] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        Open Dashboard
      </Link>
    </div>
  );
}
