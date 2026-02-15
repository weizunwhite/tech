# 零一优创·科创引导平台 — 开发进度清单

> 本文档是平台开发的执行清单。每完成一项任务，在前面的 `[ ]` 改为 `[x]` 表示已完成。
>
> 技术栈：Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + Supabase + Claude API + Vercel

---

## 项目结构

```
tech/
├── docs/              (已有 - 规划文档)
├── skills/            (已有 - AI技能)
├── platform/          (新建 - Next.js 应用)
│   ├── app/           # 页面路由
│   ├── components/    # UI组件
│   ├── configs/       # 步骤配置
│   ├── lib/           # 工具库
│   ├── types/         # 类型定义
│   └── supabase/      # 数据库脚本
└── README.md
```

---

## Phase 1：基础框架（预计2周）

> 目标：搭建项目骨架，跑通从注册到进入项目的基本流程

### 1.1 项目初始化

- [x] 在 `platform/` 目录创建 Next.js 14 项目（TypeScript + Tailwind CSS + App Router）
- [x] 初始化 shadcn/ui，配置温暖配色主题
- [x] 安装核心依赖（`@supabase/supabase-js`, `@supabase/ssr`, `@anthropic-ai/sdk`, `lucide-react`）
- [x] 创建 `.env.local.example` 环境变量模板
- [x] 验证 `npm run dev` 可以正常启动

### 1.2 设计系统 & 主题

- [x] 配置品牌色（暖橙 #FF8C42、温暖绿 #4CAF50、米黄 #FFF3E0、深灰 #333）
- [x] 自定义 `tailwind.config.ts` 添加品牌色和中文友好的行间距
- [x] 配置 shadcn/ui CSS 变量与品牌色匹配
- [x] 设置全局字体（中文：Noto Sans SC / 系统默认，英文：Inter）
- [x] 安装常用 shadcn/ui 组件（Button, Card, Input, Form, Dialog, Avatar, Badge, Tabs, Progress）

### 1.3 TypeScript 类型定义

- [x] `types/database.ts` — 数据库表映射类型（User, Project, StepProgress, Conversation, Deliverable, FormSubmission）
- [x] `types/step-config.ts` — 步骤配置类型（StepConfig, NodeConfig, AIConfig, HintLevel, EvaluationCriteria, FormField）
- [x] `types/project.ts` — 业务组合类型（ProjectWithProgress, StepStatus 等）

### 1.4 Supabase 集成

- [x] `supabase/schema.sql` — 完整建表 SQL + RLS 安全策略 + 索引
- [x] `lib/supabase/client.ts` — 浏览器端 Supabase 客户端
- [x] `lib/supabase/server.ts` — 服务端 Supabase 客户端（Server Components / Route Handlers）
- [x] `lib/supabase/middleware.ts` — Auth Session 刷新中间件
- [x] `middleware.ts` — Next.js 中间件（保护需登录的路由，未登录跳转 /login）

### 1.5 认证系统

- [x] `/login` 页面 — 邮箱+密码登录表单（MVP阶段，后续改手机验证码）
- [x] `/register` 页面 — 注册表单（角色选择：学生/家长、姓名、年级等）
- [x] 登录成功后根据角色跳转（学生→/dashboard，家长→/parent/[id]）
- [x] 登出功能
- [x] Auth 错误提示（密码错误、邮箱已注册等）

### 1.6 布局组件

- [x] `components/layout/Navbar.tsx` — 顶部导航栏（Logo、用户头像、退出按钮）
- [x] `components/layout/Sidebar.tsx` — 项目内侧边栏（11步列表 + 当前步骤高亮 + 完成/锁定状态）
- [x] `app/layout.tsx` — 根布局（字体、全局样式）
- [x] `app/(student)/layout.tsx` — 学生区域布局（带 Navbar）
- [x] `app/(student)/project/[id]/layout.tsx` — 项目布局（带 Sidebar）

### 1.7 核心页面

- [x] `/` 落地页 — 平台介绍、核心卖点（AI引导 + 11步方法论 + 竞赛产出）、案例展示区、注册CTA按钮
- [x] `/dashboard` 学生仪表盘 — 我的项目列表（卡片式）、创建新项目入口、空状态引导
- [x] `/project/new` 创建项目 — 简单表单（项目名称可选、简短描述）、创建后跳转到项目主页
- [x] `/project/[id]` 项目主页 — 11步进度地图 + 当前任务卡片 + 产出物摘要
- [x] `/project/[id]/step/[step]` 步骤页 — 左右分栏布局（左：AI对话区，右：表单/内容区），Phase 1 先做静态骨架
- [x] `/project/[id]/deliverables` 产出物列表 — 按步骤分组展示所有产出物
- [x] `/parent/[id]` 家长查看页 — 孩子的项目进度和产出物（只读视图）

