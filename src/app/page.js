"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Bucket from "@/components/Bucket";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check session on mount
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("Auth session error:", error.message);
          // If refresh token is invalid, we must clear and logout
          if (error.message.includes("refresh_token") || error.status === 400) {
            localStorage.removeItem("shitbucket-auth");
            router.push("/about");
            return;
          }
        }
        setSession(session);
        setLoading(false);
        if (!session) {
          router.push("/about");
        }
      })
      .catch((err) => {
        console.error("Catastrophic auth error:", err);
        setLoading(false);
        router.push("/about");
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
  }, [mounted, router]);

  const handleLogout = useCallback(() => {
    setSession(null);
    router.push("/about");
  }, [router]);

  if (!mounted || loading) return <LoadingScreen />;

  if (!session) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Bucket onLogout={handleLogout} userId={session?.user?.id} />
    </Suspense>
  );
}
