'use client'

import { motion } from 'framer-motion'
import { Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Idea } from './IdeaList'

interface IdeaCardProps {
  idea: Idea
  onEdit: () => void
  onDelete: () => void
}

export default function IdeaCard({ idea, onEdit, onDelete }: IdeaCardProps) {
  const statusColors = {
    'Not Started': 'bg-red-500',
    'In Progress': 'bg-yellow-500',
    'Completed': 'bg-green-500',
    'Will Never Start': 'bg-gray-500'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-900 border-gray-800 h-full flex flex-col">
        <CardHeader className="pb-2">
          <h3 className="text-xl font-semibold text-white">{idea.title}</h3>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <p className="text-sm text-gray-300">{idea.description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Status:</span>
            <Badge className={`${statusColors[idea.status]} text-white`}>
              {idea.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Resources:</p>
            <p className="text-sm text-gray-300">{idea.resources}</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

