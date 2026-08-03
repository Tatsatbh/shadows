"use client"

import Image from "next/image"

interface CarouselItem {
  src: string
  alt: string
  className?: string
}

interface InfiniteCarouselProps {
  items: CarouselItem[]
  duration?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  className?: string
  itemClassName?: string
  sizeMultipliers?: Record<string, number>
  paddingMultipliers?: Record<string, { top?: number; right?: number; bottom?: number; left?: number } | number>
}

export function InfiniteCarousel({
  items,
  duration = 32,
  direction = "left",
  pauseOnHover = true,
  className = "",
  itemClassName = "",
  sizeMultipliers = {},
  paddingMultipliers = {},
}: InfiniteCarouselProps) {
  const repeatedItems = [...items, ...items, ...items]

  return (
    <div
      className={`group relative w-full overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] ${className}`}
    >
      <div
        className={`flex w-max items-center gap-12 md:gap-16 ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{
          animation: `${direction === "left" ? "logo-scroll-left" : "logo-scroll-right"} ${duration}s linear infinite`,
        }}
      >
        {repeatedItems.map((item, idx) => {
          const filename = item.src.split("/").pop() || ""
          const sizeMultiplier = sizeMultipliers[filename] || 1
          const paddingConfig = paddingMultipliers[filename] || 0
          const padding = typeof paddingConfig === "number"
            ? `${paddingConfig}px`
            : `${paddingConfig.top || 0}px ${paddingConfig.right || 0}px ${paddingConfig.bottom || 0}px ${paddingConfig.left || 0}px`

          return (
            <div
              key={`${item.alt}-${idx}`}
              className={`flex h-16 min-w-[150px] shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.035] px-8 opacity-70 transition-opacity hover:opacity-100 ${itemClassName}`}
              style={{
                transform: `scale(${sizeMultiplier})`,
                padding,
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={140}
                height={48}
                className={`h-10 w-auto object-contain brightness-0 invert grayscale ${item.className || ""}`}
                priority={idx < items.length}
              />
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes logo-scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }

        @keyframes logo-scroll-right {
          0% {
            transform: translateX(-33.333333%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
