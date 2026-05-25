import { supabase } from "./supabase";

// ============ IDEAS ============

export async function fetchIdeas() {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createIdea(idea) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("ideas")
    .insert({
      user_id: user.id,
      title: idea.title,
      thought: idea.thought || "",
      thoughts: idea.thoughts || [],
      tags: idea.tags || [],
      links: idea.links || [],
      fields: idea.fields || [],
      tasks: idea.tasks || [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIdea(id, updates) {
  const { data, error } = await supabase
    .from("ideas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
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
  const { data, error } = await supabase
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
