# 零一优创·科创引导平台 — 技术开发规划

## 一、技术选型

### 推荐技术栈（基于你的现有经验）

| 层面 | 技术 | 理由 |
|------|------|------|
| 前端 | Next.js 14 + TypeScript | 你已经在用，不需要重新学 |
| UI组件 | shadcn/ui + Tailwind CSS | 开发速度快，设计质量高 |
| 后端 | Next.js API Routes + Server Actions | 前后端统一，减少复杂度 |
| 数据库 | Supabase (PostgreSQL) | 自带认证、实时订阅、文件存储，免运维 |
| AI引擎 | Claude API (Anthropic) | 引导对话的核心，你已经熟悉 |
| 文件存储 | Supabase Storage | 学生上传的图片、文档等 |
| 文档生成 | 服务端 Python 脚本（docx/pptx） | 复用你已有的AI技能 |
| 部署 | Vercel | Next.js原生支持，零配置部署 |
| 支付 | 微信支付 / 支付宝（后期接入） | 国内用户必须 |

---

## 二、MVP范围定义

### 核心原则：只做能验证商业模式的最小功能集

### MVP只包含：
- ✅ 学生注册/登录
- ✅ 第1步：问题发现（AI引导对话 + 结构化表单）
- ✅ 第2步：背景调研（AI辅助搜索和整理）
- ✅ 第3步：需求定义（结构化画布）
- ✅ 第4步：方案设计（AI技术建议 + 方案文档）
- ✅ 项目仪表盘（进度可视化）
- ✅ 产出物管理（每步的文档保存和查看）
- ✅ 简易家长查看页面

### MVP不包含（后期迭代）：
- ❌ 在线代码编辑器（第6步）
- ❌ 支付系统
- ❌ 教师管理后台
- ❌ 案例库
- ❌ PPT/展板自动生成
- ❌ 模拟答辩
- ❌ 移动端适配

---

## 三、数据库设计

### 核心表结构

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student', -- student, parent, teacher, admin
  grade INTEGER, -- 年级 (3-9)
  parent_id UUID REFERENCES users(id), -- 学生关联的家长
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 项目表
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(200), -- 项目标题（可能在进行中才确定）
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, paused, completed, archived
  current_step INTEGER NOT NULL DEFAULT 1, -- 当前在第几步 (1-11)
  current_node VARCHAR(50), -- 当前在哪个节点 (如 "1.1", "1.2")
  project_type VARCHAR(20), -- software, hardware, mixed（在第4步确定）
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 步骤进度表
CREATE TABLE step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  step_number INTEGER NOT NULL, -- 1-11
  node_id VARCHAR(50) NOT NULL, -- 如 "1.1", "1.2", "1.3"
  status VARCHAR(20) NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed, needs_review
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id), -- 人工审核的老师
  review_note TEXT
);

-- AI对话记录表
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  step_number INTEGER NOT NULL,
  node_id VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  metadata JSONB, -- 存储额外信息，如AI评估结果
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 产出物表
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  step_number INTEGER NOT NULL,
  node_id VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL, -- problem_description, research_report, requirement_doc, design_doc 等
  title VARCHAR(200) NOT NULL,
  content JSONB NOT NULL, -- 结构化内容
  version INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, submitted, approved, revision_needed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学生表单提交表（结构化输入）
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  step_number INTEGER NOT NULL,
  node_id VARCHAR(50) NOT NULL,
  form_type VARCHAR(50) NOT NULL, -- life_observation, problem_selection, user_persona 等
  data JSONB NOT NULL, -- 表单数据
  ai_evaluation JSONB, -- AI的评估结果
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 四、核心页面结构

```
/                           → 落地页（平台介绍、案例展示、注册入口）
/login                      → 登录页（手机号 + 验证码）
/register                   → 注册页（角色选择：学生/家长）

/dashboard                  → 学生仪表盘（我的项目列表、进度概览）
/project/new                → 创建新项目
/project/[id]               → 项目主页（进度地图 + 当前任务）
/project/[id]/step/[n]      → 步骤详情页（AI引导 + 表单 + 产出物）
/project/[id]/deliverables  → 所有产出物汇总
/project/[id]/export        → 导出竞赛材料包

/parent/[id]                → 家长查看页（孩子的项目进度和成果）
```

