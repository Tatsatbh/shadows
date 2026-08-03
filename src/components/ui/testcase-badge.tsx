import * as React from "react";
import { CheckCircledIcon, CrossCircledIcon, ClockIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export type TestCaseStatus = "pending" | "passed" | "failed" | "running";

export interface TestCaseBadgeProps {
  name: string;
  status: TestCaseStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    icon: ClockIcon,
    label: "Pending",
    bgColor: "bg-gray-100 dark:bg-white/[0.035]",
    textColor: "text-gray-600 dark:text-muted-foreground",
    borderColor: "border-gray-300 dark:border-white/10",
  },
  running: {
    icon: ClockIcon,
    label: "Running",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-500",
    borderColor: "border-blue-300 dark:border-blue-500/25",
  },
  passed: {
    icon: CheckCircledIcon,
    label: "Passed",
    bgColor: "bg-green-50 dark:bg-emerald-500/10",
    textColor: "text-green-600 dark:text-emerald-500",
    borderColor: "border-green-300 dark:border-emerald-500/25",
  },
  failed: {
    icon: CrossCircledIcon,
    label: "Failed",
    bgColor: "bg-red-50 dark:bg-rose-500/10",
    textColor: "text-red-600 dark:text-rose-500",
    borderColor: "border-red-300 dark:border-rose-500/25",
  },
};

export function TestCaseBadge({ name, status, className }: TestCaseBadgeProps) {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      <span className="font-semibold">{name}</span>
      <div className="flex items-center gap-1">
        <IconComponent className={cn("h-3.5 w-3.5", status === "running" && "animate-spin")} />
        <span>{config.label}</span>
      </div>
    </div>
  );
}
