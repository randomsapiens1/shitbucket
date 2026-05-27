import { supabase } from "./supabase";

const CORE_COLUMNS = "id, user_id, title, thought, thoughts, tags, links, fields, tasks, pinned, expires_at, created_at, updated_at";

export async function fetchIdeas() {
  try {
    const { data, error } = await supabase
      .from("ideas")
      .select(CORE_COLUMNS)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (e) {
    const isSchemaError = e.message?.includes("expires_at") || e.message?.includes("pinned") || e.code === "PGRST204";
    
    if (isSchemaError) {
      console.warn("Schema mismatch, using base columns.");
      const { data, error } = await supabase
        .from("ideas")
        .select("id, user_id, title, thought, thoughts, tags, links, fields, tasks, created_at, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    }
    throw e;
  }
}

export async function createIdea(idea) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const payload = {
    user_id: user.id,
    title: idea.title,
    thought: idea.thought || "",
    thoughts: idea.thoughts || [],
    tags: idea.tags || [],
    links: idea.links || [],
    fields: idea.fields || [],
    tasks: idea.tasks || [],
  };

  // Only send these if they are truthy to avoid schema errors on old databases
  if (idea.pinned) payload.pinned = true;
  if (idea.expires_at) payload.expires_at = idea.expires_at;

  const { data, error } = await supabase
    .from("ideas")
    .insert(payload)
    .select(CORE_COLUMNS)
    .single();

  if (error) {
    if (error.message?.includes("expires_at") || error.message?.includes("pinned")) {
      throw new Error("SCHEMA_MISSING: Please run the SQL command provided in the chat to enable Pinned/Expiring ideas.");
    }
    throw error;
  }
  return data;
}

export async function updateIdea(id, updates) {
  try {
    const { data, error } = await supabase
      .from("ideas")
      .update(updates)
      .eq("id", id)
      .select(CORE_COLUMNS)
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    const isSchemaError = e.message?.includes("expires_at") || e.message?.includes("pinned") || e.code === "PGRST204";
    
    if (isSchemaError) {
      const { pinned, expires_at, ...safeUpdates } = updates;
      const { data: retryData, error: retryError } = await supabase
        .from("ideas")
        .update(safeUpdates)
        .eq("id", id)
        .select("id, user_id, title, thought, thoughts, tags, links, fields, tasks, created_at, updated_at")
        .single();
      if (retryError) throw retryError;
      return retryData;
    }
    throw e;
  }
}

export async function deleteIdea(id) {
  const { error } = await supabase.from("ideas").delete().eq("id", id);
  if (error) throw error;
}

// ============ SHARING ============

function generateToken() {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)
  );
}

export async function createShareLink(ideaId) {
  const token = generateToken();
  const { data: _data, error } = await supabase
    .from("shared_links")
    .insert({ idea_id: ideaId, token })
    .select()
    .single();

  if (error) throw error;
  return token;
}

export async function getSharedIdea(token) {
  // First get the shared link
  const { data: link, error: linkError } = await supabase
    .from("shared_links")
    .select("idea_id")
    .eq("token", token)
    .single();

  if (linkError || !link) return null;

  // Then fetch the idea (bypasses RLS via the public read policy on shared_links)
  // We need a separate approach: use a Supabase function or fetch directly
  const { data: idea, error: ideaError } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", link.idea_id)
    .single();

  if (ideaError) return null;
  return idea;
}
