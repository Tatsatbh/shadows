"use client"

import { Button } from "@/components/ui/button"
import { FlipWords } from "@/components/ui/flip-words"
import { HeroPreview } from "@/components/app/HeroPreview"
import { InfiniteCarousel } from "@/components/ui/infinite-carousel"
import { SignInDialog } from "@/components/app/SignInDialog"
import Link from "next/link"
import localFont from 'next/font/local'

import { Poppins } from 'next/font/google'
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const jetbrainsMono = localFont({
  src: '../../public/fonts/jetbrainsmono.ttf',
  variable: '--font-jetbrains-mono',
})

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-white text-black ${poppins.className}`}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-black/10">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded"></div>
            <span className="font-semibold text-base">Shadows</span>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="#features" className="text-sm text-neutral-600 hover:text-black transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-neutral-600 hover:text-black transition-colors">
              Pricing
            </Link>
            <SignInDialog>
              <Button variant="ghost" size="sm" className="text-sm text-neutral-600 hover:text-black hover:bg-transparent">
                Login
              </Button>
            </SignInDialog>
            <SignInDialog>
              <Button size="sm" className="bg-black text-white hover:bg-neutral-800 rounded-md h-8 px-4 text-sm font-medium">
                Signup
              </Button>
            </SignInDialog>
          </nav>
        </div>
      </header>
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl leading-[1.3] font-bold tracking-tight mb-6">
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
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl leading-relaxed">
              Stop paying for overpriced mocks. Train for real interviews with AI that scores your coding, analyzes your communication, and shows you how to improve immediately.
            </p>
            <div className="flex items-center gap-4">
              <SignInDialog>
                <Button size="lg" className="bg-black text-white hover:bg-neutral-800 rounded-md h-11 px-6 text-sm font-medium">
                  Get Started
                </Button>
              </SignInDialog>
            </div>
          </div>
        </div>
      </section>
      <section className="px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
            }}
          >
            <HeroPreview />
          </div>
        </div>
      </section>
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-sm text-neutral-500 mb-8 font-medium tracking-wide uppercase">
            Used by Students AND Engineers from top institutions
          </p>
          <InfiniteCarousel
            items={[
              { src: "/google.png", alt: "Google" },
              { src: "/amazon.svg", alt: "Amazon" },
              { src: "/meta.png", alt: "Meta" },
              { src: "/microsoft.png", alt: "Microsoft" },
              { src: "/openai-logomark.svg", alt: "OpenAI" },
            ]}
            speed={25}
            sizeMultipliers={{
              "google.png": 1.0,
              "meta.png": 2.0,
              "amazon.svg": 1.0,
              "microsoft.png":0.8
            }}
            paddingMultipliers={{
              "google.png": { top: 0, right: 5, bottom: 0, left: 5 },
              "amazon.svg": { top: 15, right: 2, bottom: 0, left: 6 },
              "meta.png": { top: 0, right: 0, bottom: 0, left: 26 },
              "microsoft.png": { top: 0, right: 0, bottom: 0, left: 50 },
              "netflix.png": { top: 0, right: 4, bottom: 0, left: 3 }
            }}
          />
        </div>
      </section>
    </div>
  )
}
