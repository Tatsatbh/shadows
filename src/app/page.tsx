"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FlipWords } from "@/components/ui/flip-words"
import { HeroPreview } from "@/components/app/HeroPreview"

import { SignInDialog } from "@/components/app/SignInDialog"
import localFont from 'next/font/local'
import { Menu, X } from "lucide-react"

import { Poppins } from 'next/font/google'
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const jetbrainsMono = localFont({
  src: '../../public/fonts/jetbrainsmono.ttf',
  variable: '--font-jetbrains-mono',
})

const minecraft = localFont({
  src: '../../public/fonts/minecraft.otf',
  variable: '--font-minecraft',
})

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={`min-h-screen bg-void-page text-light-primary ${poppins.className}`}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-void-page/80 backdrop-blur-sm border-b border-edge-subtle">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`${minecraft.className} text-2xl text-white`}>shadows.sh</span>
          </div>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <SignInDialog>
              <Button variant="ghost" size="sm" className="text-sm text-light-muted hover:text-light-primary hover:bg-transparent">
                Login
              </Button>
            </SignInDialog>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-light-muted hover:text-light-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-void-page border-t border-edge-subtle">
            <div className="px-4 py-4 flex flex-col gap-4">
              <SignInDialog>
                <Button variant="ghost" className="w-full justify-start text-light-muted hover:text-light-primary hover:bg-transparent">
                  Login
                </Button>
              </SignInDialog>
            </div>
          </div>
        )}
      </header>
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl leading-[1.3] font-bold tracking-tight mb-6 text-light-primary">
              Live AI coding mock interviews
              <br />
              <span className="flex items-center gap-3 flex-wrap">
                with questions featured in
                <FlipWords
                  words={["Neetcode 150", "Blind 75", "Neecode 250", "Top Interview 150"]}
                  duration={2500}
                  className={`${jetbrainsMono.className} font-bold px-0`}
                />
              </span>
            </h1>
            <p className="text-lg text-light-muted mb-8 max-w-2xl leading-relaxed">
              Don&apos;t practice in a vacuum. Shadowbox with a Senior Engineer.

The first AI Interviewer that runs your code, judges your voice, and catches your edge cases in real-time. Stop guessing if you&apos;re ready. Prove it.
            </p>
            <div className="flex items-center gap-4">
              <SignInDialog>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-md h-11 px-6 text-sm font-medium">
                  Get Started
                </Button>
              </SignInDialog>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-8">
          <div
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)'
            }}
          >
            <HeroPreview />
          </div>
        </div>
      </section>

    </div>
  )
}
