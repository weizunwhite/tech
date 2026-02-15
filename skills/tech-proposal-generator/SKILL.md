---
name: tech-proposal-generator
description: Generate technical proposal documents (技术方案) for science and technology innovation projects. Use when users request help writing technical proposals, system design documents, or hardware/software specification documents. Supports hardware projects, software projects, and integrated systems. Do NOT use for competition papers or research reports — use competition-paper-generator for those. Trigger whenever users mention 技术方案, 技术文档, 技术报告, 系统设计文档, or need engineering-focused documentation describing how a system is built.
---

# Technical Proposal Documentation Generator (技术方案生成器)

## Overview

Generate complete, professional technical proposal documents for student science and technology innovation projects. Focus on engineering details: system architecture, hardware/software design, communication protocols, and technical specifications. This is NOT for competition papers (论文/研究报告) — use `competition-paper-generator` for those.

**Output**: Markdown (.md) document + system architecture diagram (PNG) + flow chart (PNG), all in the same output folder so the md file can reference the images directly.

## Workflow

### Step 1: Gather Project Information

Ask targeted questions to understand the project. ALWAYS start with these essential questions:

**Basic Information:**
- Project name and brief description
- Project type: hardware, software, or integrated system
- What problem does it solve?
- How does it work? (brief technical overview)
- What materials/technologies are used?
- Current development status (concept, prototype, completed)

**Existing Materials:**
- Any code, schematics, or design files
- Photos or diagrams
- Test data or results
- Previous documentation attempts

### Step 2: Determine Documentation Scope

Based on gathered information, propose a documentation structure. Refer to `references/document-structures.md` for templates matching:
- Project type (hardware, software, system)
- Project complexity

Confirm with user which sections to include.

### Step 3: Generate Documentation Sections

Create sections progressively, allowing user review between sections. Default order:

1. Project overview (项目概述)
2. System architecture (系统总体设计)
3. Hardware design details (硬件设计详情)
4. Software design (软件设计)
5. Technical specifications (技术指标)
6. Innovation points (项目创新点)
7. Limitations & improvements (项目局限与改进)
8. References (参考资料)

### Step 4: Adapt Technical Depth

Adjust the level of technical detail based on the project's complexity:

**Simple projects (e.g., single Arduino + 2-3 sensors):**
- Focus on component selection and basic wiring
- Simple block diagrams
- Straightforward code explanations

**Medium projects (e.g., ESP32 + multiple sensors + communication):**
- Detailed system architecture with protocol descriptions
- Pin connection tables and component specification tables
- Algorithm explanations with pseudocode

**Complex projects (e.g., multi-module systems, ML, custom PCB):**
- Full system architecture with submodules
- Communication protocol design details
- Algorithm formulas and performance analysis
- Detailed technical specifications table

### Step 5: Generate Diagrams

**CRITICAL**: ALWAYS generate two diagrams alongside the document:

1. **System Architecture Diagram** (`arch_diagram.png`)
2. **Flow Chart** (`flow_diagram.png`)

Use Graphviz (dot) to generate diagrams. Refer to `references/diagram-templates.md` for:
- Graphviz dot syntax templates for hardware, software, and integrated projects
- Color schemes and styling conventions
- Chinese font configuration (use `Noto Sans CJK SC`)
- How to adapt diagram complexity to grade level

**Diagram Generation Procedure:**

```bash
# 1. Create .dot files in /home/claude/
#    arch.dot  - system architecture
#    flow.dot  - usage/test flow chart

# 2. Render to PNG with graphviz
dot -Tpng -Gdpi=200 arch.dot -o arch_diagram.png
dot -Tpng -Gdpi=200 flow.dot -o flow_diagram.png

# 3. Copy to output directory alongside the .md file
cp arch_diagram.png /mnt/user-data/outputs/
cp flow_diagram.png /mnt/user-data/outputs/
```

**Diagram Referencing in Markdown:**

In the .md document, reference diagrams with relative paths:

```markdown
### 2.2 系统架构图

![系统架构图](arch_diagram.png)

*图1 系统架构图*

### 3.1 测试流程图

![测试流程图](flow_diagram.png)

*图2 测试流程图*
```

