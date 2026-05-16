"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function InterviewCardSkeleton() {
    return (
        <div className="flex h-full min-h-[188px] flex-col gap-4 rounded-[8px] border border-border/70 bg-card/90 p-4 dark:border-white/10 dark:bg-[#05070a]/90">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-10 rounded-[4px]" />
                    <Skeleton className="h-5 w-12 rounded-[4px]" />
                </div>
                <Skeleton className="h-5 w-16 rounded-[4px]" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center mt-auto">
                <Skeleton className="h-9 w-full rounded-[4px]" />
            </div>
        </div>
    )
}