---

## 五、AI引导系统设计

### 系统架构

```
用户输入 → 上下文构建器 → Claude API → 响应处理器 → 前端展示
                ↑                              ↓
          项目上下文                      评估 & 存储
          步骤配置
          引导话术库
```

### 步骤配置文件结构

每一步的AI引导行为由一个配置文件控制：

```typescript
// types/step-config.ts

interface StepConfig {
  stepNumber: number;
  title: string;
  description: string;
  nodes: NodeConfig[];
}

interface NodeConfig {
  nodeId: string;           // "1.1", "1.2" 等
  title: string;
  type: 'conversation' | 'form' | 'review' | 'generation';
  
  // AI引导配置
  aiConfig: {
    systemPrompt: string;     // 这个节点的AI系统提示词
    maxTurns: number;         // 最大对话轮数
    evaluationCriteria: EvaluationCriteria[];  // AI评估标准
    hintLevels: HintLevel[];  // 分层提示
    escalationTrigger: string; // 什么条件触发人工介入
  };

  // 表单配置（type为form时）
  formConfig?: {
    fields: FormField[];
    validationRules: ValidationRule[];
  };

  // 产出物配置
  deliverable?: {
    type: string;
    template: string;         // 产出物模板
    autoGenerate: boolean;    // 是否由AI自动生成初稿
  };

  // 过关条件
  completionCriteria: {
    type: 'ai_evaluation' | 'form_complete' | 'manual_review';
    threshold?: number;        // AI评分阈值 (0-1)
  };
}

interface HintLevel {
  level: number;              // 1, 2, 3
  trigger: string;            // 触发条件描述
  type: 'ai_hint' | 'example' | 'human_intervention';
  content?: string;           // 提示内容（AI提示时）
}
```

### 第1步的配置示例

```typescript
// configs/steps/step-1-problem-discovery.ts

export const step1Config: StepConfig = {
  stepNumber: 1,
  title: "问题发现",
  description: "从真实生活中发现一个值得解决的问题",
  nodes: [
    {
      nodeId: "1.1",
      title: "生活观察",
      type: "form",
      aiConfig: {
        systemPrompt: `你是一位科创教育引导老师，正在帮助一位小学/初中学生从生活中发现问题。

你的角色：
- 你是引导者，不是解答者
- 用鼓励的、好奇的语气和学生对话
- 语言要简单易懂，适合9-15岁的孩子
- 绝不替学生想问题，只帮助他们深入思考自己发现的问题

当前任务：引导学生观察生活中的不便之处，写下至少3个候选问题。

如果学生写的问题太笼统（如"环境污染"），追问让他具体化：
- "你在哪里遇到了这个问题？"
- "能描述一个具体的场景吗？"
- "这个问题多久会出现一次？"

如果学生写的问题太小（如"橡皮老是掉地上"），不要否定，但引导他思考：
- "这个问题除了你，还有别人也会遇到吗？"
- "有没有更让你困扰的事情？"

