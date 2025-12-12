'use client'

import { ArrowRight } from 'lucide-react'
import { forwardRef } from 'react'

interface TerminalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

const TerminalButton = forwardRef<HTMLButtonElement, TerminalButtonProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          group relative inline-flex items-center gap-3
          px-6 py-3 font-mono text-sm tracking-wider
          bg-black text-neutral-300 
          border border-neutral-800 rounded-none
          transition-all duration-200 ease-out
          hover:text-white hover:border-white
          hover:shadow-[0_0_20px_rgba(255,255,255,0.15),0_0_40px_rgba(255,255,255,0.05)]
          active:scale-95 active:shadow-none
          focus:outline-none focus:ring-1 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-black
          ${className}
        `}
        {...props}
      >
        <span className="relative">
          <span className="text-neutral-500 group-hover:text-neutral-400 transition-colors">[</span>
          {children || 'REQUEST_ACCESS'}
          <span className="text-neutral-500 group-hover:text-neutral-400 transition-colors">]</span>
        </span>
        <ArrowRight 
          className="w-4 h-4 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200" 
        />
      </button>
    )
  }
)

TerminalButton.displayName = 'TerminalButton'

export { TerminalButton }
