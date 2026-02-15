export type UserRole = "student" | "parent" | "teacher" | "admin";

export type ProjectStatus = "active" | "paused" | "completed" | "archived";

export type ProjectType = "software" | "hardware" | "mixed";

export type StepProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "needs_review";

export type DeliverableStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "revision_needed";

export type ConversationRole = "user" | "assistant" | "system";

export interface User {
  id: string;
  phone: string | null;
  email: string | null;
  name: string;
  role: UserRole;
  grade: number | null;
  parent_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  student_id: string;
  title: string | null;
  description: string | null;
  status: ProjectStatus;
  current_step: number;
  current_node: string | null;
  project_type: ProjectType | null;
  created_at: string;
  updated_at: string;
}

export interface StepProgress {
  id: string;
  project_id: string;
  step_number: number;
  node_id: string;
  status: StepProgressStatus;
  started_at: string | null;
  completed_at: string | null;
  reviewed_by: string | null;
  review_note: string | null;
}

export interface Conversation {
  id: string;
  project_id: string;
  step_number: number;
  node_id: string;
  role: ConversationRole;
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Deliverable {
  id: string;
  project_id: string;
  step_number: number;
  node_id: string;
  type: string;
  title: string;
  content: Record<string, unknown>;
  version: number;
  status: DeliverableStatus;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  project_id: string;
  step_number: number;
  node_id: string;
  form_type: string;
  data: Record<string, unknown>;
  ai_evaluation: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