如果学生完全想不出来，按以下顺序给出启发（不要一次性全给）：
1. "想想你在学校里有什么不方便的事？"
2. "家里的老人有没有什么困难是你想帮他们解决的？"
3. "上下学的路上有没有什么让你觉得可以改进的？"`,
        maxTurns: 15,
        evaluationCriteria: [
          {
            dimension: "specificity",
            description: "问题描述是否具体，有明确的场景、人物和痛点",
            weight: 0.3
          },
          {
            dimension: "authenticity", 
            description: "是否来自真实的生活体验而非凭空想象",
            weight: 0.3
          },
          {
            dimension: "solvability",
            description: "问题是否在学生能力范围内有改善空间",
            weight: 0.2
          },
          {
            dimension: "originality",
            description: "是否有一定的独特视角，不是最常见的老生常谈",
            weight: 0.2
          }
        ],
        hintLevels: [
          {
            level: 1,
            trigger: "学生沉默超过3分钟或表示想不出来",
            type: "ai_hint",
            content: "给出一个生活场景方向（如学校、家庭、出行）"
          },
          {
            level: 2,
            trigger: "给出场景提示后仍然无法产出",
            type: "example",
            content: "展示一个同龄学生的选题过程（脱敏案例）"
          },
          {
            level: 3,
            trigger: "尝试2轮提示后仍无进展",
            type: "human_intervention",
            content: "标记需要老师介入，发送通知"
          }
        ],
        escalationTrigger: "连续3轮对话无实质性进展"
      },
      formConfig: {
        fields: [
          {
            name: "observations",
            type: "array",
            minItems: 3,
            maxItems: 5,
            itemFields: [
              { name: "scene", label: "在哪里（场景）", type: "text", required: true },
              { name: "who", label: "谁遇到了这个问题", type: "text", required: true },
              { name: "problem", label: "具体是什么问题", type: "textarea", required: true },
              { name: "current_solution", label: "现在怎么解决的", type: "textarea", required: true }
            ]
          }
        ],
        validationRules: [
          { rule: "minItems", value: 3, message: "请至少写下3个生活中的问题" }
        ]
      },
      deliverable: {
        type: "life_observations",
        template: "life-observation-template",
        autoGenerate: false
      },
      completionCriteria: {
        type: "form_complete"
      }
    },
    {
      nodeId: "1.2",
      title: "问题筛选",
      type: "conversation",
      aiConfig: {
        systemPrompt: `你是科创教育引导老师。学生已经写下了几个生活中发现的问题，现在需要帮助他选择一个最适合做成科创项目的问题。

你需要做的：
1. 逐个分析学生提出的每个问题，从以下维度给出你的看法：
   - 真实性：这个问题是否真实存在？
   - 普遍性：有多少人会遇到类似问题？
   - 可行性：以学生的水平能做出解决方案吗？
   - 创新空间：现有解决方案是否有明显不足？

2. 给出你的建议排序，但一定要说明理由
3. 最终让学生自己决定选哪个，尊重他的选择
4. 如果学生选了你不太看好的那个，不要否定，而是提醒他可能遇到的挑战

语气：像一个友善的学长在和学弟学妹讨论，不是老师在打分。`,
        maxTurns: 10,
        evaluationCriteria: [
          {
            dimension: "selection_quality",
            description: "最终选定的问题是否具有足够的项目潜力",
            weight: 0.5
          },
          {
            dimension: "reasoning",
            description: "学生是否能说出选择这个问题的理由",
            weight: 0.5
          }
        ],
        hintLevels: [
          {
            level: 1,
            trigger: "学生在多个选项间犹豫不决",
            type: "ai_hint",
            content: "引导学生思考'哪个问题你最想解决、最有动力去做'"
          }
        ],
        escalationTrigger: "学生对所有选项都不满意，要重新开始"
      },
      deliverable: {
        type: "problem_selection",
        template: "problem-selection-template",
        autoGenerate: true
      },
      completionCriteria: {
        type: "ai_evaluation",
        threshold: 0.6
      }
    },
    {
      nodeId: "1.3",
      title: "问题深化",
      type: "conversation",
      aiConfig: {
        systemPrompt: `你是科创教育引导老师。学生已经选定了一个问题，现在需要帮助他深入理解这个问题。

通过对话引导学生思考：
1. 这个问题影响了哪些人？大概有多少人？
2. 如果不解决这个问题，会有什么后果？
3. 你觉得最理想的解决方案应该是什么样的？
4. 你为什么特别想解决这个问题？（个人动机）

每次只问一个问题，等学生回答后再继续。不要一次性把所有问题抛出来。

最终目标：帮助学生写出一段300-500字的问题描述，包含问题的背景、影响、现状和他的思考。

