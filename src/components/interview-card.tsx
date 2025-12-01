"use client"

import { Badge } from "@/components/ui/badge"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { cn } from "@/lib/utils"

interface InterviewCardProps {
  questionNumber: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questionUri: string
  companies?: string[]
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
  questionUri,
  companies = [],
  onClick,
}: InterviewCardProps) {
  const companyScales: Record<string, number> = {
    microsoft: 1.8,
    amazon: 1.0,
    google: 1.0,
    meta: 1.0,
    netflix: 1.0,
  }

  const tooltipItems = companies.map((company, idx) => ({
    id: idx,
    name: company.charAt(0).toUpperCase() + company.slice(1),
    designation: '',
    image: `/icon/${company}.png`,
    scale: companyScales[company] || 1.5
  }))

  return (
    <div 
      className="flex flex-col gap-4 rounded-xl border bg-card p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <Badge variant="outline" className="text-xs">
          #{questionNumber}
        </Badge>
        <Badge className={cn(difficultyStyles[difficulty])}>
          {difficulty}
        </Badge>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      
      {companies.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <AnimatedTooltip items={tooltipItems} />
        </div>
      )}
    </div>
  )
}
