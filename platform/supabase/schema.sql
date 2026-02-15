-- 零一优创·科创引导平台 数据库 Schema
-- 在 Supabase SQL Editor 中执行此脚本

-- ============================================
-- 1. 用户表
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE, -- 关联 Supabase Auth 的 user id
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'parent', 'teacher', 'admin')),
  grade INTEGER CHECK (grade >= 1 AND grade <= 9),
  parent_id UUID REFERENCES users(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. 项目表
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200),
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step >= 1 AND current_step <= 11),
  current_node VARCHAR(50),
  project_type VARCHAR(20) CHECK (project_type IN ('software', 'hardware', 'mixed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. 步骤进度表
-- ============================================
CREATE TABLE step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number >= 1 AND step_number <= 11),
  node_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed', 'needs_review')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  review_note TEXT,
  UNIQUE(project_id, step_number, node_id)
);

-- ============================================
-- 4. AI对话记录表
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  node_id VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. 产出物表
-- ============================================
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  node_id VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'approved', 'revision_needed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. 学生表单提交表
-- ============================================
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  node_id VARCHAR(50) NOT NULL,
  form_type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  ai_evaluation JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 索引
-- ============================================
CREATE INDEX idx_projects_student ON projects(student_id);
CREATE INDEX idx_step_progress_project ON step_progress(project_id);
CREATE INDEX idx_conversations_project_step ON conversations(project_id, step_number, node_id);
CREATE INDEX idx_deliverables_project ON deliverables(project_id);
CREATE INDEX idx_form_submissions_project ON form_submissions(project_id);
CREATE INDEX idx_users_auth ON users(auth_id);
CREATE INDEX idx_users_parent ON users(parent_id);

-- ============================================
-- 自动更新 updated_at 触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER deliverables_updated_at
  BEFORE UPDATE ON deliverables FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER form_submissions_updated_at
  BEFORE UPDATE ON form_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的信息
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth_id = auth.uid());

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth_id = auth.uid());

-- 学生可以管理自己的项目
CREATE POLICY "projects_select_own" ON projects
  FOR SELECT USING (
    student_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "projects_insert_own" ON projects
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "projects_update_own" ON projects
  FOR UPDATE USING (
    student_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- 家长可以查看关联学生的项目
CREATE POLICY "projects_select_parent" ON projects
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM users WHERE parent_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

-- 步骤进度：项目所有者可访问
CREATE POLICY "step_progress_access" ON step_progress
  FOR ALL USING (
    project_id IN (
      SELECT id FROM projects WHERE student_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

-- 对话记录：项目所有者可访问
CREATE POLICY "conversations_access" ON conversations
  FOR ALL USING (
    project_id IN (
      SELECT id FROM projects WHERE student_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

-- 产出物：项目所有者可访问
CREATE POLICY "deliverables_access" ON deliverables
  FOR ALL USING (
    project_id IN (
      SELECT id FROM projects WHERE student_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

-- 表单提交：项目所有者可访问
CREATE POLICY "form_submissions_access" ON form_submissions
  FOR ALL USING (
    project_id IN (
      SELECT id FROM projects WHERE student_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    )
  );