注意：这段描述必须是学生自己的语言，你可以帮他理清思路，但不要替他写。如果学生的表达不够好，鼓励他用自己的话说，不要追求"完美的表达"。`,
        maxTurns: 15,
        evaluationCriteria: [
          {
            dimension: "depth",
            description: "问题分析是否有深度，不停留在表面",
            weight: 0.3
          },
          {
            dimension: "completeness",
            description: "是否覆盖了问题的背景、影响、现状",
            weight: 0.3
          },
          {
            dimension: "student_voice",
            description: "是否保持了学生自己的语言风格",
            weight: 0.4
          }
        ],
        hintLevels: [],
        escalationTrigger: "学生无法深入分析问题"
      },
      deliverable: {
        type: "problem_description",
        template: "problem-description-template",
        autoGenerate: true
      },
      completionCriteria: {
        type: "ai_evaluation",
        threshold: 0.7
      }
    }
  ]
};
```

---

## 六、开发阶段规划

### Phase 1：基础框架（第1-2周）

**目标：** 搭建项目骨架，跑通从注册到进入项目的基本流程

**任务清单：**
```
1. 初始化 Next.js 项目 + TypeScript + Tailwind + shadcn/ui
2. 配置 Supabase
   - 创建数据库表（上面的SQL）
   - 配置认证（手机号登录，先用邮箱登录做开发测试）
   - 配置 Row Level Security（RLS）
3. 基础页面搭建
   - 落地页（简单介绍 + 注册入口）
   - 登录/注册页
   - 学生仪表盘（项目列表）
   - 创建新项目流程
4. 基础布局组件
   - 导航栏
   - 侧边栏（项目内）
   - 进度指示器（11步可视化）
```

### Phase 2：AI引导核心（第3-4周）

**目标：** 实现第1步（问题发现）的完整AI引导体验

**任务清单：**
```
1. AI对话引擎
   - Claude API 集成
   - 上下文管理器（维护对话历史 + 项目上下文 + 步骤配置）
   - 流式响应（打字机效果）
   - 对话持久化（保存到conversations表）
2. 步骤配置加载系统
   - 读取步骤配置文件
   - 根据当前节点加载对应的AI配置
3. 节点1.1：生活观察
   - AI对话界面
   - 结构化表单（场景、人物、问题、现有方案）
   - 表单验证
   - AI对表单内容的评价反馈
4. 节点1.2：问题筛选
   - 加载学生在1.1提交的问题列表
   - AI分析和建议对话
   - 学生选择确认
5. 节点1.3：问题深化
   - 深度对话引导
   - 问题描述文档生成
   - AI质量评估
6. 步骤完成流转
   - 节点完成判定逻辑
   - 自动进入下一节点
   - 步骤完成后解锁下一步
```

### Phase 3：扩展步骤（第5-7周）

**目标：** 实现第2-4步

**任务清单：**
```
1. 第2步：背景调研
   - AI辅助网络搜索（调用搜索API）
   - 调研信息整理界面
   - 学生总结输入
   - 调研报告自动生成
2. 第3步：需求定义
   - 用户画像画布（结构化表单）
   - 功能需求列表（可拖拽排优先级）
   - 成功标准定义
   - 需求规格文档生成
3. 第4步：方案设计
   - AI技术选型推荐
   - 系统架构图（简易可视化）
   - 材料清单生成
   - 开发计划时间表
4. 产出物管理
   - 统一的产出物查看页
   - 版本历史
   - 导出功能（Markdown / PDF）
```

### Phase 4：体验完善（第8-9周）

**目标：** 完善用户体验，准备测试

**任务清单：**
```
1. 家长查看页
   - 项目进度可视化
   - 每步产出物浏览
   - 通知功能（孩子完成阶段时通知家长）
2. 项目仪表盘增强
   - 进度地图（可视化11步）
   - 当前任务卡片
   - 历史对话回顾
3. 人工介入机制
   - 标记"需要帮助"按钮
   - 教师通知（可以先用邮件/微信通知）
   - 教师审核和反馈入口
4. 体验优化
   - 加载状态
   - 错误处理
   - 对话体验优化（打字机效果、思考中提示）
   - 移动端基本适配
```

### Phase 5：测试与迭代（第10-12周）

**目标：** 真实用户测试，收集反馈

