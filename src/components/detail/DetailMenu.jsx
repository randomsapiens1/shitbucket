"use client";
import { useState } from "react";

export default function DetailMenu({ show, onClose, onDelete, onInvite, isOwner }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!show) return null;

  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-hard mx-4 mt-2 p-2 overflow-hidden">
      {!confirmDelete ? (
        <>
          {isOwner && (
            <button
              className="block w-full text-left text-black font-bold text-[13px] px-3 py-2.5 rounded-xl hover:bg-[#FFF8EE] transition"
              onClick={() => { onInvite(); onClose(); }}
            >
              👥 invite teammate
            </button>
          )}
          {isOwner && (
            <button
              className="block w-full text-left text-black font-bold text-[13px] px-3 py-2.5 rounded-xl hover:bg-[#FFB3D0] transition"
              onClick={() => setConfirmDelete(true)}
            >
              🗑 flush forever?
            </button>
          )}
        </>
      ) : (
        <div className="flex items-center gap-3 px-3 py-2">
          <button
            className="bg-[#FFB3D0] border-2 border-black text-black font-extrabold text-[13px] px-4 py-1.5 rounded-xl shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
            onClick={onDelete}
          >
            flush
          </button>
          <button
            className="text-black/50 font-bold text-[13px] hover:text-black transition"
            onClick={() => { setConfirmDelete(false); onClose(); }}
          >
            keep it
          </button>
        </div>
      )}
    </div>
  );
}
