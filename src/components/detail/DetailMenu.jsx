"use client";
import { useState } from "react";

export default function DetailMenu({ show, onClose, onDelete, isOwner }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!show) return null;

  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-hard mx-4 mt-2 p-2 overflow-hidden">
      {!confirmDelete ? (
        <>
          {isOwner && (
            <button
              className="block w-full text-left text-black font-bold text-[calc((13/12)*var(--base-font-size))] px-3 py-2.5 rounded-xl hover:bg-[#FFB3D0] transition"
              onClick={() => setConfirmDelete(true)}
            >
              🗑 flush forever?
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
