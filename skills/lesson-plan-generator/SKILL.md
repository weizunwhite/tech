---
name: lesson-plan-generator
description: Generate detailed lesson plans for science and technology innovation project courses based on standardized methodology. Use this skill when users request help creating lesson plans (教案) for project-based learning, STEM education, or maker education courses, especially when they mention project stages, class sessions (节课), or need structured teaching materials that follow a systematic approach from problem discovery through prototype creation and testing.
---

# Lesson Plan Generator for Science Innovation Projects

Generate comprehensive, detailed lesson plans for science and technology innovation courses following a standardized 8-stage methodology.

## When to Use This Skill

Use this skill when users need to create detailed lesson plans (教案) for:
- Science and technology innovation projects (科技创新项目)
- STEM education courses  
- Maker education programs
- Project-based learning courses
- Competition preparation (青少年科技创新大赛等)

Trigger phrases include:
- "帮我写/设计教案"
- "生成第X节课的教案"
- "根据方法论设计课程"
- "create lesson plan"
- "design teaching materials"

## Overview

This skill generates lesson plans based on a systematic 8-stage methodology:
1. Stage 1: Tech Inspiration & Problem Definition
2. Stage 2: Need Research & Validation  
3. Stage 3: Essential Analysis & Solution Design
4. Stage 4: Solution Visualization
5. Stage 5: Prototype Creation
6. Stage 6: Testing & Validation
7. Stage 7: Iteration & Optimization
8. Stage 8: Achievement Presentation

## Step-by-Step Workflow

### Step 1: Gather Required Information

Before generating a lesson plan, collect the following information from the user. Ask clarifying questions if any information is missing:

**Required Information:**
1. **Project Details**:
   - Project name (项目名称)
   - Project type (硬件/软件/系统集成/AI算法)
   - Brief project description

2. **Lesson Details**:
   - Which lesson number (第几节课)
   - Which stage it corresponds to (对应哪个阶段)
   - Duration (usually 2 hours/120 minutes)

3. **Student Context**:
   - Grade level (小学高年级/初中/高中)
   - Number of students (一对一/小组)
   - Prior knowledge level

4. **Teaching Context**:
   - B-end (20 hours) or C-end (24-30 hours)
   - Available materials/equipment
   - Any special requirements

**Example Questions to Ask:**
- "这是第几节课？对应方法论的哪个阶段？"
- "学生是什么年级的？"
- "项目类型是硬件、软件还是系统集成？"
- "这节课的主要教学内容是什么？"

### Step 2: Read Methodology and Templates

Before generating the lesson plan, ALWAYS read the relevant reference files:

**Mandatory Reading:**
1. **Read methodology.md** - Understand the complete 8-stage methodology and the specific requirements for the relevant stage
   ```
   view references/methodology.md
   ```
   
2. **Read templates.md** - Understand lesson plan structure, formatting standards, and best practices
   ```
   view references/templates.md
   ```

3. **Read example-lesson1.md** (if generating Stage 1 lesson) - See a complete example
   ```
   view references/example-lesson1.md
   ```

### Step 3: Determine Lesson Characteristics

Based on the gathered information, determine:

**Stage-Specific Characteristics:**
- Stage 1: Focus on inspiration and problem discovery
- Stage 2: Focus on research methods and questionnaire design  
- Stage 3: Focus on first principles thinking and solution design
- Stage 4: Focus on understanding diagrams and visualization
- Stage 5: Focus on hands-on creation (may span 4 lessons)
- Stage 6: Focus on scientific testing methods
- Stage 7: Focus on data analysis and iteration
- Stage 8: Focus on presentation materials

**Grade-Level Adaptations:**
- Elementary (小学): Simplify theory, more hands-on, shorter attention span (15-20 min per segment)
- Middle School (初中): Balanced theory and practice, introduce basic programming (20-30 min per segment)
- High School (高中): Deeper theory, complex techniques, research skills (30-40 min per segment)

**Project Type Emphasis:**
- Hardware: Structure design, circuit design, assembly
- Software: Algorithm design, coding, debugging
- System Integration: Interface design, integration testing
- AI/Algorithm: Data preparation, model training, evaluation

### Step 4: Generate Comprehensive Lesson Plan

Create a detailed lesson plan following this structure:

