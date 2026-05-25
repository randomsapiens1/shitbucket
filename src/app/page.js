"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";
import Bucket from "@/components/Bucket";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-5xl">🪣</div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return <Bucket onLogout={() => setSession(null)} />;
}
