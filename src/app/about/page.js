"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const FeatureCard = ({ title, description, status = "active" }) => (
  <div className={`p-5 rounded-2xl border-2 border-black bg-white ${status === "coming" ? "opacity-60" : "shadow-hard"} flex flex-col gap-2`}>
    <div className="flex justify-between items-start">
      <h3 className="text-[calc((18/12)*var(--base-font-size))] font-extrabold uppercase tracking-tight leading-none">{title}</h3>
      {status === "coming" && (
        <span className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase bg-black text-white px-2 py-0.5 rounded-full">Coming</span>
      )}
    </div>
    <p className="text-[calc((13/12)*var(--base-font-size))] font-bold leading-relaxed opacity-70">{description}</p>
  </div>
);

const StepCard = ({ number, title, text }) => (
  <div className="flex gap-4 items-start">
    <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0 font-extrabold bg-[#FF6A00] text-black shadow-hard-sm">
      {number}
    </div>
    <div>
      <h4 className="text-[calc((14/12)*var(--base-font-size))] font-extrabold uppercase mb-1">{title}</h4>
      <p className="text-[calc((12/12)*var(--base-font-size))] font-bold opacity-60 leading-normal">{text}</p>
    </div>
  </div>
);

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-black selection:bg-[#FF6A00] selection:text-white">
      {/* Hero Section */}
      <section className="px-4 pt-16 pb-12 flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="bg-black text-[#FFF8EE] px-4 py-2 rounded-xl mb-6 shadow-hard rotate-[-2deg]">
          <span className="text-[calc((12/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.2em]">Open Source</span>
        </div>
        
        <img 
          src="/shitBucket-day.png" 
          alt="ShitBucket" 
          className="w-full max-w-[400px] h-auto mb-6 object-contain"
        />
        
        <p className="text-[calc((18/12)*var(--base-font-size))] md:text-[calc((22/12)*var(--base-font-size))] font-extrabold leading-tight mb-10 max-w-sm">
          Dump your raw ideas.<br/>Brew them into gold.
        </p>

        <Link href="/" className="group relative">
          <div className="absolute inset-0 bg-black rounded-2xl translate-x-[4px] translate-y-[4px] transition-transform group-active:translate-x-0 group-active:translate-y-0" />
          <div className="relative bg-[#FF6A00] text-black border-2 border-black px-8 py-4 rounded-2xl text-[calc((20/12)*var(--base-font-size))] font-extrabold uppercase tracking-tight group-active:translate-x-[4px] group-active:translate-y-[4px] transition-transform">
            Launch App →
          </div>
        </Link>
        
        <p className="mt-6 text-[calc((11/12)*var(--base-font-size))] font-bold opacity-40 uppercase tracking-widest">
          Mobile-first • Offline-ready • 100% Private
        </p>
      </section>

      {/* Philosophy Section */}
      <section className="px-4 py-12 bg-white border-y-4 border-black">
        <div className="max-w-xl mx-auto">
          <h2 className="text-[calc((28/12)*var(--base-font-size))] font-extrabold uppercase tracking-tight mb-8">The Philosophy</h2>
          <div className="grid gap-6">
            <div className="p-6 border-2 border-black rounded-3xl bg-[#FFF8EE] shadow-hard">
              <span className="text-[calc((32/12)*var(--base-font-size))] mb-2 block">1. Dump</span>
              <p className="font-bold opacity-70">Capture raw, messy thoughts in under 5 seconds. Don&apos;t worry about quality. Just get it out.</p>
            </div>
            <div className="p-6 border-2 border-black rounded-3xl bg-[#FFF8EE] shadow-hard">
              <span className="text-[calc((32/12)*var(--base-font-size))] mb-2 block">2. Brew</span>
              <p className="font-bold opacity-70">Let ideas sit. Add thoughts, links, and tasks. Watch the &quot;Brew Progress&quot; bar move.</p>
            </div>
            <div className="p-6 border-2 border-black rounded-3xl bg-[#FF6A00] shadow-hard">
              <span className="text-[calc((32/12)*var(--base-font-size))] mb-2 block">3. Gold</span>
              <p className="font-bold text-black">Iterate until your idea slaps. From raw coal to pure gold.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Section */}
      <section className="px-4 py-16 max-w-xl mx-auto">
        <h2 className="text-[calc((28/12)*var(--base-font-size))] font-extrabold uppercase tracking-tight mb-8">Add to Home Screen</h2>
        <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-hard flex flex-col gap-8">
          <div>
            <h3 className="text-[calc((12/12)*var(--base-font-size))] font-extrabold uppercase text-[#FF6A00] mb-4 tracking-widest">iOS / Safari</h3>
            <div className="space-y-4">
              <StepCard number="1" title="Tap Share" text='Click the "Share" icon at the bottom of Safari.' />
              <StepCard number="2" title="Scroll Down" text='Find and tap "Add to Home Screen".' />
              <StepCard number="3" title="Confirm" text='Tap "Add" in the top right corner.' />
            </div>
          </div>
          
          <div className="h-[2px] bg-black opacity-10" />

          <div>
            <h3 className="text-[calc((12/12)*var(--base-font-size))] font-extrabold uppercase text-[#FF6A00] mb-4 tracking-widest">Android / Chrome</h3>
            <div className="space-y-4">
              <StepCard number="1" title="Tap Menu" text="Click the three dots (⋮) in the top right." />
              <StepCard number="2" title="Install App" text='Select "Install app" or "Add to Home screen".' />
              <StepCard number="3" title="Confirm" text='Tap "Install" in the pop-up.' />
            </div>
          </div>
        </div>
      </section>

      {/* Features & Roadmap */}
      <section className="px-4 py-16 bg-black text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[calc((28/12)*var(--base-font-size))] font-extrabold uppercase tracking-tight mb-12 text-[#FF6A00]">The Refinery</h2>
          
          <div className="grid md:grid-cols-2 gap-4 text-black">
            <FeatureCard title="Quick Dump" description="500-character limit to keep things concise and fast." />
            <FeatureCard title="Brew Progress" description="Score-based tracking from Raw to Gold." />
            <FeatureCard title="PWA Support" description="Offline-first. Access your bucket anywhere." />
            <FeatureCard title="Custom Fields" description="Add metadata: links, numbers, and checklists." />
            
            <FeatureCard status="coming" title="AI Refining" description="Automated idea expansion and task generation." />
            <FeatureCard status="coming" title="Desktop App" description="Native Mac and Windows versions via Electron." />
            <FeatureCard status="coming" title="Collab Mode" description="Real-time shared buckets for teams." />
            <FeatureCard status="coming" title="Brew History" description="Visual timeline of how your idea evolved." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 text-center">
        <p className="text-[calc((13/12)*var(--base-font-size))] font-extrabold uppercase tracking-widest mb-4 opacity-40">
          ShitBucket v1.0 • Built with 🧡
        </p>
        <div className="flex justify-center gap-6">
          <a href="https://github.com/randomsapiens1/shitbucket" className="text-[calc((12/12)*var(--base-font-size))] font-bold hover:text-[#FF6A00] transition">GitHub</a>
          <a href="mailto:rajkumaryhere@gmail.com" className="text-[calc((12/12)*var(--base-font-size))] font-bold hover:text-[#FF6A00] transition">Contact</a>
        </div>
      </footer>
    </div>
  );
}
