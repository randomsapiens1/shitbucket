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