#### Basic Information Section
```markdown
# 【项目名称】- 第X节课教案

## 基本信息
- **课程名称**：【项目名称】
- **节次**：第X节课
- **时长**：2小时（120分钟）
- **对应阶段**：阶段X - 【阶段名称】
- **年级**：【小学高年级/初中/高中】
- **授课模式**：【一对一/小组】
```

#### Teaching Objectives Section
```markdown
## 教学目标

### 知识目标
- 【具体的知识点1】
- 【具体的知识点2】
- 【具体的知识点3】

### 能力目标  
- 【具体的能力1】
- 【具体的能力2】
- 【具体的能力3】

### 素养目标
- 【具体的素养1】
- 【具体的素养2】
```

#### Pre-Class Preparation Section
```markdown
## 课前准备

### 教师准备
**材料**：
- 【具体材料1】（数量）
- 【具体材料2】（数量）

**工具**：
- 【具体工具1】
- 【具体工具2】

**多媒体**：
- 【视频/PPT/图片等】（描述内容）

**文档模板**：
- 【表格名称】（附件A）
- 【问卷名称】（附件B）

### 学生预习（如有）
- 【预习任务1】
- 【预习任务2】
```

#### Detailed Teaching Flow Section

Create 4-6 teaching segments that total 120 minutes. Each segment should include:

```markdown
## 教学流程

### 环节1：【环节名称】（XX分钟）

**教学内容**：
- 【内容点1】
- 【内容点2】

**教学方法**：
【讲授法/演示法/讨论法/实践法等】

**学生活动**：
1. 【具体活动步骤1】（X分钟）
2. 【具体活动步骤2】（X分钟）
3. 【具体活动步骤3】（X分钟）

**教学要点**：
- ⚠️ 【重点强调的内容】
- 💡 【引导技巧】
- 🚫 【需要避免的问题】

**教学话术示例**：
\`\`\`
教师："【关键引导问题】"
学生：【预期回答】  
教师："【进一步引导】"
\`\`\`

**产出物**：
- [ ] 【产出物1】
- [ ] 【产出物2】

**常见问题与应对**：
- Q: 【学生可能的问题】
  A: 【应对策略】
```

#### Teaching Reflection Section
```markdown
## 教学反思与评价

### 课堂观察要点
- 【观察维度1】：【具体表现】
- 【观察维度2】：【具体表现】

### 学生能力评价
| 能力维度 | 评价标准 | 备注 |
|---------|---------|------|
| 【能力1】 | 【标准描述】 | |
| 【能力2】 | 【标准描述】 | |

### 课后作业（如有）
- [ ] 【作业1】（完成时间）
- [ ] 【作业2】（完成时间）
```

#### Appendices Section
```markdown
## 附录

### 附录A：【模板/表格名称】
【提供完整的模板内容】

### 附录B：【其他材料】
【提供其他支持材料】
```

### Step 5: Quality Check

Before presenting the lesson plan, verify:

**Completeness Check:**
- [ ] All required sections are present
- [ ] Time allocation totals 120 minutes
- [ ] Each segment has clear deliverables
- [ ] Teaching methods are specified
- [ ] Student activities are detailed and actionable

**Quality Check:**
- [ ] Teaching objectives are specific and measurable
- [ ] Content matches the methodology stage requirements
- [ ] Activities are appropriate for grade level
- [ ] Teaching tips address common challenges
- [ ] Sample dialogue is natural and helpful
- [ ] Materials list is complete and specific

**Practical Check:**
- [ ] Teaching flow is logical and smooth
- [ ] Time allocation is realistic
- [ ] Student activities are clearly described
- [ ] Expected outputs are clearly defined
- [ ] Common problems are anticipated

### Step 6: Present the Lesson Plan

Present the complete lesson plan in a well-formatted markdown document. After presenting:

1. **Offer customization**: Ask if any sections need adjustment
2. **Suggest next steps**: Offer to generate the next lesson or create supporting materials
3. **Provide templates**: Offer to generate any mentioned templates (tables, questionnaires, etc.)

## Important Guidelines

### Content Quality Standards

**Be Specific and Actionable:**
- ❌ Bad: "学生讨论问题"
- ✅ Good: "学生2人一组，每组选择1个场景（家庭/校园/社区），观察5分钟，记录至少3个不便之处，然后小组分享"