**任务清单：**
```
1. 内测准备
   - 测试账号创建
   - 测试数据准备
   - 已知问题修复
2. 邀请3-5个学生内测
   - 跟踪使用过程
   - 记录AI引导效果
   - 收集学生和家长反馈
3. 基于反馈迭代
   - 调整AI提示词
   - 优化交互流程
   - 修复bug
```

---

## 七、关键技术实现要点

### 1. AI上下文管理

```typescript
// lib/ai/context-builder.ts

interface AIContext {
  // 系统级上下文
  systemPrompt: string;
  
  // 项目上下文
  projectInfo: {
    title: string;
    currentStep: number;
    currentNode: string;
    studentGrade: number;
  };
  
  // 历史上下文
  previousDeliverables: Deliverable[]; // 之前步骤的产出物
  currentConversation: Message[];       // 当前节点的对话历史
  formSubmissions: FormSubmission[];    // 当前节点的表单提交
  
  // 步骤配置
  nodeConfig: NodeConfig;
}

async function buildContext(
  projectId: string, 
  stepNumber: number, 
  nodeId: string
): Promise<AIContext> {
  // 1. 加载步骤配置
  const nodeConfig = getNodeConfig(stepNumber, nodeId);
  
  // 2. 加载项目信息
  const project = await getProject(projectId);
  
  // 3. 加载之前步骤的产出物（给AI必要的上下文）
  const deliverables = await getDeliverables(projectId, stepNumber);
  
  // 4. 加载当前节点的对话历史
  const conversation = await getConversation(projectId, stepNumber, nodeId);
  
  // 5. 组装上下文
  return {
    systemPrompt: buildSystemPrompt(nodeConfig, project, deliverables),
    projectInfo: { ... },
    previousDeliverables: deliverables,
    currentConversation: conversation,
    formSubmissions: await getFormSubmissions(projectId, stepNumber, nodeId),
    nodeConfig
  };
}

function buildSystemPrompt(
  nodeConfig: NodeConfig, 
  project: Project, 
  deliverables: Deliverable[]
): string {
  let prompt = nodeConfig.aiConfig.systemPrompt;
  
  // 注入学生年级信息，调整语言难度
  prompt += `\n\n学生信息：${project.studentGrade}年级学生。请根据该年龄段调整你的语言复杂度。`;
  
  // 注入之前步骤的产出物摘要
  if (deliverables.length > 0) {
    prompt += `\n\n该学生之前的工作成果：\n`;
    deliverables.forEach(d => {
      prompt += `- ${d.title}: ${JSON.stringify(d.content).slice(0, 500)}\n`;
    });
  }
  
  return prompt;
}
```

### 2. AI评估机制

```typescript
// lib/ai/evaluator.ts

async function evaluateNodeCompletion(
  projectId: string,
  stepNumber: number,
  nodeId: string
): Promise<EvaluationResult> {
  const nodeConfig = getNodeConfig(stepNumber, nodeId);
  const criteria = nodeConfig.aiConfig.evaluationCriteria;
  
  // 收集需要评估的内容
  const conversation = await getConversation(projectId, stepNumber, nodeId);
  const submissions = await getFormSubmissions(projectId, stepNumber, nodeId);
  const deliverables = await getDeliverables(projectId, stepNumber);
  
  // 构建评估提示词
  const evaluationPrompt = `
    请作为科创教育专家，评估以下学生的工作成果。
    
    评估维度：
    ${criteria.map(c => `- ${c.dimension} (权重${c.weight}): ${c.description}`).join('\n')}
    
    学生对话记录：
    ${formatConversation(conversation)}
    
    学生提交的表单：
    ${JSON.stringify(submissions)}
    
    请对每个维度给出0-1的评分和简短理由。
    以JSON格式返回。
  `;
  
  const result = await callClaude(evaluationPrompt);
  return parseEvaluationResult(result, criteria);
}
```

### 3. 项目目录结构

