'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import IdeaCard from './IdeaCard'
import IdeaForm from './IdeaForm'
import { Button } from '@/components/ui/button'

export interface Idea {
  id: string
  title: string
  description: string
  status: 'Not Started' | 'In Progress' | 'Completed'
  resources: string
  deadline: string
}

export default function IdeaList() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)

  useEffect(() => {
    const storedIdeas = localStorage.getItem('ideas')
    if (storedIdeas) {
      setIdeas(JSON.parse(storedIdeas))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ideas', JSON.stringify(ideas))
  }, [ideas])

  const addIdea = (idea: Idea) => {
    setIdeas([...ideas, { ...idea, id: Date.now().toString() }])
    setIsFormOpen(false)
  }

  const updateIdea = (updatedIdea: Idea) => {
    setIdeas(ideas.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea))
    setEditingIdea(null)
  }

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id))
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 flex justify-center"
      >
        <Button onClick={() => setIsFormOpen(true)} className="bg-white text-black hover:bg-gray-200">
          <Plus className="mr-2 h-4 w-4" /> Add Idea
        </Button>
      </motion.div>
      <AnimatePresence>
        {isFormOpen && (
          <IdeaForm onSubmit={addIdea} onClose={() => setIsFormOpen(false)} />
        )}
        {editingIdea && (
          <IdeaForm idea={editingIdea} onSubmit={updateIdea} onClose={() => setEditingIdea(null)} />
        )}
      </AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {ideas.map(idea => (
            <IdeaCard 
              key={idea.id} 
              idea={idea} 
              onEdit={() => setEditingIdea(idea)} 
              onDelete={() => deleteIdea(idea.id)} 
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

