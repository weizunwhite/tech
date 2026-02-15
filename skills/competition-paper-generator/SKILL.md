---
name: competition-paper-generator
description: Generate competition papers (研究报告/论文) for youth science and technology innovation projects. Use when users need to write research reports or papers for competitions like National Youth Science and Technology Innovation Competition (全国青少年科技创新大赛), Beijing Jinpeng Science and Technology Forum (北京金鹏科技论坛), or similar youth STEM competitions. Supports four grade levels with distinct writing styles and structures. Also generates research proposals (研究方案) as a condensed pre-project version. Outputs Markdown document with auto-generated architecture and flow chart diagrams. Trigger whenever users mention 论文, 研究报告, 竞赛论文, 研究方案, 开题报告, or need to write papers for science innovation competitions.
---

# Competition Paper Generator (竞赛论文生成器)

## Overview

Generate complete, high-quality competition papers for youth science and technology innovation projects. The paper serves two purposes simultaneously:

1. **Complete project record** — a thorough documentation of the entire invention/research process from start to finish
2. **Competition submission** — strategically structured so evaluators can quickly grasp the project's value, especially through the abstract

**Output**: Markdown (.md) document + system architecture diagram (PNG) + flow chart (PNG)

**Also supports**: Research proposals (研究方案/开题报告) as a condensed version

## Critical Rules

**NEVER use metaphors for technical components.** Do not compare MCUs to "brains", cameras to "eyes", sensors to "noses", etc. Always use the actual component names directly (e.g., "ESP32主控芯片负责数据处理" NOT "ESP32就像大脑一样控制着整个系统").

**ALL grade levels MUST include these three sections:**
1. **个人贡献** — what the student personally accomplished (placed immediately after abstract, before background)
2. **心得体会** — personal reflections and growth from the project (near the end)
3. **致谢** — acknowledgments to teachers, parents, school, etc. (final section before references)

## Workflow

### Step 1: Gather Project Information

Ask targeted questions to understand the project:

**Essential:**
- Project name and brief description
- Student grade level → determines which of the 4 tiers to use:
  - 小学低 (grades 1-3)
  - 小学高 (grades 4-6) ← most common
  - 初中 (grades 7-9) ← most common
  - 高中 (grades 10-12)
- Competition target (科创大赛, 金鹏论坛, etc.)
- What problem does it solve?
- How does it work? (technical overview)
- What materials/technologies are used?

**If available:**
- Existing technical documentation or research proposal
- Test data and results
- Photos of the project
- Survey/questionnaire data
- Previous documentation

### Step 2: Determine Paper Structure

Based on grade level, select the appropriate structure from `references/paper-structures.md`.

Key structural differences by grade:
- **小学低**: ~3000 words, story-like, simple structure, colloquial language
- **小学高**: ~5000 words, structured invention report, natural student voice with data
- **初中**: ~8000-10000 words, systematic technical paper, formal language, detailed data analysis
- **高中**: ~12000-15000 words, academic paper, literature review, statistical analysis

Confirm structure with user before writing.

### Step 3: Write the Abstract (摘要)

**The abstract is the single most important section.** Evaluators will read it completely, even if they skim everything else.

The abstract MUST contain:
- What problem the project solves (1-2 sentences)
- Core technical approach (1-2 sentences)
- **Specific quantitative results** (not "效果良好" but "测距精度±10cm，成功率96%")
- Key innovation points (1-2 sentences)
- Practical value (1 sentence)

Refer to `references/writing-guidelines.md` for grade-specific abstract templates.

### Step 4: Write the Paper Body

Generate sections progressively. Refer to `references/paper-structures.md` for the detailed structure of each grade level.

**Writing principles across all grades:**
- Complete project documentation from start to finish — never skip steps
- Every claim backed by data or evidence
- Innovation points reinforced throughout (first in abstract, then in design rationale, then in test results, finally summarized)
- Honest about failures and iterations — this proves authenticity
- 个人贡献 immediately after abstract to establish credibility
- No metaphors for technical components

**Grade-specific language:**
- 小学 (both tiers): Colloquial, first person "我", natural student expressions
- 初中: Formal, mix of "我" and "本系统/本装置/本项目", technically precise
- 高中: Academic, "本研究/本文", with proper terminology and citations

Refer to `references/writing-guidelines.md` for detailed style guidance per grade.

### Step 5: Generate Diagrams

For 小学高 and above, generate two diagrams using Graphviz:

1. **System Architecture Diagram** (`arch_diagram.png`)
2. **Flow Chart** (`flow_diagram.png`)

Refer to `references/diagram-templates.md` for Graphviz templates.

For 小学低, diagrams are optional — only generate if the project has enough technical complexity.

**Diagram Generation Procedure:**

```bash
# 1. Create .dot files
# 2. Render to PNG
dot -Tpng -Gdpi=200 arch.dot -o arch_diagram.png
dot -Tpng -Gdpi=200 flow.dot -o flow_diagram.png
# 3. Copy to output directory
cp arch_diagram.png /mnt/user-data/outputs/
cp flow_diagram.png /mnt/user-data/outputs/
```

**Reference in Markdown:**
```markdown
![系统架构图](arch_diagram.png)
*图1 系统架构图*
```

### Step 6: Generate Research Proposal (if requested)

Research proposals (研究方案/开题报告) are a condensed pre-project document. Extract from the paper:

- 项目背景 (condensed)
- 研究目标 (with quantified indicators)
- 研究思路与技术路线
- 研究方法
- 创新点
- 研究计划 (timeline with milestones)
- 预期成果

Approximately 1/3 the length of the full paper. Save as a separate file: `项目名_研究方案.md`

### Step 7: Finalize and Output

**Output structure:**
```
/mnt/user-data/outputs/
├── 项目名称_研究报告.md       # Main paper
├── arch_diagram.png            # System architecture (小学高+)
├── flow_diagram.png            # Flow chart (小学高+)
└── 项目名称_研究方案.md       # Research proposal (if requested)
```

Use `present_files` to share all files with the user.

## Evaluator Context

Understanding how evaluators review projects helps write better papers:

**Evaluator review order:**
1. 项目介绍视频 / 演示视频 (first impression)
2. 项目方案 (technical overview)
3. 项目日志 (process authenticity)
4. 项目报告/论文 (deep dive)
5. 其他补充材料

**Implications for paper writing:**
- The paper is a **complete project record** — it documents everything from start to finish
- The abstract is the **one section evaluators definitely read fully** — make every word count
- 个人贡献 right after abstract builds immediate credibility
- Specific data and quantified results throughout demonstrate rigor
- Honest discussion of failures and iterations proves authenticity

## Resources

### references/paper-structures.md
Detailed paper structures for all four grade levels, with section descriptions and word count guidance.

### references/writing-guidelines.md
Grade-specific writing style, language rules, abstract templates, and common pitfalls to avoid.

### references/diagram-templates.md
Graphviz dot syntax templates for system architecture diagrams and flow charts.

### references/examples.md
Example sections from real competition papers showing best practices at each grade level.