```
project-root/
├── app/
│   ├── layout.tsx                    # 全局布局
│   ├── page.tsx                      # 落地页
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (student)/
│   │   ├── dashboard/page.tsx        # 学生仪表盘
│   │   ├── project/
│   │   │   ├── new/page.tsx          # 创建新项目
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # 项目主页
│   │   │       ├── step/
│   │   │       │   └── [step]/page.tsx  # 步骤引导页
│   │   │       ├── deliverables/page.tsx
│   │   │       └── export/page.tsx
│   ├── (parent)/
│   │   └── [id]/page.tsx             # 家长查看页
│   └── api/
│       ├── ai/
│       │   ├── chat/route.ts         # AI对话端点
│       │   └── evaluate/route.ts     # AI评估端点
│       ├── projects/
│       │   └── route.ts
│       └── deliverables/
│           └── route.ts
├── components/
│   ├── ui/                           # shadcn组件
│   ├── chat/
│   │   ├── ChatWindow.tsx            # AI对话窗口
│   │   ├── ChatMessage.tsx           # 单条消息
│   │   └── ChatInput.tsx             # 输入框
│   ├── forms/
│   │   ├── ObservationForm.tsx       # 生活观察表单
│   │   ├── UserPersonaForm.tsx       # 用户画像表单
│   │   └── RequirementForm.tsx       # 需求表单
│   ├── project/
│   │   ├── ProgressMap.tsx           # 11步进度地图
│   │   ├── StepCard.tsx              # 步骤卡片
│   │   └── DeliverableCard.tsx       # 产出物卡片
│   └── layout/
│       ├── Navbar.tsx
│       └── Sidebar.tsx
├── configs/
│   └── steps/
│       ├── step-1-problem-discovery.ts
│       ├── step-2-research.ts
│       ├── step-3-requirements.ts
│       └── step-4-design.ts
├── lib/
│   ├── ai/
│   │   ├── context-builder.ts        # AI上下文构建
│   │   ├── evaluator.ts              # AI评估
│   │   └── client.ts                 # Claude API客户端
│   ├── supabase/
│   │   ├── client.ts                 # Supabase客户端
│   │   └── types.ts                  # 数据库类型
│   └── utils/
│       └── format.ts
├── types/
│   ├── step-config.ts                # 步骤配置类型
│   ├── project.ts                    # 项目类型
│   └── deliverable.ts                # 产出物类型
└── public/
    └── images/
```

---

## 八、给 Claude Code 的开发指令

### 启动项目时的第一条指令：

```
我正在开发一个科创教育引导平台（零一优创）。请阅读以下两个文件了解项目背景：
1. platform-framework.md — 产品框架文档
2. tech-development-plan.md — 技术开发规划

请从 Phase 1 开始，帮我：
1. 初始化 Next.js 14 项目，配置 TypeScript、Tailwind CSS、shadcn/ui
2. 配置 Supabase 连接
3. 创建数据库表结构（使用规划文档中的SQL）
4. 搭建基础页面路由和布局组件

设计风格：温暖的配色方案，避免典型的科技蓝，适合面向中小学生和家长的教育产品。
```

### Phase 2 的指令：

```
现在进入 Phase 2，实现AI引导核心功能。

请参考 tech-development-plan.md 中的：
- AI上下文管理代码
- 步骤配置文件结构
- 第1步的完整配置示例

帮我实现：
1. AI对话引擎（Claude API集成 + 上下文管理 + 流式响应）
2. 步骤配置加载系统
3. 第1步的3个节点（生活观察、问题筛选、问题深化）的完整交互
4. 对话持久化和表单提交存储

核心要求：AI必须扮演引导者角色，永远不替学生给出答案。
```

---

## 九、环境配置

### 需要的环境变量

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 开发环境准备

```bash
# 1. 创建项目
npx create-next-app@latest lingyiyouchuang --typescript --tailwind --eslint --app --src-dir=false

# 2. 安装依赖
cd lingyiyouchuang
npx shadcn@latest init
npm install @supabase/supabase-js @anthropic-ai/sdk
npm install lucide-react

# 3. 配置环境变量
cp .env.example .env.local
# 填入实际的密钥

# 4. 启动开发
npm run dev
```
