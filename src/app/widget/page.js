"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LoadingScreen from "@/components/ui/LoadingScreen";
import WidgetView from "./WidgetView";

export default function WidgetPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        router.push("/about");
      }
    });

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

  if (!mounted || loading) return <LoadingScreen />;
  if (!session) return <LoadingScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <WidgetView userId={session?.user?.id} />
    </Suspense>
  );
}