### 1.8 项目进度组件

- [x] `components/project/ProgressMap.tsx` — 11步进度地图可视化（竖向时间线或步骤条，支持3种状态：已完成✓、进行中●、未解锁🔒）
- [x] `components/project/StepCard.tsx` — 步骤卡片（标题、描述、状态、子节点进度、进入按钮）
- [x] `components/project/ProjectCard.tsx` — 仪表盘中的项目卡片（项目名、当前步骤、进度百分比）
- [x] `components/project/DeliverableCard.tsx` — 产出物卡片（类型图标、标题、状态、查看按钮）

### 1.9 AI对话组件（骨架）

- [x] `components/chat/ChatWindow.tsx` — 对话窗口容器（消息列表 + 输入框 + 自动滚动）
- [x] `components/chat/ChatMessage.tsx` — 单条消息气泡（区分用户/AI、时间戳、温暖的气泡样式）
- [x] `components/chat/ChatInput.tsx` — 输入框（文本输入 + 发送按钮，后续加图片上传）

### 1.10 步骤配置系统

- [x] `configs/steps/step-1-problem-discovery.ts` — 第1步完整配置（3个节点：生活观察、问题筛选、问题深化，含AI提示词、表单配置、评估标准）
- [x] `configs/steps/step-2-research.ts` — 第2步配置骨架
- [x] `configs/steps/step-3-requirements.ts` — 第3步配置骨架
- [x] `configs/steps/step-4-design.ts` — 第4步配置骨架
- [x] `configs/steps/index.ts` — 统一导出 + `getStepConfig()` / `getNodeConfig()` 工具函数

### 1.11 API路由 & 工具库

- [x] `app/api/ai/chat/route.ts` — AI对话端点骨架（接收消息、返回模拟响应，Phase 2 接入 Claude）
- [x] `app/api/projects/route.ts` — 项目 CRUD（创建、列表、详情）
- [x] `lib/ai/client.ts` — Claude API 客户端封装（骨架）
- [x] `lib/ai/context-builder.ts` — AI上下文构建器（骨架）
- [x] `lib/utils/format.ts` — 工具函数（日期格式化、中文处理等）

### 1.12 Phase 1 验收

- [x] `npm run build` 无报错
- [ ] 完整走通：注册 → 登录 → 仪表盘 → 创建项目 → 项目主页 → 进入步骤页（需配置 Supabase 后测试）
- [x] 11步进度地图正确显示
- [x] 家长页面可以查看项目进度
- [x] 代码提交并推送到远程仓库

---

## Phase 2：AI引导核心（预计2周）

> 目标：实现第1步（问题发现）的完整AI引导体验

### 2.1 MiniMax 2.5 API 集成（替代 Claude）

- [x] `lib/ai/client.ts` — MiniMax 2.5 OpenAI 兼容 API（流式 + 非流式）
- [x] `app/api/ai/chat/route.ts` — 实现流式响应（Server-Sent Events）
- [x] 前端对接流式响应，实现打字机效果

### 2.2 AI上下文管理

- [x] `lib/ai/context-builder.ts` — 完整实现上下文构建
  - [x] 加载步骤配置的 systemPrompt
  - [x] 注入学生年级信息调整语言难度
  - [x] 注入之前步骤的产出物摘要
  - [x] 加载当前节点的对话历史
  - [x] 加载当前节点的表单提交数据（1.1→1.2, 1.2→1.3）
- [x] 对话持久化 — 实时保存到 `conversations` 表
- [x] 上下文窗口管理 — 对话超20轮自动摘要压缩

### 2.3 节点 1.1：生活观察

- [x] AI引导对话 — 加载 step-1 配置的 systemPrompt，引导学生发现生活中的问题
- [x] `components/forms/ObservationForm.tsx` — 结构化表单（场景、人物、问题、现有方案，3-5组）
- [x] 表单验证 — 至少填写3个观察
- [x] AI对表单内容的评价反馈 — 提交后AI给出具体化、深入的建议
- [x] 表单数据持久化到 `form_submissions` 表

### 2.4 节点 1.2：问题筛选

