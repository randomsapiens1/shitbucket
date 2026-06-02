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

  try {
    const { data, error } = await supabase
      .from("ideas")
      .insert(payload)
      .select(CORE_COLUMNS)
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    const isSchemaError = e.message?.includes("expires_at") || e.message?.includes("pinned") || e.code === "PGRST204";

    if (isSchemaError) {
      const { pinned: _p, expires_at: _e, ...safePayload } = payload;
      const { data: retryData, error: retryError } = await supabase
        .from("ideas")
        .insert(safePayload)
        .select("id, user_id, title, thought, thoughts, tags, links, fields, tasks, created_at, updated_at")
        .single();
      if (retryError) throw retryError;
      return retryData;
    }
    throw e;
  }
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
      const { pinned: _pinned, expires_at: _expires_at, ...safeUpdates } = updates;
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

// ============ UTILS ============

function generateToken() {
  const array = new Uint8Array(24);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(36).padStart(2, '0')).join('').slice(0, 32);
}

// ============ COLLABORATION ============

export async function createCollabInvite(ideaId, ideaTitle) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const token = generateToken();
  const { error } = await supabase
    .from("collab_invites")
    .insert({
      idea_id: ideaId,
      idea_title: ideaTitle,
      inviter_email: user.email,
      inviter_id: user.id,
      token,
    });

  if (error) throw error;
  return token;
}

export async function getCollabInvite(token) {
  const { data, error } = await supabase
    .from("collab_invites")
    .select("idea_id, idea_title, inviter_email, accepted_at, created_at")
    .eq("token", token)
    .single();

  if (error || !data) return null;
  return data;
}

export async function acceptCollabInvite(token) {
  const { error } = await supabase.rpc("accept_collab_invite", { p_token: token });
  if (error) throw error;
}

export async function fetchCollaborators(ideaId) {
  const { data, error } = await supabase
    .from("idea_collaborators")
    .select("user_id, user_email, created_at")
    .eq("idea_id", ideaId);

  if (error) throw error;
  return data || [];
}

export async function removeCollaborator(ideaId, userId) {
  const { error } = await supabase
    .from("idea_collaborators")
    .delete()
    .eq("idea_id", ideaId)
    .eq("user_id", userId);

  if (error) throw error;
}