**Use Realistic Time Allocations:**
- ❌ Bad: "环节1：一会儿"
- ✅ Good: "环节1（15分钟）：播放视频5分钟 + 讨论8分钟 + 总结2分钟"

**Provide Concrete Teaching Tips:**
- ❌ Bad: "注意引导学生思考"
- ✅ Good: "当学生说'我想做智能机器人'时，不要直接否定，而是追问'你想让机器人解决什么问题？''你观察到了什么不便？'帮助学生从模糊想法聚焦到具体问题"

### Adaptation Principles

**For Different Grade Levels:**
- **Elementary**: More visuals, simpler language, shorter segments, more encouragement
- **Middle School**: Balance theory and practice, introduce technical terms gradually
- **High School**: Deeper theory, professional terminology, encourage critical thinking

**For Different Project Types:**
- **Hardware**: Emphasize safety, tool usage, assembly techniques
- **Software**: Emphasize code quality, debugging, testing
- **System Integration**: Emphasize interface design, communication protocols
- **AI/Algorithm**: Emphasize data quality, model evaluation, scientific method

### Teaching Philosophy

The lesson plans generated should embody these principles:
1. **Inspiration-first**: Start with engaging examples, not abstract concepts
2. **Problem-driven**: Focus on real-world problems students care about
3. **Hands-on learning**: Balance theory with practice (40% theory, 60% practice)
4. **Scientific thinking**: Emphasize first principles, data-driven decisions, iteration
5. **Student-centered**: Students are creators, not observers

## Common Scenarios

### Scenario 1: Generate First Lesson (Stage 1)
User asks: "帮我写智能药盒项目的第1节课教案"

**Actions:**
1. Confirm: Project name, grade level, student context
2. Read: methodology.md (Stage 1 section), templates.md, example-lesson1.md  
3. Generate: Detailed lesson plan for Stage 1 with tech inspiration segment
4. Include: Case videos list, problem discovery methods, user persona template

### Scenario 2: Generate Hands-on Lesson (Stage 5)
User asks: "生成第6节课的教案，主要是电路连接"

**Actions:**
1. Confirm: Project hardware details, components list, circuit diagram available
2. Read: methodology.md (Stage 5 section), templates.md
3. Generate: Hands-on lesson with safety emphasis, step-by-step assembly guide
4. Include: Component list, wiring diagram, troubleshooting guide, photo checklist

### Scenario 3: Generate Testing Lesson (Stage 6)
User asks: "第9节课要做测试，帮我设计教案"

**Actions:**
1. Confirm: What functions to test, success criteria, testing environment
2. Read: methodology.md (Stage 6 section), templates.md
3. Generate: Scientific testing lesson with test plan, data recording, analysis
4. Include: Test form templates, data analysis methods, reporting format

### Scenario 4: Adapt for Different Grades
User asks: "这个教案太难了，能改成适合小学生的吗？"

**Actions:**
1. Identify: Current grade level assumptions
2. Simplify: Language, reduce theory, shorten segments, add more visuals
3. Adjust: Activities to be more concrete and game-like
4. Add: More scaffolding and teacher demonstrations

## Tips for Success

1. **Always read the reference files first** - The methodology and templates contain essential context
2. **Ask clarifying questions** - Don't make assumptions about project details or student level
3. **Be specific** - Vague lesson plans are not useful; provide exact times, activities, materials
4. **Anticipate challenges** - Include common problems students face and how to address them
5. **Make it actionable** - Teachers should be able to use the lesson plan directly without modification
6. **Include deliverables** - Every lesson should produce concrete outputs students can show
7. **Provide templates** - Include any forms, tables, or worksheets referenced in the lesson

## File Organization

```
lesson-plan-generator/
├── SKILL.md (this file)
└── references/
    ├── methodology.md          # Complete 8-stage methodology
    ├── templates.md            # Lesson plan templates and standards
    └── example-lesson1.md      # Example lesson for Stage 1
```

## Examples of Generated Outputs

The skill generates professional lesson plans in markdown format that can be:
- Used directly by teachers in classroom
- Converted to Word/PDF for printing  
- Adapted for different contexts
- Shared with parents to explain teaching approach
- Used as training materials for new teachers
