"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchUserCredits } from "@/lib/queries"
import { Coins } from "lucide-react"
import { useAuthStore } from "@/store"

import { Skeleton } from "@/components/ui/skeleton"

export function CreditsDisplay() {
    const user = useAuthStore((state) => state.user)

    const { data: credits, isLoading } = useQuery({
        queryKey: ["credits", user?.id],
        queryFn: () => fetchUserCredits(user!.id),
        enabled: !!user?.id,
    })

    if (!user) return null

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 rounded-md border border-transparent bg-muted/50 px-3 py-2 shadow-sm animate-pulse">
                <div className="h-4 w-4 rounded-full bg-muted" />
                <div className="h-4 w-16 rounded bg-muted" />
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span>{credits ?? 0} Credits</span>
        </div>
    )
}
