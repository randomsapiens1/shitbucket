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
      <section className="px-[6px] min-h-screen flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-10 relative">
        <div className="bg-black text-[#FFF8EE] px-4 py-2 rounded-xl mb-8 shadow-hard rotate-[-2deg] border-2 border-black">
          <span className="text-[calc((12/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.2em]">Mobile First</span>
        </div>
        
        <img 
          src="/shitBucket-day.png" 
          alt="ShitBucket" 
          className="w-full max-w-[180px] h-auto mb-4 object-contain"
        />

        <h1 className="w-full text-[45px] font-black leading-[0.9] mb-6 tracking-tighter uppercase">
          Dump Your Raw <br className="md:hidden" /> Thoughts.
        </h1>
        
        <p className="w-full text-[calc((14/12)*var(--base-font-size))] font-bold leading-tight mb-8 opacity-70 px-[4px]">
          Made for ideas that deserve more than a notes app, but less than Notion.
        </p>

        <div className="flex flex-col w-full gap-4 px-8 sm:flex-row sm:justify-center sm:px-0 mb-12">
          <Link href="/" className="group relative">
            <div className="absolute inset-0 bg-black rounded-2xl translate-x-[3px] translate-y-[3px] transition-transform group-active:translate-x-0 group-active:translate-y-0" />
            <div className="relative bg-[#FF6A00] text-black border-2 border-black px-6 py-3 rounded-2xl text-[calc((15/12)*var(--base-font-size))] font-extrabold uppercase tracking-tight group-active:translate-x-[3px] group-active:translate-y-[3px] transition-transform flex items-center justify-center">
              Start dumping →
            </div>
          </Link>

          <button 
            onClick={() => document.getElementById('install')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative"
          >
            <div className="absolute inset-0 bg-black rounded-2xl translate-x-[3px] translate-y-[3px] transition-transform group-active:translate-x-0 group-active:translate-y-0" />
            <div className="relative bg-white text-black border-2 border-black px-6 py-3 rounded-2xl text-[calc((15/12)*var(--base-font-size))] font-extrabold uppercase tracking-tight group-active:translate-x-[3px] group-active:translate-y-[3px] transition-transform flex items-center justify-center">
              See how to install ↓
            </div>
          </button>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0">
          <p className="text-[calc((11/12)*var(--base-font-size))] font-bold opacity-30 uppercase tracking-widest">
            Offline-ready • 100% Private
          </p>
        </div>
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
      <section id="install" className="px-4 py-16 max-w-xl mx-auto">
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
