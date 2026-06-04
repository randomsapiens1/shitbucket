"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";
import Bucket from "@/components/Bucket";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === "SIGNED_IN") setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = useCallback(() => {
    setSession(null);
  }, []);

  if (loading) return <LoadingScreen />;
  if (!session) return <Auth />;
  return <Bucket onLogout={handleLogout} userId={session?.user?.id} />;
}
