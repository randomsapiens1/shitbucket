import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// During `next build`, pages are prerendered on the server where env vars may
// not be present. The app only calls Supabase in the browser (all pages are
// "use client"), so this is safe — missing vars at build time won't break
// the compiled output.
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== "undefined") {
    throw new Error("Missing Supabase env vars. Check .env.local");
  }
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    persistSession: true,
    storageKey: "shitbucket-auth",
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});