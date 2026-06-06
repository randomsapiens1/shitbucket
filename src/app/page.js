"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Bucket from "@/components/Bucket";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        router.push("/about");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === "SIGNED_IN") {
          setLoading(false);
        } else if (event === "SIGNED_OUT") {
          router.push("/about");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = useCallback(() => {
    setSession(null);
    router.push("/about");
  }, [router]);

  if (loading) return <LoadingScreen />;
  
  if (!session) {
    return <LoadingScreen />;
  }

  return <Bucket onLogout={handleLogout} userId={session?.user?.id} />;
}
