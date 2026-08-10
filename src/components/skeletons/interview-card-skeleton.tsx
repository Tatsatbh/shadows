"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function InterviewCardSkeleton() {
    return (
        <div className="flex h-full min-h-[188px] flex-col gap-4 rounded-[8px] border border-border bg-card p-4 dark:border-[#0b72ff]/24 dark:bg-[#061635]/24">
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
