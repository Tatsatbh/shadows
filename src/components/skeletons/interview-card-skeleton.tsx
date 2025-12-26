"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function InterviewCardSkeleton() {
    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-10 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center mt-auto">
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
        </div>
    )
}
