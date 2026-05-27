"use client";
import { useState } from "react";

export default function DetailMenu({ show, onClose, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!show) return null;

  return (
    <div className="bg-bucket-card border border-bucket-border rounded-xl mx-4 mt-2 p-1 overflow-hidden">
      {!confirmDelete ? (
        <button
          className="block w-full text-left text-bucket-text-dim text-[13px] px-3 py-2.5 rounded-lg hover:bg-bucket-bg transition"
          onClick={() => setConfirmDelete(true)}
        >
          🗑 delete idea
        </button>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="text-red-500 text-[13px]">sure?</span>
          <button
            className="text-red-500 text-[13px] px-2 py-1 hover:underline"
            onClick={onDelete}
          >
            yes, delete
          </button>
          <button
            className="text-bucket-muted text-[13px] px-2 py-1 hover:text-bucket-text-dim"
            onClick={() => { setConfirmDelete(false); onClose(); }}
          >
            cancel
          </button>
        </div>
      )}
    </div>
  );
}