This ensures the user can open the .md file in any Markdown editor (Typora, VS Code, etc.) and see the diagrams inline, as long as the images are in the same folder.

### Step 6: Format and Finalize

Create the final deliverables:

1. **Markdown document** (`.md`) — the primary deliverable
   - Write with `create_file` to `/mnt/user-data/outputs/`
   - Include proper formatting: headers, numbering, tables, citations
   - Reference diagram images with relative paths

2. **Diagram PNGs** — copy to the same output directory
   - `arch_diagram.png` — system architecture
   - `flow_diagram.png` — test/usage flow chart

3. **Word document** (`.docx`) — only if explicitly requested
   - Use the docx skill to convert
   - Embed diagram images directly into the document

4. Use `present_files` to share all files with the user

**Final Output Structure:**
```
/mnt/user-data/outputs/
├── 项目名称_技术方案.md          # Main document
├── arch_diagram.png              # System architecture diagram
└── flow_diagram.png              # Flow chart
```

## Content Generation Guidelines

### Technical Accuracy
- Verify technical details don't contradict each other
- Ensure code examples are syntactically correct
- Check units and measurements are consistent
- Validate that claimed innovations are novel

### Project Type Specialization

**Hardware Projects:**
- Emphasize component selection rationale
- Include circuit diagrams, wiring diagrams
- Explain mechanical design considerations
- Document assembly process with photos
- Provide troubleshooting for common issues
- Architecture diagram: focus on MCU, sensors, actuators, power, communication buses
- Flow chart: focus on device startup → calibration → sensing → actuation → feedback loop

**Software Projects:**
- Show system architecture diagrams
- Include key code snippets with explanations
- Explain algorithm choices
- Document API/interface design
- Include user interface screenshots
- Architecture diagram: focus on layers, modules, data flow, APIs
- Flow chart: focus on user interaction → data processing → output

**Integrated Systems:**
- Clearly separate hardware and software components
- Explain communication protocols between components
- Show system integration architecture
- Discuss hardware-software co-design decisions
- Architecture diagram: show both HW and SW with communication links
- Flow chart: show end-to-end usage flow including HW and SW interactions

### Common Sections

**Problem Statement:**
- Start with real-world observation or personal experience
- Use specific examples and data
- Explain why existing solutions are insufficient
- State clear, measurable objectives

**Innovation Points:**
- Highlight what makes this project unique
- Compare with existing solutions
- Quantify improvements (faster, cheaper, more accurate)
- Explain technical innovations clearly

**Testing & Results:**
- Design meaningful test cases
- Present data in tables and graphs
- Include both successful and unsuccessful attempts
- Discuss what was learned from failures

**Future Improvements:**
- Acknowledge current limitations honestly
- Propose realistic next steps
- Consider cost, complexity, and feasibility

## Document Quality Standards

### Writing Style
- Clear, concise sentences (vary length for readability)
- Active voice preferred over passive
- Define technical terms on first use
- Use consistent terminology throughout

### Visual Elements
- Every diagram/photo should have a caption (图X / 表X)
- Label all axes on graphs
- Use consistent color schemes across diagrams
- Ensure images are high resolution (200 dpi minimum)

### Citations
- Use consistent citation format (IEEE, APA, etc.)
- Cite sources for technical data, existing solutions
- Include both academic and web sources where appropriate
- Never invent citations

## Handling Edge Cases

**Incomplete Projects:**
- Document current progress honestly
- Include planned features in "Future Work"
- Explain technical challenges encountered
- Show problem-solving process

**Limited Technical Knowledge:**
- Ask follow-up questions to understand intent
- Suggest simplified explanations
- Offer to research specific technical details
- Recommend appropriate complexity level

**Translation Needs:**
- Primary language is Chinese (用户主要使用中文)
- Use Chinese for all documentation by default
- Provide English abstracts if requested
- Use standard technical terminology in English where appropriate

## Resources

### references/document-structures.md
Templates and structural guidance for different types of projects and grade levels.

### references/examples.md
Real examples from previously created documentation to illustrate best practices.

### references/chinese-templates.md
Chinese language templates and common phrases for technical documentation.

### references/diagram-templates.md
Graphviz dot syntax templates for generating system architecture diagrams and flow charts. Includes color schemes, font configuration, and project-type-specific templates.
