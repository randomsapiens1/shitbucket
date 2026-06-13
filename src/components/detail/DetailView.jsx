"use client";
import { useState, useEffect } from "react";
import { genId, timeAgo, formatCountdown } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import TagsSection from "./TagsSection";
import TasksSection from "./TasksSection";
import ThoughtsSection from "./ThoughtsSection";
import LinksSection from "./LinksSection";
import CustomFieldsSection from "./CustomFieldsSection";
import DetailMenu from "./DetailMenu";
import CollaboratorsSection from "./CollaboratorsSection";
import BrewStatus from "./BrewStatus";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";
import { arrayMove } from "@dnd-kit/sortable";

export default function DetailView({ idea, allTags, onBack, onUpdate, onDelete, userId }) {
  const [newThought,        setNewThought]        = useState("");
  const [newTag,            setNewTag]            = useState("");
  const [newTask,           setNewTask]           = useState("");
  const [showMenu,          setShowMenu]          = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [userInitials,      setUserInitials]      = useState("??");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const email = user.email || "";
        const metadata = user.user_metadata || {};
        const username = metadata.username || email.split("@")[0];
        const init = username.slice(0, 2).toUpperCase();
        setUserInitials(init);
      }
    });
  }, []);

  const isOwner = !userId || idea.user_id === userId;

  function addThought() {
    if (!newThought.trim()) return;
    onUpdate(i => { 
      i.thoughts = [
        ...(i.thoughts || []), 
        { 
          id: genId(), 
          text: newThought.trim(), 
          ts: Date.now(),
          by: userInitials 
        }
      ]; 
    });
    setNewThought("");
  }
  function removeThought(tid) {
    onUpdate(i => { i.thoughts = (i.thoughts || []).filter(t => t.id !== tid); });
  }

  function updateThought(tid, text) {
    onUpdate(i => { i.thoughts = (i.thoughts || []).map(t => t.id === tid ? { ...t, text } : t); });
  }

  function addTag(overrideTag) {
    const t = (overrideTag || newTag).trim().toLowerCase();
    if (!t || (idea.tags || []).includes(t)) return;
    onUpdate(i => { i.tags = [...(i.tags || []), t]; });
    setNewTag("");
  }
  function removeTag(tag) {
    onUpdate(i => { i.tags = (i.tags || []).filter(t => t !== tag); });
  }

  function addLink({ url, label }) {
    onUpdate(i => { i.links = [...(i.links || []), { id: genId(), url, label }]; });
  }
  function removeLink(lid) {
    onUpdate(i => { i.links = (i.links || []).filter(l => l.id !== lid); });
  }

  function addField({ name, type, value }) {
    onUpdate(i => { i.fields = [...(i.fields || []), { id: genId(), name, type, value }]; });
  }
  function updateField(fid, value) {
    onUpdate(i => { i.fields = (i.fields || []).map(f => f.id === fid ? { ...f, value } : f); });
  }
  function removeField(fid) {
    onUpdate(i => { i.fields = (i.fields || []).filter(f => f.id !== fid); });
  }

  function handleReorderLinks(oldIndex, newIndex) {
    onUpdate(i => {
      i.links = arrayMove(i.links || [], oldIndex, newIndex);
    });
  }

  function handleReorderFields(oldIndex, newIndex) {
    onUpdate(i => {
      i.fields = arrayMove(i.fields || [], oldIndex, newIndex);
    });
  }

  function addTask() {
    if (!newTask.trim()) return;
    onUpdate(i => { 
      i.tasks = [
        ...(i.tasks || []), 
        { 
          id: genId(), 
          text: newTask.trim(), 
          done: false, 
          ts: Date.now(),
          by: userInitials
        }
      ]; 
    });
    setNewTask("");
  }
  function updateTask(tid, text) {
    onUpdate(i => { i.tasks = (i.tasks || []).map(t => t.id === tid ? { ...t, text } : t); });
  }

  function toggleTask(tid) {
    onUpdate(i => { i.tasks = (i.tasks || []).map(t => t.id === tid ? { ...t, done: !t.done } : t); });
  }
  function removeTask(tid) {
    onUpdate(i => { i.tasks = (i.tasks || []).filter(t => t.id !== tid); });
  }

  function handleReorderThoughts(oldIndex, newIndex) {
    onUpdate(i => {
      i.thoughts = arrayMove(i.thoughts || [], oldIndex, newIndex);
    });
  }

  function handleReorderTasks(oldIndex, newIndex) {
    onUpdate(i => {
      i.tasks = arrayMove(i.tasks || [], oldIndex, newIndex);
    });
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-black pb-24 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 border-b-2 border-black bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-black font-extrabold text-[calc((13/12)*var(--base-font-size))] bg-[#FFF8EE] border-2 border-black rounded-xl px-3 py-1.5 shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
        >
          ← back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCollaborators(true)}
            title="Invite a friend?"
            className="border-2 border-black text-black font-extrabold text-base px-2.5 py-1.5 rounded-xl shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-black/5"
          >
            ↗
          </button>
          {isOwner && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="border-2 border-black text-black font-extrabold text-base px-2.5 py-1.5 rounded-xl shadow-hard-sm transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] hover:bg-black/5"
            >
              ⋯
            </button>
          )}
        </div>
      </div>

      <DetailMenu
        show={showMenu}
        onClose={() => setShowMenu(false)}
        onDelete={onDelete}
        isOwner={isOwner}
      />

      {/* Content */}
      <div className="px-4 pb-10">
        <AutoResizeTextarea
          className="w-full bg-transparent text-[calc((24/12)*var(--base-font-size))] font-extrabold text-black leading-snug pt-5 pb-1 outline-none border-none placeholder:text-black/20"
          value={idea.title}
          onChange={(e) => onUpdate(i => { i.title = e.target.value; })}
          placeholder="Idea title..."
        />
        
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[calc((11/12)*var(--base-font-size))] font-bold text-black/40 mb-6">
          <span className="text-[#FF6A00]/60">
            {new Date(idea.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}
          </span>
          <span>•</span>
          <span>updated {timeAgo(idea.updated_at)}</span>
          {idea.expires_at && (
            <>
              <span>•</span>
              <span className="text-[#FF6A00] font-extrabold uppercase tracking-tight">
                {formatCountdown(idea.expires_at)}
              </span>
            </>
          )}
          {!isOwner && (
            <span className="text-[#FF6A00] font-extrabold bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-full px-2 py-0.5 uppercase tracking-tight text-[calc((10/12)*var(--base-font-size))]">
              👥 shared
            </span>
          )}
        </div>

        {isOwner && showCollaborators && (
          <CollaboratorsSection idea={idea} />
        )}

        {/* Main Thought / Description */}
        <div className="mb-8">
          <AutoResizeTextarea
            className="w-full bg-white border-2 border-black/10 focus:border-black rounded-2xl px-5 py-4 text-black text-[calc((15/12)*var(--base-font-size))] font-bold outline-none transition placeholder:text-black/20 shadow-hard-sm focus:shadow-hard"
            placeholder="What's the main gist?"
            value={idea.thought || ""}
            onChange={(e) => onUpdate(i => { i.thought = e.target.value; })}
            rows={2}
          />
        </div>

        <TagsSection
          tags={idea.tags}
          allTags={allTags}
          newTag={newTag}
          setNewTag={setNewTag}
          onAdd={addTag}
          onRemove={removeTag}
        />

        <ThoughtsSection
          thoughts={idea.thoughts}
          newThought={newThought}
          setNewThought={setNewThought}
          onAdd={addThought}
          onRemove={removeThought}
          onUpdate={updateThought}
          onReorder={handleReorderThoughts}
          currentUserInitials={userInitials}
        />

        <TasksSection
          tasks={idea.tasks}
          newTask={newTask}
          setNewTask={setNewTask}
          onAdd={addTask}
          onToggle={toggleTask}
          onRemove={removeTask}
          onUpdate={updateTask}
          onReorder={handleReorderTasks}
          currentUserInitials={userInitials}
        />

        <LinksSection
          links={idea.links}
          onAdd={addLink}
          onRemove={removeLink}
          onReorder={handleReorderLinks}
        />

        <CustomFieldsSection
          fields={idea.fields}
          onAdd={addField}
          onUpdate={updateField}
          onRemove={removeField}
          onReorder={handleReorderFields}
        />
      </div>
    </div>
  );
}
