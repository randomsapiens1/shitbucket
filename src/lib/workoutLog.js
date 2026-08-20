export const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
export const MOVEMENT_PATTERNS = ["squat", "hinge", "push", "pull", "lunge", "rotate", "carry", "isolation"];

// Local date key (not UTC) so "today" matches the user's calendar day
export function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Sun-Sat week containing `date`, shifted by `weekOffset` weeks
export function getWeekDates(date = new Date(), weekOffset = 0) {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function formatWeekRange(weekDates) {
  const start = weekDates[0];
  const end = weekDates[6];
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = start.toLocaleDateString("en-GB", { day: "numeric", month: sameMonth ? undefined : "short" });
  const endLabel = end.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${startLabel} – ${endLabel}`;
}

// All date keys in the calendar month containing `date`
export function getMonthDateKeys(date) {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => dateKey(new Date(date.getFullYear(), date.getMonth(), i + 1)));
}

export function formatMonthLabel(date) {
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

// Aggregate logged entries across a set of date keys into totals + a per-exercise breakdown
export function summarizeLog(log, dateKeys) {
  let days = 0, exercises = 0, sets = 0, volume = 0;
  const exerciseSets = {};

  dateKeys.forEach(key => {
    const entries = log[key];
    if (!entries || entries.length === 0) return;
    days += 1;

    entries.forEach(e => {
      exercises += 1;
      exerciseSets[e.exercise] = (exerciseSets[e.exercise] || 0) + e.sets.length;

      e.sets.forEach(s => {
        sets += 1;
        if (s.weight) volume += s.weight * s.reps;
      });
    });
  });

  const topExercises = Object.entries(exerciseSets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return { days, exercises, sets, volume, topExercises };
}

// Epley formula - estimated 1-rep max from any weight/reps set
export function estimateOneRepMax(weight, reps) {
  if (!weight || !reps) return 0;
  return weight * (1 + reps / 30);
}

// Current all-time best set per exercise (by est. 1RM), across the whole log
export function getPersonalRecords(log) {
  const bests = {};
  Object.entries(log).forEach(([date, entries]) => {
    entries.forEach(e => {
      e.sets.forEach(s => {
        if (!s.weight) return; // bodyweight sets have no meaningful 1RM
        const est1RM = estimateOneRepMax(s.weight, s.reps);
        const current = bests[e.exercise];
        if (!current || est1RM > current.est1RM) {
          bests[e.exercise] = { exercise: e.exercise, weight: s.weight, reps: s.reps, est1RM, date };
        }
      });
    });
  });
  return Object.values(bests).sort((a, b) => b.date.localeCompare(a.date));
}

// Flatten a log into "date: exercise sets" lines for an AI prompt
export function formatLogForPrompt(log, dateKeys) {
  return dateKeys
    .filter(key => log[key] && log[key].length > 0)
    .map(key => {
      const line = log[key]
        .map(e => `${e.exercise} ${e.sets.map(s => (s.weight ? `${s.weight}kg×${s.reps}` : `${s.reps} reps`)).join(", ")}`)
        .join("; ");
      return `${key}: ${line}`;
    })
    .join("\n");
}
