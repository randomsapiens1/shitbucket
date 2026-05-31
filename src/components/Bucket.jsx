"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { fetchIdeas, createIdea, updateIdea as dbUpdateIdea, deleteIdea as dbDeleteIdea, createShareLink } from "@/lib/db";
import { calcBrewProgress } from "@/lib/brew";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ListView from "@/components/list/ListView";
import DetailView from "@/components/detail/DetailView";
import SettingsView from "@/components/detail/SettingsView";

export default function Bucket({ onLogout }) {
  const [ideas,       setIdeas]       = useState([]);
  const [view,        setView]        = useState("list");
  const [activeId,    setActiveId]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [filterTag,   setFilterTag]   = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy,      setSortBy]      = useState("newest");
  const [fontSize,    setFontSize]    = useState(16);
  const sessionStart = useRef(Date.now());

  useEffect(() => { loadIdeas(); }, []);

  // Cleanup expired ideas on load
  useEffect(() => {
    if (ideas.length === 0) return;
    const now     = new Date();
    const expired = ideas.filter(i => i.expires_at && new Date(i.expires_at) <= now);
    if (expired.length > 0) {
      const ids = expired.map(i => i.id);
      const timer = setTimeout(async () => {
        for (const id of ids) {
          try { await dbDeleteIdea(id); } catch (e) { console.error("Auto-delete failed:", id, e); }
        }
        setIdeas(prev => prev.filter(i => !ids.includes(i.id)));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [ideas.length]);

  // Sync font size with localStorage and DOM
  useEffect(() => {
    const savedSize = parseInt(localStorage.getItem("shitbucket-font-size") || "16");
    setFontSize(savedSize);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--base-font-size", `${fontSize}px`);
    localStorage.setItem("shitbucket-font-size", fontSize.toString());
  }, [fontSize]);

  async function loadIdeas() {
    try {
      const data = await fetchIdeas();
      setIdeas(data);
    } catch (e) {
      console.error("Failed to load:", e);
    }
    setLoading(false);
  }

  const activeIdea = ideas.find(i => i.id === activeId);
  const allTags    = [...new Set(ideas.flatMap(i => i.tags || []))];

  const filtered = ideas
    .filter(i => !filterTag || (i.tags || []).includes(filterTag))
    .filter(i => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        (i.thought || "").toLowerCase().includes(q) ||
        (i.tags || []).some(t => t.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortBy === "newest") return new Date(b.updated_at) - new Date(a.updated_at);
      if (sortBy === "oldest") return new Date(a.updated_at) - new Date(b.updated_at);
      if (sortBy === "brew")   return calcBrewProgress(b) - calcBrewProgress(a);
      if (sortBy === "alpha")  return a.title.localeCompare(b.title);
      return 0;
    });

  async function handleDump(title, tags = [], expiresAt = null) {
    try {
      const newIdea = await createIdea({ title, tags, expires_at: expiresAt });
      setIdeas(prev => [newIdea, ...prev]);
    } catch (e) {
      console.error("Failed to create:", e.message || e);
    }
  }

  async function handleUpdateIdea(id, fn) {
    const idea = ideas.find(i => i.id === id);
    if (!idea) return;
    const updated = { ...idea };
    fn(updated);
    const payload = {
      title:      updated.title,
      thought:    updated.thought,
      thoughts:   updated.thoughts,
      tags:       updated.tags,
      links:      updated.links,
      fields:     updated.fields,
      tasks:      updated.tasks,
      pinned:     updated.pinned,
      expires_at: updated.expires_at,
    };
    try {
      const result = await dbUpdateIdea(id, payload);
      setIdeas(prev => prev.map(i => i.id === id ? result : i));
    } catch (e) {
      console.error("Failed to update:", e);
    }
  }

  async function handleDeleteIdea(id) {
    try {
      await dbDeleteIdea(id);
      setIdeas(prev => prev.filter(i => i.id !== id));
      setView("list");
      setActiveId(null);
    } catch (e) {
      console.error("Failed to delete:", e);
    }
  }

  async function handleShareIdea(idea) {
    try {
      const token = await createShareLink(idea.id);
      const url   = `${window.location.origin}/s/${token}`;
      if (navigator.share) {
        navigator.share({ title: idea.title, url }).catch(() => {
          navigator.clipboard.writeText(url);
          alert("Link copied!");
        });
      } else {
        navigator.clipboard.writeText(url);
        alert("Share link copied!");
      }
    } catch (e) {
      let text = `💡 ${idea.title}\n`;
      if (idea.thought) text += `\n${idea.thought}\n`;
      text += `\n— dumped from shitbucket`;
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  if (loading) return <LoadingScreen />;

  if (view === "list") {
    return (
      <ListView
        ideas={ideas}
        filtered={filtered}
        allTags={allTags}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onDump={handleDump}
        onSelectIdea={(id) => { setActiveId(id); setView("detail"); }}
        onLogout={handleLogout}
        onUpdateIdea={handleUpdateIdea}
        sessionStart={sessionStart.current}
      />
    );
  }

  if (view === "settings") {
    return (
      <SettingsView
        fontSize={fontSize}
        setFontSize={setFontSize}
        onBack={() => setView("list")}
      />
    );
  }

  if (view === "detail" && activeIdea) {
    return (
      <DetailView
        idea={activeIdea}
        allTags={allTags}
        onBack={() => { setView("list"); setActiveId(null); }}
        onUpdate={(fn) => handleUpdateIdea(activeId, fn)}
        onDelete={() => handleDeleteIdea(activeId)}
        onShare={() => handleShareIdea(activeIdea)}
      />
    );
  }

  return null;
}
