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
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-600 dark:text-gray-400",
    borderColor: "border-gray-300 dark:border-gray-600",
  },
  running: {
    icon: ClockIcon,
    label: "Running",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-300 dark:border-blue-600",
  },
  passed: {
    icon: CheckCircledIcon,
    label: "Passed",
    bgColor: "bg-green-50 dark:bg-green-950",
    textColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-300 dark:border-green-600",
  },
  failed: {
    icon: CrossCircledIcon,
    label: "Failed",
    bgColor: "bg-red-50 dark:bg-red-950",
    textColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-300 dark:border-red-600",
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
