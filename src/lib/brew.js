export const BREW_STAGES = [
  { min: 0,  label: "raw",      emoji: "★☆☆☆☆" },
  { min: 20, label: "maybe",    emoji: "★★☆☆☆" },
  { min: 45, label: "cooking",  emoji: "★★★☆☆" },
  { min: 70, label: "slaps",    emoji: "★★★★☆" },
  { min: 95, label: "gold",     emoji: "★★★★★" },
];

export const FIELD_TYPES = [
  { key: "text",     label: "Text",   icon: "Aa" },
  { key: "number",   label: "Number", icon: "#"  },
  { key: "checkbox", label: "Check",  icon: "☑"  },
  { key: "link",     label: "Link",   icon: "🔗" },
];

export function getBrewStage(pct) {
  let stage = BREW_STAGES[0];
  for (const s of BREW_STAGES) if (pct >= s.min) stage = s;
  return stage;
}

export function calcBrewProgress(idea) {
  let score = 0;
  if (idea.thought) score += 10;
  score += Math.min((idea.thoughts || []).length * 6, 30);
  if ((idea.tags || []).length > 0) score += 10;
  if ((idea.links || []).length > 0) score += 10;
  
  // Scripts contribution
  const scripts = idea.scripts || [];
  if (scripts.length > 0) score += 10;
  const filledScripts = scripts.filter(s => s.content?.trim()).length;
  if (scripts.length > 0) score += Math.round((filledScripts / scripts.length) * 10);

  const filledFields = (idea.fields || []).filter(f =>
    f.type === "checkbox" ? f.value : f.value?.toString().trim()
  );
  score += Math.min(filledFields.length * 5, 15);
  const tasks = idea.tasks || [];
  if (tasks.length > 0) score += 10;
  const done = tasks.filter(t => t.done).length;
  if (tasks.length > 0) score += Math.round((done / tasks.length) * 15);
  return Math.min(score, 100);
}
