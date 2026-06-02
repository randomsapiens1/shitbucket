"use client";
import { useState, useEffect } from "react";
import { fetchCollaborators, createCollabInvite, removeCollaborator } from "@/lib/db";

export default function CollaboratorsSection({ idea }) {
  const [collaborators, setCollaborators] = useState([]);
  const [inviteLink,    setInviteLink]    = useState("");
  const [generating,    setGenerating]    = useState(false);
  const [copied,        setCopied]        = useState(false);

  useEffect(() => {
    if (!idea?.id) return;
    fetchCollaborators(idea.id).then(setCollaborators).catch(() => {});
  }, [idea?.id]);

  async function handleGenerateLink() {
    setGenerating(true);
    try {
      const token = await createCollabInvite(idea.id, idea.title);
      setInviteLink(`${window.location.origin}/invite/${token}`);
    } catch (e) {
      console.error("Failed to create invite:", e);
    }
    setGenerating(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRemove(userId) {
    try {
      await removeCollaborator(idea.id, userId);
      setCollaborators(prev => prev.filter(c => c.user_id !== userId));
    } catch (e) {
      console.error("Failed to remove collaborator:", e);
    }
  }

  return (
    <div className="mb-5">
      <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.15em] text-black mb-2">friends</p>
      <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4">

        {collaborators.length > 0 && (
          <div className="mb-3 space-y-2">
            {collaborators.map(c => (
              <div key={c.user_id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-[calc((10/12)*var(--base-font-size))] font-extrabold shrink-0">
                    {(c.user_email || "?")[0].toUpperCase()}
                  </div>
                  <span className="text-[calc((12/12)*var(--base-font-size))] font-bold text-black">{c.user_email}</span>
                </div>
                <button
                  onClick={() => handleRemove(c.user_id)}
                  className="text-black/30 hover:text-black text-[calc((18/12)*var(--base-font-size))] leading-none transition font-bold"
                  title="remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {collaborators.length === 0 && !inviteLink && (
          <p className="text-[calc((12/12)*var(--base-font-size))] font-bold text-black/30 mb-3">no friends yet</p>
        )}

        {!inviteLink ? (
          <button
            onClick={handleGenerateLink}
            disabled={generating}
            className="w-full text-[calc((12/12)*var(--base-font-size))] font-extrabold border-2 border-black rounded-xl px-3 py-2.5 shadow-hard-sm bg-[#FFF8EE] transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] disabled:opacity-40"
          >
            {generating ? "generating..." : "👥 invite a friend"}
          </button>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                readOnly
                value={inviteLink}
                className="flex-1 min-w-0 bg-[#FFF8EE] border-2 border-black rounded-xl px-3 py-2 text-[calc((11/12)*var(--base-font-size))] font-bold text-black/60 outline-none"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 text-[calc((12/12)*var(--base-font-size))] font-extrabold border-2 border-black rounded-xl px-3 py-2 shadow-hard-sm bg-white transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
              >
                {copied ? "✓" : "copy"}
              </button>
            </div>
            <p className="text-[calc((10/12)*var(--base-font-size))] text-black/30 font-bold mt-1.5">send to your friend — single use</p>
            <button
              onClick={() => setInviteLink("")}
              className="mt-2 text-[calc((11/12)*var(--base-font-size))] font-extrabold border-2 border-black rounded-xl px-3 py-1.5 shadow-hard-sm bg-[#FFF8EE] transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
            >
              + new link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
