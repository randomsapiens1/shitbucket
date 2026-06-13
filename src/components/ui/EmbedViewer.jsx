"use client";
import { useState, useEffect } from "react";

export default function EmbedViewer({ url, title, onClose }) {
  const [embedUrl, setEmbedUrl] = useState(null);
  const [type, setType] = useState("iframe");

  useEffect(() => {
    if (!url) return;

    // YouTube
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      setEmbedUrl(`https://www.youtube.com/embed/${ytMatch[1]}`);
      setType("video");
      return;
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      setEmbedUrl(`https://player.vimeo.com/video/${vimeoMatch[1]}`);
      setType("video");
      return;
    }

    // Default to iframe for articles/links
    setEmbedUrl(url);
    setType("iframe");
  }, [url]);

  if (!embedUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black shadow-hard-lg w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden rounded-sm">
        
        {/* Title Bar */}
        <div className="bg-black text-white px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-black text-[10px] uppercase tracking-widest whitespace-nowrap opacity-50">Viewing /</span>
            <span className="font-black text-[11px] truncate uppercase tracking-tight">{title || url}</span>
          </div>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:bg-[#FF6A00] transition-colors rounded-sm"
          >
            <span className="font-black text-xl leading-none">×</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#FFF8EE] relative overflow-hidden">
          {type === "video" ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col">
              <iframe
                src={embedUrl}
                className="w-full h-full bg-white"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                title={title || "Article View"}
              />
              {/* Fallback info since many sites block iframes */}
              <div className="absolute bottom-4 right-4 z-10">
                 <a 
                   href={url} 
                   target="_blank" 
                   rel="noreferrer"
                   className="bg-[#FF6A00] text-white px-4 py-2 rounded-xl border-2 border-black font-extrabold shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-xs uppercase"
                 >
                   Open in New Tab ↗
                 </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
