import type { Project, StepProgress, Deliverable } from "./database";

export type StepStatus = "locked" | "not_started" | "in_progress" | "completed";

export interface StepInfo {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  status: StepStatus;
  progress: StepProgress[];
  deliverables: Deliverable[];
}

export interface ProjectWithProgress extends Project {
  steps: StepInfo[];
  student_name?: string;
}

export const STEP_TITLES: Record<number, { title: string; description: string; icon: string }> = {
  1: { title: "问题发现", description: "从真实生活中发现一个值得解决的问题", icon: "Lightbulb" },
  2: { title: "背景调研", description: "调查问题背景，了解现有解决方案", icon: "Search" },
  3: { title: "需求定义", description: "明确用户需求，定义成功标准", icon: "ClipboardList" },
  4: { title: "方案设计", description: "设计技术方案，规划开发计划", icon: "PenTool" },
  5: { title: "技术学习", description: "学习项目所需的技术知识", icon: "BookOpen" },
  6: { title: "原型开发", description: "动手搭建第一个可运行版本", icon: "Wrench" },
  7: { title: "测试验证", description: "测试方案是否有效，收集数据", icon: "FlaskConical" },
  8: { title: "迭代优化", description: "基于测试结果改进方案", icon: "RefreshCw" },
  9: { title: "文档撰写", description: "撰写研究论文和技术文档", icon: "FileText" },
  10: { title: "展示准备", description: "制作PPT、展板，准备演讲", icon: "Presentation" },
  11: { title: "评审模拟", description: "模拟答辩，完善表达", icon: "Award" },
};
