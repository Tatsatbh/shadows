"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface JoinSessionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    onCancel: () => void
    credits: number
}

export function JoinSessionDialog({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
    credits
}: JoinSessionDialogProps) {
    const hasEnoughCredits = credits >= 1

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Start Interview Session?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-2">
                            {hasEnoughCredits ? (
                                <>
                                    <p>Are you sure?</p>
                                    <p>
                                        This will use <span className="font-bold text-foreground">1 credit</span> from your balance.
                                    </p>
                                </>
                            ) : (
                                <p className="text-red-500 font-medium">
                                    You do not have enough credits to start a new session.
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-4">
                                Current balance: {credits} credits
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            if (!hasEnoughCredits) {
                                e.preventDefault()
                                return
                            }
                            onConfirm()
                        }}
                        disabled={!hasEnoughCredits}
                        className={!hasEnoughCredits ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        Start Session
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
