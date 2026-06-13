"use client";
import { useState, useEffect } from "react";
import Section from "@/components/ui/Section";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import EmbedViewer from "@/components/ui/EmbedViewer";
import { isVideoLink, getThumbnail, copyToClipboard, fetchYoutubeTitle, getFriendlyName } from "@/lib/utils";

function SortableLink({ l, onRemove, onOpenEmbed }) {
  const [copied, setCopied] = useState(false);
  const [dynamicTitle, setDynamicTitle] = useState(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: l.id });

  const isVideo = isVideoLink(l.url);
  const thumb = getThumbnail(l.url);
  
  // If label is missing or just the URL, we try to use dynamicTitle
  const isLabelURL = !l.label || l.label.startsWith("http");
  const displayTitle = (!isLabelURL) ? l.label : (dynamicTitle || getFriendlyName(l.url));

  useEffect(() => {
    if (isVideo && isLabelURL) {
      fetchYoutubeTitle(l.url).then(title => {
        if (title) setDynamicTitle(title);
      });
    }
  }, [l.url, isVideo, isLabelURL]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  function handleCopy() {
    copyToClipboard(l.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col py-3 border-b border-black/10 last:border-0 bg-white group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing text-black/20 hover:text-black transition-colors px-1"
            title="Drag to reorder"
          >
            <svg width="10" height="15" viewBox="0 0 10 15" fill="currentColor">
              <circle cx="2" cy="2.5" r="1.2" /><circle cx="2" cy="7.5" r="1.2" /><circle cx="2" cy="12.5" r="1.2" />
              <circle cx="8" cy="2.5" r="1.2" /><circle cx="8" cy="7.5" r="1.2" /><circle cx="8" cy="12.5" r="1.2" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div
              className="text-black text-[calc((13/12)*var(--base-font-size))] font-extrabold leading-tight break-words"
            >
              {displayTitle}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button 
            onClick={handleCopy}
            className="bg-black/5 hover:bg-black hover:text-white p-1.5 rounded-lg transition-all"
            title="Copy Link"
          >
            {copied ? <span className="text-[9px] font-black uppercase px-1">✓</span> : <span className="text-xs">📋</span>}
          </button>
          <button 
            onClick={() => onOpenEmbed(l.url, displayTitle)}
            className="bg-black text-white text-[9px] font-black uppercase px-2 py-2 rounded-lg hover:bg-[#FF6A00] transition-colors shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {isVideo ? "▶ play" : "👁 view"}
          </button>
          <button onClick={() => onRemove(l.id)} className="text-black/30 hover:text-black text-base px-1 ml-1 transition font-bold shrink-0">×</button>
        </div>
      </div>

      {thumb && (
        <div className="ml-7 mr-2">
          <button
            onClick={() => onOpenEmbed(l.url, displayTitle)}
            className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-black shadow-hard-sm hover:shadow-hard hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
          >
            <img src={thumb} alt={displayTitle} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
               <div className="bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center border-2 border-black">
                 <span className="text-black text-sm ml-0.5">▶</span>
               </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default function LinksSection({ links, onAdd, onRemove, onReorder }) {
  const [show,  setShow]  = useState(false);
  const [url,   setUrl]   = useState("");
  const [label, setLabel] = useState("");
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [activeEmbed, setActiveEmbed] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleAdd() {
    if (!url.trim()) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = "https://" + finalUrl;

    let finalLabel = label.trim();

    // Auto-fetch title if no label provided and it's a YouTube link
    if (!finalLabel && isVideoLink(finalUrl)) {
      setLoadingTitle(true);
      try {
        const title = await fetchYoutubeTitle(finalUrl);
        if (title) finalLabel = title;
      } catch (e) {
        // Silently fail
      } finally {
        setLoadingTitle(false);
      }
    }

    onAdd({ url: finalUrl, label: finalLabel });
    setUrl(""); setLabel(""); setShow(false);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  }

  return (
    <Section label="links & inspo">
      {activeEmbed && (
        <EmbedViewer 
          url={activeEmbed.url} 
          title={activeEmbed.title} 
          onClose={() => setActiveEmbed(null)} 
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={links || []} strategy={verticalListSortingStrategy}>
          {(links || []).map(l => (
            <SortableLink 
              key={l.id} 
              l={l} 
              onRemove={onRemove} 
              onOpenEmbed={(url, title) => setActiveEmbed({ url, title })}
            />
          ))}
        </SortableContext>
      </DndContext>

      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="w-full border-2 border-dashed border-black/20 hover:border-black rounded-xl py-3 text-black/40 hover:text-black font-extrabold text-[calc((12/12)*var(--base-font-size))] mt-2 transition"
        >
          + add link
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-3">
          <input
            className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((13/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
            placeholder="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-xl px-3 py-2.5 text-black font-bold text-[calc((13/12)*var(--base-font-size))] outline-none transition placeholder:text-black/30"
            placeholder={loadingTitle ? "fetching title..." : "label (optional)"}
            value={label}
            disabled={loadingTitle}
            onChange={(e) => setLabel(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={loadingTitle}
              className="bg-black text-white border-2 border-black rounded-xl px-4 py-2 text-[calc((12/12)*var(--base-font-size))] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white disabled:opacity-50"
            >
              {loadingTitle ? "..." : "add"}
            </button>
            <button onClick={() => setShow(false)} className="text-black/40 text-[calc((12/12)*var(--base-font-size))] font-bold hover:text-black transition">cancel</button>
          </div>
        </div>
      )}
    </Section>
  );
}
