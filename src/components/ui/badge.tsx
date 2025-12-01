import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        // Inverted: light mode uses white bg, colored text + outline
        default:
          "bg-white text-primary border-primary [a&]:hover:bg-primary/10 dark:bg-transparent dark:text-primary dark:border-primary",
        secondary:
          "bg-white text-green-600 border-green-600 [a&]:hover:bg-green-50 dark:bg-transparent dark:text-green-400 dark:border-green-400 dark:[a&]:hover:bg-green-400/10",
        destructive:
          "bg-white text-destructive border-destructive [a&]:hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-transparent dark:text-destructive dark:border-destructive",
        outline:
          "bg-white text-foreground border-foreground [a&]:hover:bg-accent/30 [a&]:hover:text-foreground dark:bg-transparent dark:text-foreground dark:border-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
