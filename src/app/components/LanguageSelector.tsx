import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const LANGUAGE_OPTIONS = [
  { value: "python", label: "Python (3.8)" },
  { value: "cpp", label: "C++" },
]

type LanguageSelectorProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function LanguageSelector({
  value,
  onChange,
  className,
}: LanguageSelectorProps) {
  return (
    <div className={cn("w-full", className)}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border-white/10 bg-white/5 text-sm font-medium text-white/90">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#1c1930] text-white">
          <SelectGroup>
            <SelectLabel className="text-xs uppercase tracking-[0.25em] text-white/60">
              Language
            </SelectLabel>
            {LANGUAGE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="capitalize"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
