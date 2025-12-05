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

interface SignInDialogProps {
  children: React.ReactNode
}

type AuthMode = 'signin' | 'signup'

export function SignInDialog({ children }: SignInDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClient()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError(null)
    setMessage(null)
  }

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode)
    setError(null)
    setMessage(null)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    // Redirect to dashboard on success
    window.location.href = '/dashboard'
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setMessage('Check your email for a confirmation link!')
    setIsLoading(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      resetForm()
      setMode('signin')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'signin' ? 'Sign in to Shadows' : 'Create an account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'signin'
              ? 'Enter your email and password to continue'
              : 'Enter your email and password to get started'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="flex flex-col gap-4 mt-4">
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          {message && (
            <p className="text-sm text-green-500">{message}</p>
          )}

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading
              ? 'Loading...'
              : mode === 'signin'
              ? 'Sign In'
              : 'Sign Up'}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signup')}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signin')}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
