'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Idea } from './IdeaList'

interface IdeaFormProps {
  idea?: Idea
  onSubmit: (idea: Idea) => void
  onClose: () => void
}

export default function IdeaForm({ idea, onSubmit, onClose }: IdeaFormProps) {
  const [title, setTitle] = useState(idea?.title || '')
  const [description, setDescription] = useState(idea?.description || '')
  const [status, setStatus] = useState(idea?.status || 'Not Started')
  const [resources, setResources] = useState(idea?.resources || '')
  const [deadline, setDeadline] = useState(idea?.deadline || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: idea?.id || '',
      title,
      description,
      status: status as 'Not Started' | 'In Progress' | 'Completed',
      resources,
      deadline,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gray-900 p-6 rounded-lg w-full max-w-md relative"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold mb-4">{idea ? 'Edit Idea' : 'Add New Idea'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-800 border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-gray-800 border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <Select value={status} onValueChange={(value) => setStatus(value as 'Not Started' | 'In Progress' | 'Completed')}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="resources" className="block text-sm font-medium mb-1">
              Resources
            </label>
            <Textarea
              id="resources"
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              className="w-full bg-gray-800 border-gray-700"
            />
          </div>
          
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium mb-1">
              Deadline
            </label>
            <Input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full bg-gray-800 border-gray-700"
            />
          </div>
          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
            {idea ? 'Update Idea' : 'Add Idea'}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  )
}

