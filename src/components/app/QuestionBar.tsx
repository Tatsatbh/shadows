'use client'
import { useEffect } from "react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { usePathname, useParams } from 'next/navigation'
import { useQuery } from "@tanstack/react-query";
import { fetchQuestionByUri } from "@/lib/queries";
import { useQuestionStore } from "@/store";
import { cn } from "@/lib/utils";

const difficultyStyles = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function QuestionBar() {
  const params = useParams()

  const setQuestion = useQuestionStore((s) => s.setQuestionText)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['question', params.name],
    queryFn: () => fetchQuestionByUri(params.name as string),
    enabled: !!params.name,
  })

  useEffect(() => {
    if (!data) return
    const text = `${data.title} (${data.difficulty})\n\n${data.description_md}`
    setQuestion(text)
  }, [data, setQuestion])



  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full">
        <Card className="border-none shadow-none flex flex-col h-full overflow-y-auto">
          <CardHeader className="items-start">
            <CardTitle className="text-2xl">Loading…</CardTitle>
          </CardHeader>
          <CardContent>Fetching question…</CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="flex flex-col w-full h-full">
        <Card className="border-none shadow-none flex flex-col h-full overflow-y-auto">
          <CardHeader className="items-start">
            <CardTitle className="text-2xl">Loading…</CardTitle>
          </CardHeader>
          <CardContent>Fetching question…</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Card className="border-none shadow-none flex flex-col h-full overflow-y-auto">
        <CardHeader className="items-start">
          <CardTitle className="text-2xl">{data.question_number}. {data.title}</CardTitle>
          <Badge
            className={cn("mt-2 w-fit shadow-none", difficultyStyles[data.difficulty as keyof typeof difficultyStyles])}
            aria-label={`Difficulty: ${data.difficulty}`}
          >
            {data.difficulty}
          </Badge>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none flex-1 prose-pre:bg-gray-100 dark:prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800 prose-code:bg-gray-100 dark:prose-code:bg-neutral-800 prose-code:text-gray-800 dark:prose-code:text-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-gray-200 dark:prose-code:border-neutral-700 prose-code:before:content-none prose-code:after:content-none">
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
