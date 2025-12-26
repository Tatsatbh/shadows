"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function QuestionBarSkeleton() {
    return (
        <div className="flex flex-col w-full h-full">
            <Card className="border-none shadow-none flex flex-col h-full overflow-y-auto">
                <CardHeader className="items-start">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-16 mt-2 rounded-full" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full mt-4" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-20 w-full mt-4 rounded-md" />
                    <Skeleton className="h-4 w-full mt-4" />
                    <Skeleton className="h-4 w-4/5" />
                </CardContent>
            </Card>
        </div>
    )
}
