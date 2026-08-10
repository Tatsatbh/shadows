'use client'
import { useEffect } from "react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { useParams } from 'next/navigation'
import { useQuery } from "@tanstack/react-query";
import { fetchQuestionByUri } from "@/lib/queries";
import { useQuestionStore } from "@/store";
import { cn } from "@/lib/utils";
import { QuestionBarSkeleton } from "@/components/skeletons";

const difficultyStyles = {
  Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Hard: "bg-rose-500/10 text-rose-500 border-rose-500/20",
}

export default function QuestionBar() {
  const params = useParams()

  const setQuestion = useQuestionStore((s) => s.setQuestionText)

  const { data, isLoading } = useQuery({
    queryKey: ['question', params.name],
    queryFn: () => fetchQuestionByUri(params.name as string),
    enabled: !!params.name,
  })

  useEffect(() => {
    if (!data) return
    const text = `${data.title} (${data.difficulty})\n\n${data.description_md}`
    setQuestion(text)
  }, [data, setQuestion])



  if (isLoading || !data) {
    return <QuestionBarSkeleton />
  }

  return (
    <div className="flex flex-col w-full h-full bg-background dark:bg-[#020305] border-r border-border/60 dark:border-white/10">
      <Card className="border-none shadow-none flex flex-col h-full overflow-y-auto bg-transparent">
        <CardHeader className="items-start">
          <CardTitle className="text-2xl text-foreground">{data.question_number}. {data.title}</CardTitle>
          <Badge
            variant="outline"
            className={cn("mt-2 w-fit rounded-[4px] text-[11px] shadow-none", difficultyStyles[data.difficulty as keyof typeof difficultyStyles])}
            aria-label={`Difficulty: ${data.difficulty}`}
          >
            {data.difficulty}
          </Badge>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none flex-1 prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border/60 dark:prose-pre:bg-white/[0.035] dark:prose-pre:border-white/10 prose-code:bg-muted/30 prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-border/60 dark:prose-code:bg-white/[0.035] dark:prose-code:border-white/10 prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          >
            {data.description_md}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  )
}
