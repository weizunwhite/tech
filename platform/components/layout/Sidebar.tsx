"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
};

interface SidebarProps {
  projectId: string;
  currentStep: number;
  stepStatuses?: Record<number, StepStatus>;
}

export function Sidebar({ projectId, currentStep, stepStatuses = {} }: SidebarProps) {
  const pathname = usePathname();

  function getStepStatus(stepNumber: number): StepStatus {
    if (stepStatuses[stepNumber]) return stepStatuses[stepNumber];
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "in_progress";
    return "locked";
  }

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-3.5rem)] p-4 hidden md:block">
      <nav className="space-y-1">
        {Object.entries(STEP_TITLES).map(([num, step]) => {
          const stepNumber = parseInt(num);
          const status = getStepStatus(stepNumber);
          const Icon = iconMap[step.icon] || Lightbulb;
          const isActive = pathname.includes(`/step/${stepNumber}`);
          const isLocked = status === "locked";

          return (
            <Link
              key={stepNumber}
              href={isLocked ? "#" : `/project/${projectId}/step/${stepNumber}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive && "bg-primary/10 text-primary font-medium",
                !isActive && !isLocked && "hover:bg-muted",
                isLocked && "opacity-40 cursor-not-allowed"
              )}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                  status === "completed" && "bg-success text-white",
                  status === "in_progress" && "bg-primary text-white",
                  status === "not_started" && "bg-muted text-muted-foreground",
                  status === "locked" && "bg-muted text-muted-foreground"
                )}
              >
                {status === "completed" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : status === "locked" ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="truncate">{step.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
