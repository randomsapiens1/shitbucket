"use client";
import { useState, useMemo, useEffect } from "react";
import Section from "@/components/ui/Section";
import { genId, copyToClipboard } from "@/lib/utils";
import {
  dateKey,
  getWeekDates,
  formatWeekRange,
  getMonthDateKeys,
  formatMonthLabel,
  summarizeLog,
  formatLogForPrompt,
  estimateOneRepMax,
  getPersonalRecords,
  WEEKDAY_LABELS,
  MOVEMENT_PATTERNS,
} from "@/lib/workoutLog";

function cleanSets(sets) {
  return sets
    .map(s => ({
      weight: s.weight === "" ? null : Number(s.weight),
      reps: s.reps === "" ? null : Number(s.reps),
    }))
    .filter(s => s.reps !== null && !isNaN(s.reps));
}

function SetRows({ sets, onUpdateSet, onRemoveSet }) {
  return (
    <div className="flex flex-col gap-2 mb-2">
      {sets.map((s, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-black/40 w-9 shrink-0">SET {idx + 1}</span>
          <input
            type="number"
            inputMode="decimal"
            className="w-24 bg-white border-2 border-black/20 focus:border-black rounded-lg px-3 py-1.5 text-center text-black text-[calc((12/12)*var(--base-font-size))] font-bold outline-none transition placeholder:text-black/30"
            placeholder="kg"
            value={s.weight}
            onChange={(e) => onUpdateSet(idx, "weight", e.target.value)}
          />
          <span className="text-black/20 font-bold">×</span>
          <input
            type="number"
            inputMode="numeric"
            className="w-24 bg-white border-2 border-black/20 focus:border-black rounded-lg px-3 py-1.5 text-center text-black text-[calc((12/12)*var(--base-font-size))] font-bold outline-none transition placeholder:text-black/30"
            placeholder="reps"
            value={s.reps}
            onChange={(e) => onUpdateSet(idx, "reps", e.target.value)}
          />
          {sets.length > 1 && (
            <button
              onClick={() => onRemoveSet(idx)}
              className="text-black/30 hover:text-black text-lg px-1 transition font-bold"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function MovementPatternPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {MOVEMENT_PATTERNS.map(g => (
        <button
          key={g}
          onClick={() => onChange(value === g ? "" : g)}
          className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border-2 border-black transition-all ${
            value === g ? "bg-[#FF6A00] text-white" : "bg-white text-black"
          }`}
        >
          {g}
        </button>
      ))}
    </div>
  );
}

export default function WorkoutLogSection({ idea, onUpdate }) {
  const log = idea.template_data || {};
  const today = useMemo(() => new Date(), []);
  const todayKey = dateKey(today);

  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState(todayKey);
  const [exercise, setExercise] = useState("");
  const [category, setCategory] = useState("");
  const [sets, setSets] = useState([{ weight: "", reps: "" }]);

  const [editingId, setEditingId] = useState(null);
  const [editExercise, setEditExercise] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSets, setEditSets] = useState([]);

  const [summaryScope, setSummaryScope] = useState("day");
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [summaryCopied, setSummaryCopied] = useState(false);

  const weekDates = useMemo(() => getWeekDates(today, weekOffset), [today, weekOffset]);
  const selectedEntries = log[selected] || [];
  const selectedLabel = new Date(`${selected}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "short",
  });

  const selectedDateObj = useMemo(() => new Date(`${selected}T00:00:00`), [selected]);
  const summaryDateKeys = useMemo(() => {
    if (summaryScope === "day") return [selected];
    if (summaryScope === "week") return weekDates.map(dateKey);
    return getMonthDateKeys(selectedDateObj);
  }, [summaryScope, weekDates, selectedDateObj, selected]);
  const summary = useMemo(() => summarizeLog(log, summaryDateKeys), [log, summaryDateKeys]);
  const summaryLabel =
    summaryScope === "day" ? selectedLabel :
    summaryScope === "week" ? formatWeekRange(weekDates) :
    formatMonthLabel(selectedDateObj);

  // Best est. 1RM per exercise from every OTHER day, used to flag PR sets on the selected day
  const priorBests = useMemo(() => {
    const map = {};
    Object.entries(log).forEach(([date, entries]) => {
      if (date === selected) return;
      entries.forEach(e => {
        e.sets.forEach(s => {
          if (!s.weight) return;
          const est = estimateOneRepMax(s.weight, s.reps);
          if (!map[e.exercise] || est > map[e.exercise]) map[e.exercise] = est;
        });
      });
    });
    return map;
  }, [log, selected]);

  const personalRecords = useMemo(() => {
    const todaysExercises = new Set(selectedEntries.map(e => e.exercise));
    return getPersonalRecords(log).filter(pr => todaysExercises.has(pr.exercise));
  }, [log, selectedEntries]);

  useEffect(() => {
    setAiSummary(null);
    setAiError("");
    setSummaryCopied(false);
  }, [summaryScope, summaryDateKeys]);

  async function generateAiSummary() {
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/workout-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: summaryScope,
          label: summaryLabel,
          log: formatLogForPrompt(log, summaryDateKeys),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate summary");
      setAiSummary(data.summary);
    } catch (e) {
      setAiError(e.message);
    } finally {
      setAiLoading(false);
    }
  }

  function updateSet(idx, field, value) {
    setSets(prev => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  }

  function addSetRow() {
    setSets(prev => [...prev, { weight: "", reps: "" }]);
  }

  function removeSetRow(idx) {
    setSets(prev => prev.filter((_, i) => i !== idx));
  }

  function logExercise() {
    const name = exercise.trim();
    if (!name) return;

    const finalSets = cleanSets(sets);
    if (finalSets.length === 0) return;

    onUpdate(i => {
      const data = { ...(i.template_data || {}) };
      data[selected] = [...(data[selected] || []), { id: genId(), exercise: name, category: category || null, sets: finalSets }];
      i.template_data = data;
    });

    setExercise("");
    setCategory("");
    setSets([{ weight: "", reps: "" }]);
  }

  function removeEntry(id) {
    onUpdate(i => {
      const data = { ...(i.template_data || {}) };
      const remaining = (data[selected] || []).filter(e => e.id !== id);
      if (remaining.length === 0) delete data[selected];
      else data[selected] = remaining;
      i.template_data = data;
    });
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditExercise(entry.exercise);
    setEditCategory(entry.category || "");
    setEditSets(entry.sets.map(s => ({ weight: s.weight ?? "", reps: s.reps ?? "" })));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function updateEditSet(idx, field, value) {
    setEditSets(prev => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  }

  function addEditSetRow() {
    setEditSets(prev => [...prev, { weight: "", reps: "" }]);
  }

  function removeEditSetRow(idx) {
    setEditSets(prev => prev.filter((_, i) => i !== idx));
  }

  function saveEdit() {
    const name = editExercise.trim();
    if (!name) return;

    const finalSets = cleanSets(editSets);
    if (finalSets.length === 0) return;

    onUpdate(i => {
      const data = { ...(i.template_data || {}) };
      data[selected] = (data[selected] || []).map(e =>
        e.id === editingId ? { ...e, exercise: name, category: editCategory || null, sets: finalSets } : e
      );
      i.template_data = data;
    });

    setEditingId(null);
  }

  function copySummary() {
    if (!aiSummary) return;
    copyToClipboard(aiSummary);
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 2000);
  }

  return (
    <>
    <Section label="workout log">
      {/* Week nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setWeekOffset(w => w - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black font-extrabold text-black active:scale-90 transition"
        >
          ‹
        </button>
        <p className="font-extrabold text-[calc((12/12)*var(--base-font-size))] uppercase tracking-[0.1em] text-black/60">
          {formatWeekRange(weekDates)}
        </p>
        <button
          onClick={() => setWeekOffset(w => w + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black font-extrabold text-black active:scale-90 transition"
        >
          ›
        </button>
      </div>

      {/* 7-day week strip */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {weekDates.map((d, idx) => {
          const key = dateKey(d);
          const hasEntries = (log[key] || []).length > 0;
          const isSelected = key === selected;
          const isToday = key === todayKey;
          return (
            <button
              key={idx}
              onClick={() => { setSelected(key); setEditingId(null); }}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all ${
                isSelected
                  ? "bg-[#FF6A00] border-black text-white"
                  : isToday
                  ? "bg-black border-black text-white"
                  : "bg-[#FFF8EE] border-black/10 text-black hover:border-black"
              }`}
            >
              <span className="text-[9px] font-extrabold uppercase opacity-60">{WEEKDAY_LABELS[idx]}</span>
              <span className="text-[calc((14/12)*var(--base-font-size))] font-extrabold leading-none">{d.getDate()}</span>
              <span className={`w-1 h-1 rounded-full ${hasEntries ? (isSelected ? "bg-white" : "bg-[#FF6A00]") : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>

      {/* Selected day panel */}
      <div className="border-t-2 border-black/10 pt-4">
        <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.12em] text-black/40 mb-2">
          {selectedLabel}
        </p>

        {selectedEntries.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {selectedEntries.map(e =>
              editingId === e.id ? (
                <div key={e.id} className="bg-white border-2 border-black rounded-xl p-3">
                  <input
                    className="w-full bg-[#FFF8EE] border-2 border-black/20 focus:border-black rounded-lg px-3 py-2 text-black text-[calc((13/12)*var(--base-font-size))] font-bold outline-none transition placeholder:text-black/30 mb-2"
                    value={editExercise}
                    onChange={(ev) => setEditExercise(ev.target.value)}
                  />
                  <MovementPatternPicker value={editCategory} onChange={setEditCategory} />
                  <SetRows sets={editSets} onUpdateSet={updateEditSet} onRemoveSet={removeEditSetRow} />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={addEditSetRow}
                      className="text-[#FF6A00] font-extrabold text-[calc((11/12)*var(--base-font-size))] px-1 py-1"
                    >
                      + add set
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={cancelEdit}
                        className="text-black/40 hover:text-black font-extrabold text-[calc((11/12)*var(--base-font-size))] px-3 py-2"
                      >
                        cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="bg-black text-white border-2 border-black rounded-xl px-4 py-2 text-[calc((12/12)*var(--base-font-size))] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white"
                      >
                        save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={e.id}
                  className="bg-[#FFF8EE] border border-black/20 rounded-xl px-4 py-3 flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-extrabold text-black text-[calc((13/12)*var(--base-font-size))] capitalize truncate">
                        {e.exercise}
                      </p>
                      {e.category && (
                        <span className="text-[9px] font-extrabold uppercase text-black/40 bg-black/5 px-1.5 py-0.5 rounded-md shrink-0">
                          {e.category}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {e.sets.map((s, i) => {
                        const isPR = s.weight && estimateOneRepMax(s.weight, s.reps) > (priorBests[e.exercise] || 0);
                        return (
                          <span
                            key={i}
                            className={`text-[calc((10/12)*var(--base-font-size))] font-extrabold px-2 py-0.5 rounded-md ${
                              isPR ? "bg-[#FF6A00] text-white" : "bg-black text-white"
                            }`}
                          >
                            {isPR && "PR "}
                            {s.weight ? `${s.weight}kg × ${s.reps}` : `${s.reps} reps`}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(e)}
                      className="text-black/30 hover:text-black text-[10px] font-extrabold uppercase tracking-wide transition"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => removeEntry(e.id)}
                      className="text-black/30 hover:text-black text-base px-1 transition font-bold"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Composer */}
        <div className="bg-[#FFF8EE] border-2 border-black/10 rounded-xl p-3">
          <input
            className="w-full bg-white border-2 border-black/20 focus:border-black rounded-lg px-3 py-2 text-black text-[calc((13/12)*var(--base-font-size))] font-bold outline-none transition placeholder:text-black/30 mb-2"
            placeholder="exercise name"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />

          <MovementPatternPicker value={category} onChange={setCategory} />

          <SetRows sets={sets} onUpdateSet={updateSet} onRemoveSet={removeSetRow} />

          <div className="flex items-center justify-between">
            <button
              onClick={addSetRow}
              className="text-[#FF6A00] font-extrabold text-[calc((11/12)*var(--base-font-size))] px-1 py-1"
            >
              + add set
            </button>
            {exercise.trim() && (
              <button
                onClick={logExercise}
                className="bg-black text-white border-2 border-black rounded-xl px-4 py-2 text-[calc((12/12)*var(--base-font-size))] font-extrabold shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white"
              >
                log it
              </button>
            )}
          </div>
        </div>
      </div>
    </Section>

    {personalRecords.length > 0 && (
      <Section label="personal records">
        <div className="flex flex-col gap-1.5">
          {personalRecords.map(pr => (
            <div
              key={pr.exercise}
              className="flex items-center justify-between bg-[#FFF8EE] border-2 border-black/10 rounded-xl px-3 py-2"
            >
              <p className="font-extrabold text-black text-[calc((12/12)*var(--base-font-size))] capitalize truncate">
                {pr.exercise}
              </p>
              <p className="text-[calc((11/12)*var(--base-font-size))] font-bold text-black/60 shrink-0 ml-2">
                {pr.weight}kg × {pr.reps} <span className="text-black/30">· ~{Math.round(pr.est1RM)}kg 1RM</span>
              </p>
            </div>
          ))}
        </div>
      </Section>
    )}

    <Section label="summary">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.12em] text-black/40">
            {summaryLabel}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setSummaryScope("day")}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border-2 border-black transition-all ${
                summaryScope === "day" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              day
            </button>
            <button
              onClick={() => setSummaryScope("week")}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border-2 border-black transition-all ${
                summaryScope === "week" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              week
            </button>
            <button
              onClick={() => setSummaryScope("month")}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border-2 border-black transition-all ${
                summaryScope === "month" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              month
            </button>
          </div>
        </div>

        {summary.days === 0 ? (
            <p className="text-[calc((12/12)*var(--base-font-size))] font-bold text-black/30 py-2">
              nothing logged {summaryScope === "day" ? "today" : summaryScope === "week" ? "this week" : "this month"} yet.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-[#FFF8EE] border-2 border-black/10 rounded-xl py-2 text-center">
                  <p className="font-extrabold text-black text-[calc((16/12)*var(--base-font-size))] leading-none">{summary.days}</p>
                  <p className="text-[9px] font-extrabold uppercase text-black/40 mt-1">days</p>
                </div>
                <div className="bg-[#FFF8EE] border-2 border-black/10 rounded-xl py-2 text-center">
                  <p className="font-extrabold text-black text-[calc((16/12)*var(--base-font-size))] leading-none">{summary.exercises}</p>
                  <p className="text-[9px] font-extrabold uppercase text-black/40 mt-1">exercises</p>
                </div>
                <div className="bg-[#FFF8EE] border-2 border-black/10 rounded-xl py-2 text-center">
                  <p className="font-extrabold text-black text-[calc((16/12)*var(--base-font-size))] leading-none">{summary.sets}</p>
                  <p className="text-[9px] font-extrabold uppercase text-black/40 mt-1">sets</p>
                </div>
                <div className="bg-[#FFF8EE] border-2 border-black/10 rounded-xl py-2 text-center">
                  <p className="font-extrabold text-black text-[calc((16/12)*var(--base-font-size))] leading-none">{summary.volume.toLocaleString()}</p>
                  <p className="text-[9px] font-extrabold uppercase text-black/40 mt-1">kg vol</p>
                </div>
              </div>

              {summary.topExercises.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {summary.topExercises.map(([name, count]) => (
                    <span
                      key={name}
                      className="bg-black text-white text-[calc((10/12)*var(--base-font-size))] font-extrabold px-2.5 py-1 rounded-full capitalize"
                    >
                      {name} × {count}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={generateAiSummary}
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-1.5 border-2 border-black rounded-xl px-4 py-2.5 text-[calc((12/12)*var(--base-font-size))] font-extrabold bg-white text-black shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-[#FF6A00] hover:text-white disabled:opacity-50"
              >
                {aiLoading ? "thinking..." : "ai summary"}
              </button>

              {aiError && (
                <p className="text-red-500 text-[calc((11/12)*var(--base-font-size))] font-bold text-center mt-2">{aiError}</p>
              )}

              {aiSummary && (
                <div className="mt-3 bg-black text-white rounded-xl p-4">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/40">{summaryLabel}</p>
                    <button
                      onClick={copySummary}
                      title="Copy summary"
                      className={`flex items-center justify-center w-7 h-7 shrink-0 transition-all active:scale-90 ${
                        summaryCopied ? "text-[#CAFF00]" : "text-white/50 hover:text-white"
                      }`}
                    >
                      {summaryCopied ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="whitespace-pre-line font-mono text-[calc((12/12)*var(--base-font-size))] font-bold leading-relaxed">{aiSummary}</p>
                </div>
              )}
            </>
          )}
    </Section>
    </>
  );
}