- [x] 自动加载学生在 1.1 提交的问题列表
- [x] AI按4个维度分析每个问题（真实性、普遍性、可行性、创新空间）
- [x] 引导学生做出选择，尊重学生决定
- [x] 生成问题筛选文档（AI自动生成）
- [x] 产出物保存到 `deliverables` 表

### 2.5 节点 1.3：问题深化

- [x] 深度对话引导（影响人群、不解决的后果、理想方案、个人动机）
- [x] 每次只问一个问题，等学生回答后再继续
- [x] 引导学生写出 300-500 字的问题描述
- [x] AI质量评估（深度、完整性、学生语言）
- [x] 生成问题描述文档（AI自动生成）

### 2.6 节点完成 & 步骤流转

- [x] `lib/ai/evaluator.ts` — AI评估引擎（按配置的 evaluationCriteria 评分）
- [x] 节点完成判定逻辑（form_complete / ai_evaluation 阈值）
- [x] 完成一个节点后自动解锁并引导进入下一节点
- [x] 第1步所有节点完成后解锁第2步
- [x] 更新 `step_progress` 表

### 2.7 三层提示机制

- [x] Level 1：AI自动提示 — 学生沉默或表示想不出时，给出场景方向
- [x] Level 2：案例参考 — 展示同龄学生的脱敏案例
- [x] Level 3：人工介入标记 — "需要帮助"按钮，标记到数据库

### 2.8 Phase 2 验收

- [x] 完整走通第1步的3个节点（对话 → 表单 → 筛选 → 深化 → 产出文档）
- [x] AI引导风格符合"引导者而非解答者"原则
- [x] 对话和产出物正确保存到数据库
- [x] 流式响应体验流畅
- [x] 代码提交并推送

---

## Phase 3：扩展步骤 2-4（预计3周）

> 目标：实现第2-4步的完整引导体验

### 3.1 第2步：背景调研（调研助手）

- [x] 步骤配置 `step-2-research.ts` 完善（AI提示词、节点、评估标准、提示机制）
- [x] AI辅助信息搜索和整理（引导学生做桌面调研）
- [x] 调研信息结构化输入界面（现有方案、用户反馈、关键发现、差距分析）
- [ ] 问卷设计引导（AI帮助学生设计调查问卷）
- [x] 调研报告自动生成（基于学生输入，AI生成初稿供修改）

### 3.2 第3步：需求定义（需求画布）

- [x] 步骤配置 `step-3-requirements.ts` 完善（AI提示词、表单、评估标准）
- [x] 用户画像表单（节点3.1，目标用户、痛点、期望）
- [ ] `components/forms/RequirementForm.tsx` — 功能需求列表（可拖拽排优先级）
- [x] 成功标准定义（节点3.3，AI引导量化）
- [x] 需求文档自动生成

### 3.3 第4步：方案设计（方案工作台）

- [x] 步骤配置 `step-4-design.ts` 完善（AI提示词、评估标准、提示机制）
- [x] AI技术选型推荐（根据项目类型推荐 Arduino/ESP32/Python 等）
- [x] 系统架构引导（文字描述 + 比喻解释）
- [ ] 材料清单（BOM表）生成界面
- [x] 开发计划时间表引导
- [x] 确定项目类型（software / hardware / mixed）

### 3.4 产出物管理增强

- [x] 产出物详情查看页（支持 Markdown 渲染）
- [ ] 版本历史（保留每次修改）— 后续迭代
- [x] 产出物导出功能（Markdown 下载 + 复制）
- [x] 按步骤汇总的产出物总览（已有 deliverables 页面）
- [x] DeliverableCard 可点击跳转详情页

### 3.5 Phase 3 验收

- [x] 完整走通第 2-4 步的所有节点（配置 + 表单 + AI引导 + 产出物生成）
- [x] 每步产出物正确生成和保存
- [x] 步骤间数据正确传递（第1步→第2步通过 deliverables 传递）
- [x] 代码提交并推送

---

## Phase 4：体验完善（预计2周）

> 目标：完善用户体验，准备内测

### 4.1 家长端增强

- [x] 项目进度可视化（统计卡片 + 进度条 + 进度地图）
- [x] 每步产出物浏览（展开查看详情，Markdown 渲染）
- [ ] 通知功能（孩子完成阶段时发送通知）— 后续迭代
- [x] 家长评论/鼓励功能（快捷留言 + 自定义留言，存入数据库）

### 4.2 仪表盘增强

