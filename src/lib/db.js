import { supabase } from "./supabase";

const OPTIONAL_COLUMNS = ["pinned", "expires_at", "topic", "template_data"];
const CORE_COLUMNS = `id, user_id, title, thought, thoughts, tags, links, fields, tasks, created_at, updated_at, ${OPTIONAL_COLUMNS.join(", ")}`;

function isSchemaError(e) {
  return e.code === "PGRST204" || OPTIONAL_COLUMNS.some(c => e.message?.includes(c));
}

// Only the specific columns named in the error are unsupported by this DB - keep the rest.
function missingColumns(e) {
  return OPTIONAL_COLUMNS.filter(c => e.message?.includes(c));
}

export async function fetchIdeas() {
  try {
    const { data, error } = await supabase
      .from("ideas")
      .select(CORE_COLUMNS)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (e) {
    if (isSchemaError(e)) {
      const missing = new Set(missingColumns(e));
      const fallbackColumns = ["id, user_id, title, thought, thoughts, tags, links, fields, tasks, created_at, updated_at", ...OPTIONAL_COLUMNS.filter(c => !missing.has(c))].join(", ");
      console.warn(`Schema mismatch (missing: ${[...missing].join(", ") || "unknown"}), retrying without those columns.`);
      const { data, error } = await supabase
        .from("ideas")
        .select(fallbackColumns)
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
    topic: idea.topic || "General",
    template_data: idea.template_data || {},
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
    if (isSchemaError(e)) {
      const missing = new Set(missingColumns(e));
      const safePayload = Object.fromEntries(Object.entries(payload).filter(([k]) => !missing.has(k)));
      const retryColumns = ["id, user_id, title, thought, thoughts, tags, links, fields, tasks, created_at, updated_at", ...OPTIONAL_COLUMNS.filter(c => !missing.has(c))].join(", ");
      const { data: retryData, error: retryError } = await supabase
        .from("ideas")
        .insert(safePayload)
        .select(retryColumns)
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
    if (isSchemaError(e)) {
      const missing = new Set(missingColumns(e));
      const safeUpdates = Object.fromEntries(Object.entries(updates).filter(([k]) => !missing.has(k)));
      const retryColumns = ["id, user_id, title, thought, thoughts, tags, links, fields, tasks, created_at, updated_at", ...OPTIONAL_COLUMNS.filter(c => !missing.has(c))].join(", ");
      const { data: retryData, error: retryError } = await supabase
        .from("ideas")
        .update(safeUpdates)
        .eq("id", id)
        .select(retryColumns)
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
  const { data, error } = await supabase.rpc("get_invite_by_token", { p_token: token });

  if (error || !data || data.length === 0) return null;
  return data[0];
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
