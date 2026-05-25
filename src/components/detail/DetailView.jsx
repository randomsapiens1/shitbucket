"use client";
import { useState } from "react";
import { calcBrewProgress, getBrewStage } from "@/lib/brew";
import { genId, timeAgo } from "@/lib/utils";
import BrewStatus from "./BrewStatus";
import TagsSection from "./TagsSection";
import TasksSection from "./TasksSection";
import ThoughtsSection from "./ThoughtsSection";
import LinksSection from "./LinksSection";
import CustomFieldsSection from "./CustomFieldsSection";
import DetailMenu from "./DetailMenu";

export default function DetailView({ idea, onBack, onUpdate, onDelete, onShare }) {
  const [newThought, setNewThought] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newTask, setNewTask] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const brew = calcBrewProgress(idea);
  const stage = getBrewStage(brew);

  // --- Thoughts ---
  function addThought() {
    if (!newThought.trim()) return;
    onUpdate(i => { i.thoughts = [...(i.thoughts || []), { id: genId(), text: newThought.trim(), ts: Date.now() }]; });
    setNewThought("");
  }
  function removeThought(tid) {
    onUpdate(i => { i.thoughts = (i.thoughts || []).filter(t => t.id !== tid); });
  }

  // --- Tags ---
  function addTag() {
    const t = newTag.trim().toLowerCase();
    if (!t || (idea.tags || []).includes(t)) return;
    onUpdate(i => { i.tags = [...(i.tags || []), t]; });
    setNewTag("");
  }
  function removeTag(tag) {
    onUpdate(i => { i.tags = (i.tags || []).filter(t => t !== tag); });
  }

  // --- Links ---
  function addLink({ url, label }) {
    onUpdate(i => { i.links = [...(i.links || []), { id: genId(), url, label }]; });
  }
  function removeLink(lid) {
    onUpdate(i => { i.links = (i.links || []).filter(l => l.id !== lid); });
  }

  // --- Custom fields ---
  function addField({ name, type, value }) {
    onUpdate(i => { i.fields = [...(i.fields || []), { id: genId(), name, type, value }]; });
  }
  function updateField(fid, value) {
    onUpdate(i => { i.fields = (i.fields || []).map(f => f.id === fid ? { ...f, value } : f); });
  }
  function removeField(fid) {
    onUpdate(i => { i.fields = (i.fields || []).filter(f => f.id !== fid); });
  }

  // --- Tasks ---
  function addTask() {
    if (!newTask.trim()) return;
    onUpdate(i => { i.tasks = [...(i.tasks || []), { id: genId(), text: newTask.trim(), done: false, ts: Date.now() }]; });
    setNewTask("");
  }
  function toggleTask(tid) {
    onUpdate(i => { i.tasks = (i.tasks || []).map(t => t.id === tid ? { ...t, done: !t.done } : t); });
  }
  function removeTask(tid) {
    onUpdate(i => { i.tasks = (i.tasks || []).filter(t => t.id !== tid); });
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-zinc-500 text-[13px] hover:text-white transition">← back</button>
        <div className="flex gap-2">
          <button onClick={onShare} className="border border-[#222] text-zinc-500 hover:text-white hover:border-[#333] text-base px-2.5 py-1.5 rounded-lg transition">↗</button>
          <button onClick={() => setShowMenu(!showMenu)} className="border border-[#222] text-zinc-500 hover:text-white hover:border-[#333] text-base px-2.5 py-1.5 rounded-lg transition">⋯</button>
        </div>
      </div>

      <DetailMenu show={showMenu} onClose={() => setShowMenu(false)} onDelete={onDelete} />

      {/* Content */}
      <div className="px-4 pb-10">
        <h1 className="text-[22px] font-bold text-white leading-snug pt-5 pb-1">{idea.title}</h1>
        <div className="text-[11px] text-zinc-600 mb-5">
          created {new Date(idea.created_at).toLocaleDateString()} · updated {timeAgo(idea.updated_at)}
        </div>

        <BrewStatus brew={brew} stage={stage} />

        <TagsSection
          tags={idea.tags}
          newTag={newTag}
          setNewTag={setNewTag}
          onAdd={addTag}
          onRemove={removeTag}
        />

        <TasksSection
          tasks={idea.tasks}
          newTask={newTask}
          setNewTask={setNewTask}
          onAdd={addTask}
          onToggle={toggleTask}
          onRemove={removeTask}
        />

        <ThoughtsSection
          thoughts={idea.thoughts}
          newThought={newThought}
          setNewThought={setNewThought}
          onAdd={addThought}
          onRemove={removeThought}
        />

        <LinksSection
          links={idea.links}
          onAdd={addLink}
          onRemove={removeLink}
        />

        <CustomFieldsSection
          fields={idea.fields}
          onAdd={addField}
          onUpdate={updateField}
          onRemove={removeField}
        />
      </div>
    </div>
  );
}
