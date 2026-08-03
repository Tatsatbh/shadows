'use client'

import { useEffect, useRef, useState } from "react"
import { AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TimeExpiredModalProps {
  isOpen: boolean
  onAutoSubmit: () => void
}

export default function TimeExpiredModal({ isOpen, onAutoSubmit }: TimeExpiredModalProps) {
  const [countdown, setCountdown] = useState(3)

  // Auto-submit must fire exactly once per opening of the modal. The effect
  // re-runs whenever onAutoSubmit changes identity, and while countdown is at 0
  // that meant submitting again on every such change — so a failing report
  // request could be retried in a tight loop, each attempt costing a grading
  // call.
  const hasSubmittedRef = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3)
      hasSubmittedRef.current = false
      return
    }

    if (countdown <= 0) {
      if (hasSubmittedRef.current) return
      hasSubmittedRef.current = true
      onAutoSubmit()
      return
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isOpen, countdown, onAutoSubmit])

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <DialogTitle>Time&apos;s Up!</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Your interview session has ended. Your work will be automatically submitted
            and your evaluation report will be generated.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <p className="text-sm text-muted-foreground">
            Auto-submitting in...
          </p>
          <span className="text-4xl font-bold text-red-500 mt-2">
            {countdown}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
