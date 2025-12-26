"use client"

import { CreditsDisplay } from "@/components/credits-display"
import { ThemeToggle } from "@/components/theme-toggle"

export function HeaderControls() {
    return (
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <CreditsDisplay />
        </div>
    )
}
