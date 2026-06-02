"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsView({ onBack, fontSize, setFontSize }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <div className="min-h-screen bg-bucket-bg text-bucket-text pb-24 relative max-w-xl mx-auto px-4 pt-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-bucket-card border border-bucket-border text-bucket-text-dim hover:text-bucket-text transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section>
          <h2 className="text-[calc((13/12)*var(--base-font-size))] font-bold text-bucket-text-dim uppercase tracking-widest mb-4">Profile</h2>
          <div className="bg-bucket-card border border-bucket-border rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-bucket-accent flex items-center justify-center text-black font-bold text-xl">
                {user?.email?.[0].toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-[calc((15/12)*var(--base-font-size))] font-semibold">{user?.email}</p>
                <p className="text-[calc((12/12)*var(--base-font-size))] text-bucket-text-dim">Your dumping ground account</p>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section>
          <h2 className="text-[calc((13/12)*var(--base-font-size))] font-bold text-bucket-text-dim uppercase tracking-widest mb-4">Appearance</h2>
          <div className="bg-bucket-card border border-bucket-border rounded-2xl p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[calc((14/12)*var(--base-font-size))] font-medium">Font Size</span>
                <span className="text-[calc((14/12)*var(--base-font-size))] font-bold text-bucket-accent">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-bucket-border rounded-lg appearance-none cursor-pointer accent-bucket-accent"
              />
              <div className="flex justify-between mt-2 text-[calc((10/12)*var(--base-font-size))] text-bucket-text-dim font-bold uppercase tracking-tighter">
                <span>Tiny</span>
                <span>Normal</span>
                <span>Huge</span>
              </div>
            </div>
          </div>
        </section>

        <p className="text-center text-[calc((11/12)*var(--base-font-size))] text-bucket-text-dim pt-8">
          shitbucket v1.0.0<br/>
          made for the dumpers
        </p>
      </div>
    </div>
  );
}
