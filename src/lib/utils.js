const CARD_COLORS = [
  { bg: "var(--card-lime)",   text: "#0A0A0A" },
  { bg: "var(--card-pink)",   text: "#0A0A0A" },
  { bg: "var(--card-blue)",   text: "#0A0A0A" },
  { bg: "var(--card-yellow)", text: "#0A0A0A" },
];

export function cardColor(id) {
  const hash = (id || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CARD_COLORS[hash % CARD_COLORS.length];
}

export const TAG_COLORS = [
  "#ff6a00", "#ff3d00", "#ffab00", "#ff6d3a", "#e85d04",
  "#ff8800", "#d45500", "#ffcc02", "#ff4400", "#c75000",
  "#00cc88", "#00b4d8", "#7b2cbf", "#ef476f", "#06d6a0",
  "#ffd166", "#118ab2", "#073b4c", "#9d4edd", "#5a189a",
];

export function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return TAG_COLORS[Math.abs(h) % TAG_COLORS.length];
}

export function formatCountdown(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = d - now;
  if (diff <= 0) return "expired";
  
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (h > 48) return `expires in ${Math.floor(h / 24)}d`;
  if (h > 0) return `expires in ${h}h`;
  return `expires in ${m}m`;
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function timeAgo(ts) {
  const d = typeof ts === "string" ? new Date(ts) : new Date(ts);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString();
}

export function extractLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

export function isVideoLink(url) {
  return (
    url.includes("youtube.com") || 
    url.includes("youtu.be") || 
    url.includes("vimeo.com")
  );
}

export function getThumbnail(url) {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
  }

  return null;
}

export async function fetchYoutubeTitle(url) {
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!ytMatch) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`https://www.youtube.com/oEmbed?url=${encodeURIComponent(url)}&format=json`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    return data.title || null;
  } catch (err) {
    // If fetch fails (CORS, network, timeout), just return null
    return null;
  }
}

export function getFriendlyName(url) {
  try {
    const uri = new URL(url);
    if (uri.hostname.includes("youtube.com") || uri.hostname.includes("youtu.be")) return "YouTube";
    if (uri.hostname.includes("vimeo.com")) return "Vimeo";
    const domain = uri.hostname.replace("www.", "");
    return domain.split('.')[0].toUpperCase();
  } catch (e) {
    return "Link";
  }
}

export function copyToClipboard(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).catch(err => {
    console.error("Could not copy text: ", err);
  });
}



