"use client";
import { useState } from "react";

export default function DetailMenu({ show, onClose, onDelete, isOwner, idea, onShowCollaborators }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!show) return null;

  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-hard mx-4 mt-2 p-2 overflow-hidden">
      {!confirmDelete ? (
        <>
          {isOwner && (
            <button
              className="flex items-center gap-3 w-full text-left text-black font-bold text-[calc((13/12)*var(--base-font-size))] px-3 py-2.5 rounded-xl hover:bg-[#CAFF00] transition"
              onClick={() => { onShowCollaborators(); onClose(); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              share with friends
            </button>
          )}
          
          {isOwner && (
            <button
              className="flex items-center gap-3 w-full text-left text-black font-bold text-[calc((13/12)*var(--base-font-size))] px-3 py-2.5 rounded-xl hover:bg-[#FFB3D0] transition mt-1"
              onClick={() => setConfirmDelete(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              flush forever?
            </button>
          )}
        </>
      ) : (
        <div className="flex items-center gap-3 px-3 py-2">
          <button
            className="bg-[#FFB3D0] border-2 border-black text-black font-extrabold text-[calc((13/12)*var(--base-font-size))] px-4 py-1.5 rounded-xl shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
            onClick={onDelete}
          >
            flush
          </button>
          <button
            className="text-black/50 font-bold text-[calc((13/12)*var(--base-font-size))] hover:text-black transition"
            onClick={() => { setConfirmDelete(false); onClose(); }}
          >
            keep it
          </button>
        </div>
      )}
    </div>
  );
}
