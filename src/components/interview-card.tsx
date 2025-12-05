"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PhoneCall } from "lucide-react"

interface InterviewCardProps {
  questionNumber: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  onClick?: () => void
}

const difficultyStyles = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function InterviewCard({
  questionNumber,
  title,
  difficulty,
  onClick,
}: InterviewCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            #{questionNumber}
          </Badge>
          <Badge 
            variant="outline" 
            className="text-xs bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live
          </Badge>
        </div>
        <Badge className={cn(difficultyStyles[difficulty])}>
          {difficulty}
        </Badge>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <div className="flex items-center mt-auto">
        <Badge 
          variant="outline" 
          className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1.5 cursor-pointer hover:bg-blue-500/20 transition-colors"
          onClick={onClick}
        >
          <PhoneCall className="h-3 w-3" />
          Join Room
        </Badge>
      </div>
    </div>
  )
}
