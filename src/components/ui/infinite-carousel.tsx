"use client"

import Image from "next/image"

interface CarouselItem {
  src: string
  alt: string
}

interface InfiniteCarouselProps {
  items: CarouselItem[]
  speed?: number
  sizeMultipliers?: Record<string, number>
  paddingMultipliers?: Record<string, { top?: number; right?: number; bottom?: number; left?: number } | number>
}

export function InfiniteCarousel({ items, speed = 25, sizeMultipliers = {}, paddingMultipliers = {} }: InfiniteCarouselProps) {
  return (
    <div className="relative w-full overflow-hidden py-6">
      <div 
        className="flex gap-16 items-center"
        style={{
          animation: `scroll ${speed}s linear infinite`,
          width: 'max-content'
        }}
      >
        {/* Render items twice for seamless loop */}
        {[...items, ...items].map((item, idx) => {
          const filename = item.src.split('/').pop() || ''
          const sizeMultiplier = sizeMultipliers[filename] || 1
          const paddingConfig = paddingMultipliers[filename] || 0
          const padding = typeof paddingConfig === 'number' 
            ? `${paddingConfig}px`
            : `${paddingConfig.top || 0}px ${paddingConfig.right || 0}px ${paddingConfig.bottom || 0}px ${paddingConfig.left || 0}px`
          
          return (
            <div
              key={idx}
              className="flex-shrink-0 flex items-center justify-center grayscale opacity-50"
              style={{
                transform: `scale(${sizeMultiplier})`,
                padding
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={140}
                height={48}
                className="h-12 w-auto object-contain"
                priority={idx < items.length}
              />
            </div>
          )
        })}
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