- [x] 进度地图（可视化11步，已有 ProgressMap 组件）
- [x] 当前任务卡片（明确告诉学生下一步做什么 + 快捷进入按钮）
- [ ] 历史对话回顾（可以回看之前步骤的AI对话记录）— 后续迭代
- [x] 项目统计（产出物数量）
- [x] 显示家长鼓励留言

### 4.3 人工介入机制

- [x] "需要帮助"按钮 — 学生任何时候可以标记求助
- [ ] 教师通知（邮件通知）— 后续迭代
- [x] 教师审核 API（查看学生对话和产出物，给出反馈）
- [x] 审核反馈存入数据库，学生可在对话中看到
- [x] 评论 API（家长/教师留言端点）

### 4.4 体验优化

- [x] 全局加载状态（骨架屏：仪表盘、项目页、步骤页）
- [x] 错误处理（API 路由统一 try/catch + 前端 toast 提示）
- [x] AI对话体验（打字机效果、SSE流式响应）
- [ ] 表单自动保存（防止数据丢失）— 后续迭代
- [x] 基础响应式适配（StepContent 侧边栏移动端变为底部面板）

### 4.5 Phase 4 验收

- [x] 家长端功能完整可用
- [x] 教师介入流程走通（帮助请求 + 审核 API + 反馈）
- [x] 移动端基本可用
- [x] 无明显UI/UX问题
- [x] 代码提交并推送

---

## Phase 5：测试与上线（预计2-3周）

> 目标：内测、修复、部署上线

### 5.1 部署准备

- [x] Vercel 项目创建和配置（已部署）
- [x] 环境变量配置（Supabase + MiniMax API 密钥）
- [ ] 域名配置（如有）
- [x] Supabase 生产环境数据库初始化

### 5.2 内测准备

- [ ] 创建测试账号（3-5个学生、对应家长）
- [ ] 准备测试数据（示例项目、示例产出物）
- [ ] 编写简易用户指南
- [ ] 已知问题清单整理和修复

### 5.3 内测执行

- [ ] 邀请 3-5 个真实学生内测
- [ ] 跟踪每个学生的使用过程
- [ ] 记录 AI 引导效果（哪里引导好、哪里卡住）
- [ ] 收集学生和家长反馈

### 5.4 迭代修复

- [ ] 基于反馈调整 AI 提示词（最关键的优化点）
- [ ] 优化交互流程中的卡点
- [ ] 修复内测发现的 Bug
- [ ] 性能优化（如有需要）

### 5.5 Phase 5 验收

- [ ] 至少 1 个学生完整走完第 1-4 步
- [ ] 家长满意度调查
- [ ] 生产环境稳定运行
- [ ] 所有关键 Bug 已修复

---

## 后续迭代（MVP之后）

> 以下功能不在当前 MVP 范围内，根据内测反馈优先级排序后逐步实现

- [ ] 手机号 + 验证码登录（替代邮箱登录）
- [ ] 微信支付 / 支付宝接入
- [ ] 第 5-8 步实现（技术学习、原型开发、测试验证、迭代优化）
- [ ] 第 9-11 步实现（文档撰写、展示准备、评审模拟）
- [ ] 在线代码编辑器（Arduino / Python）
- [ ] PPT / 展板自动生成
- [ ] 教师管理后台
- [ ] 案例库（往届优秀项目展示）
- [ ] 移动端 App（或 PWA）
- [ ] 国内云服务迁移（腾讯云/阿里云，解决延迟问题）
- [ ] AI 对话语音输入支持
- [ ] 多语言支持

---

## 技术要点备忘

### 环境变量（`.env.local`）

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 品牌配色

| 用途 | 颜色 | 色值 |
|------|------|------|
| 主色（暖橙） | 按钮、链接、重点 | #FF8C42 |
| 辅色（温暖绿） | 成功状态、完成标记 | #4CAF50 |
| 辅色（米黄） | 背景色、卡片底色 | #FFF3E0 |
| 强调（珊瑚） | 警告、重要提示 | #FF6B6B |
| 文字（深灰） | 正文、标题 | #333333 |
| 背景（暖白） | 页面背景 | #FAFAF8 |

### 关键设计原则

1. **AI是引导者** — 永远不替学生给出答案，通过提问引导思考
2. **保持学生语言** — 产出物必须保持学生自己的表达，不成人化
3. **温暖不冰冷** — 避免科技蓝，使用暖色系，对话有温度
4. **触控友好** — 学生可能用iPad，按钮和交互区域要足够大
5. **减少打字** — 多用选择、结构化表单，减少长文本输入
