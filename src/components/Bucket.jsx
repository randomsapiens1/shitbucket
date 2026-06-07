"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { fetchIdeas, createIdea, updateIdea as dbUpdateIdea, deleteIdea as dbDeleteIdea } from "@/lib/db";
import { calcBrewProgress } from "@/lib/brew";
import { genId } from "@/lib/utils";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ListView from "@/components/list/ListView";
import DetailView from "@/components/detail/DetailView";
import SettingsView from "@/components/detail/SettingsView";
import { arrayMove } from "@dnd-kit/sortable";

export default function Bucket({ onLogout, userId }) {
  const [ideas,       setIdeas]       = useState([]);
  const [view,        setView]        = useState("list");
  const [activeId,    setActiveId]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [filterTag,   setFilterTag]   = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy,      setSortBy]      = useState("newest");
  const [fontSize,    setFontSize]    = useState(16);
  const sessionStart = useRef(Date.now());

  // 1. Initial Load (SWR)
  useEffect(() => {
    const cached = localStorage.getItem("shitbucket-ideas-cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.length > 0) {
          setIdeas(parsed);
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to parse cache:", e);
      }
    }
    loadIdeas();
  }, []);

  // 2. Cache Persistence
  useEffect(() => {
    if (ideas.length > 0) {
      // Don't cache optimistic items
      const toCache = ideas.filter(i => !i.optimistic);
      localStorage.setItem("shitbucket-ideas-cache", JSON.stringify(toCache));
    }
  }, [ideas]);

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
      }, 500);
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

  // Realtime sync for shared ideas
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("collab-sync")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "ideas" },
        (payload) => {
          if (payload.new && payload.new.user_id !== userId) {
            setIdeas(prev => prev.map(i => i.id === payload.new.id ? payload.new : i));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  async function loadIdeas() {
    setError(null);
    try {
      const data = await fetchIdeas();
      setIdeas(data);
    } catch (e) {
      console.error("Failed to load:", e);
      // If we have cached ideas, don't show a blocking error for network failures
      const isNetworkError = !navigator.onLine || e.message?.includes("fetch") || e.message?.includes("NetworkError");
      if (ideas.length > 0 && isNetworkError) {
        console.warn("Offline or network error, but we have cached ideas. Suppressing error UI.");
      } else {
        setError(e.message || "Failed to load your pile. Check your connection.");
      }
    }
    setLoading(false);
  }

  const activeIdea = ideas.find(i => i.id === activeId);
  const allTags    = [...new Set(ideas.flatMap(i => i.tags || []))];
  const allTopics  = [...new Set(ideas.map(i => i.topic || "General"))];

  const filtered = useMemo(() => {
    return ideas
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
        if (sortBy === "manual") return 0; // Maintain current array order
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        if (sortBy === "newest") return new Date(b.updated_at) - new Date(a.updated_at);
        if (sortBy === "oldest") return new Date(a.updated_at) - new Date(b.updated_at);
        if (sortBy === "brew") return calcBrewProgress(b) - calcBrewProgress(a);
        if (sortBy === "alpha") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [ideas, filterTag, searchQuery, sortBy]);

  async function handleDump(title, tags = [], expiresAt = null, topic = "General") {
    const tempId = genId();
    const optimisticIdea = {
      id: tempId,
      title,
      tags,
      topic,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optimistic: true,
      thought: "",
      thoughts: [],
      links: [],
      fields: [],
      tasks: [],
    };

    setIdeas(prev => [optimisticIdea, ...prev]);

    try {
      const newIdea = await createIdea({ title, tags, expires_at: expiresAt, topic });
      setIdeas(prev => prev.map(i => i.id === tempId ? newIdea : i));
    } catch (e) {
      setIdeas(prev => prev.filter(i => i.id !== tempId));
      console.error("Failed to create:", e.message || e);
      alert("Failed to save idea. Check your connection.");
    }
  }

  const handleUpdateIdea = useCallback(async (id, fn) => {
    setIdeas(prev => {
      const idea = prev.find(i => i.id === id);
      if (!idea) return prev;
      
      const updated = { ...idea };
      fn(updated);
      
      const newIdeas = prev.map(i => i.id === id ? { ...updated, updated_at: new Date().toISOString() } : i);
      
      // Secondary action: DB sync
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
        topic:      updated.topic,
      };

      dbUpdateIdea(id, payload).catch(e => {
        console.error("Failed to update:", e);
        // We don't alert on every keystroke failure, but maybe we should revert on catastrophic failure
        // For simplicity, we keep the optimistic state for now
      });

      return newIdeas;
    });
  }, []);

  const handleDeleteIdea = useCallback(async (id) => {
    setIdeas(prev => {
      const deletedIdea = prev.find(i => i.id === id);
      if (!deletedIdea) return prev;
      
      // Optimistic delete
      const newIdeas = prev.filter(i => i.id !== id);
      
      dbDeleteIdea(id).catch(e => {
        setIdeas(current => [deletedIdea, ...current]);
        console.error("Failed to delete:", e);
        alert("Failed to delete idea. It's back in the pile.");
      });

      return newIdeas;
    });

    if (view === "detail" && activeId === id) {
      setView("list");
      setActiveId(null);
    }
  }, [view, activeId]);

  const handleSelectIdea = useCallback((id) => { 
    setActiveId(id); 
    setView("detail"); 
  }, []);

  const handlePinIdea = useCallback((id, pinned) => {
    handleUpdateIdea(id, (i) => { i.pinned = pinned; });
  }, [handleUpdateIdea]);

  const handleReorderIdeas = useCallback((oldIndex, newIndex) => {
    setIdeas(prev => {
      const newIdeas = arrayMove(prev, oldIndex, newIndex);
      // When reordering, we switch to manual sort implicitly or just maintain this order.
      // For persistence, we might need a 'position' column in the DB, but for now 
      // we just update the local state.
      return newIdeas;
    });
    setSortBy("manual");
  }, []);

  const handleLogoutWithAuth = useCallback(async () => {
    await supabase.auth.signOut();
    onLogout();
  }, [onLogout]);

  if (loading) return <LoadingScreen />;

  if (view === "list") {
    return (
      <ListView
        ideas={ideas}
        filtered={filtered}
        allTags={allTags}
        allTopics={allTopics}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onDump={handleDump}
        onSelectIdea={handleSelectIdea}
        onLogout={handleLogoutWithAuth}
        onUpdateIdea={handleUpdateIdea}
        onPinIdea={handlePinIdea}
        onReorderIdeas={handleReorderIdeas}
        sessionStart={sessionStart.current}
        userId={userId}
        error={error}
        onRetry={loadIdeas}
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
        userId={userId}
      />
    );
  }

  return null;
}
