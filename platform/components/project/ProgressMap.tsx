"use client";

import { STEP_TITLES, type StepStatus } from "@/types/project";
import {
  Lightbulb,
  Search,
  ClipboardList,
  PenTool,
  BookOpen,
  Wrench,
  FlaskConical,
  RefreshCw,
  FileText,
  Presentation,
  Award,
  Check,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Lightbulb, Search, ClipboardList, PenTool, BookOpen,
  Wrench, FlaskConical, RefreshCw, FileText, Presentation, Award,
};

interface ProgressMapProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function ProgressMap({ currentStep, onStepClick }: ProgressMapProps) {
  function getStatus(stepNumber: number): StepStatus {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "in_progress";
    return "locked";
  }

  return (
    <div className="space-y-3">
      {Object.entries(STEP_TITLES).map(([num, step], index) => {
        const stepNumber = parseInt(num);
        const status = getStatus(stepNumber);
        const Icon = iconMap[step.icon] || Lightbulb;
        const isLast = index === Object.keys(STEP_TITLES).length - 1;

        return (
          <div key={stepNumber} className="flex gap-3">
            {/* Timeline line + circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  status === "completed" && "bg-success text-white",
                  status === "in_progress" && "bg-primary text-white shadow-md shadow-primary/25",
                  status === "not_started" && "bg-muted text-muted-foreground",
                  status === "locked" && "bg-muted/50 text-muted-foreground/50"
                )}
              >
                {status === "completed" ? (
                  <Check className="w-4 h-4" />
                ) : status === "locked" ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[12px] mt-1",
                    status === "completed" ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <button
              onClick={() => status !== "locked" && onStepClick?.(stepNumber)}
              disabled={status === "locked"}
              className={cn(
                "flex-1 text-left pb-3 transition-opacity",
                status === "locked" && "opacity-40 cursor-not-allowed",
                status !== "locked" && "cursor-pointer hover:opacity-80"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    status === "in_progress" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  第{stepNumber}步
                </span>
                {status === "in_progress" && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    进行中
                  </span>
                )}
              </div>
              <h3
                className={cn(
                  "font-medium mt-0.5",
                  status === "in_progress" && "text-primary"
                )}
              >
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {step.description}
              </p>
            </button>
          </div>
        );
      })}
    </div>
  );
}
