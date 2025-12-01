"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const FlipImages = ({
  images,
  duration = 3000,
  className,
  imageClassName,
  sizeMultipliers = {},
  paddingMultipliers = {},
}: {
  images: { src: string; alt: string }[];
  duration?: number;
  className?: string;
  imageClassName?: string;
  sizeMultipliers?: Record<string, number>;
  paddingMultipliers?: Record<string, { top?: number; right?: number; bottom?: number; left?: number } | number>;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setIsAnimating(true);
  }, [currentIndex, images.length]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  const currentImage = images[currentIndex];
  
  // Extract filename from src (e.g., "/amazon.png" -> "amazon.png")
  const filename = currentImage.src.split('/').pop() || '';
  
  // Get size multiplier for this filename (default to 1)
  const sizeMultiplier = sizeMultipliers[filename] || 1;
  
  // Get padding multiplier for this filename (default to 0)
  const paddingConfig = paddingMultipliers[filename] || 0;
  const padding = typeof paddingConfig === 'number' 
    ? `${paddingConfig}px`
    : `${paddingConfig.top || 0}px ${paddingConfig.right || 0}px ${paddingConfig.bottom || 0}px ${paddingConfig.left || 0}px`;

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.div
        key={currentIndex}
        initial={{
          opacity: 0,
          y: 10,
          filter: "blur(8px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: sizeMultiplier,
        }}
        exit={{
          opacity: 0,
          y: -20,
          filter: "blur(8px)",
          scale: 0.9 * sizeMultiplier,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        className={cn("inline-block relative", className)}
        style={{
          padding,
        }}
      >
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          width={120}
          height={40}
          className={cn("object-contain", imageClassName)}
          priority
        />
      </motion.div>
    </AnimatePresence>
  );
};
