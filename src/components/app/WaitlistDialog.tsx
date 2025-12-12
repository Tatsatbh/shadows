'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface WaitlistDialogProps {
  children: React.ReactNode
}

export function WaitlistDialog({ children }: WaitlistDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const resetForm = () => {
    setEmail('')
    setHoneypot('')
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check - if filled, silently "succeed" but don't submit
    if (honeypot) {
      setSuccess(true)
      return
    }
    
    setIsLoading(true)
    setError(null)

    const { error } = await supabase
      .from('waitlist')
      .insert({ email })

    if (error) {
      if (error.code === '23505') {
        setError('You\'re already on the waitlist!')
      } else {
        setError(error.message)
      }
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
    setOpen(false)
    toast.success("You're on the list!", {
      description: "We'll be in touch soon.",
    })
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join the Waitlist</DialogTitle>
          <DialogDescription>
            Be the first to know when we launch. We&apos;ll send you an invite.
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="py-6 text-center">
            <p className="text-green-500 font-medium">You&apos;re on the list! 🎉</p>
            <p className="text-sm text-muted-foreground mt-2">We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] opacity-0 h-0 w-0"
              aria-hidden="true"
            />
            
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Waitlist'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
