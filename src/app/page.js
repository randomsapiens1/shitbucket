"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";
import Bucket from "@/components/Bucket";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Sync theme with localStorage and DOM
    const savedTheme = localStorage.getItem("shitbucket-theme") || "dark";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("shitbucket-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Handle the OAuth redirect first
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === "SIGNED_IN") {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen theme={theme} />;
  }

  if (!session) {
    return <Auth theme={theme} setTheme={setTheme} />;
  }

  return (
    <Bucket
      onLogout={() => setSession(null)}
      theme={theme}
      setTheme={setTheme}
    />
  );
}