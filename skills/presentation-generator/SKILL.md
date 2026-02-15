---
name: presentation-generator
description: Generate professional presentation slides (.pptx) for student science and technology innovation competition projects. Use when users need presentation decks for video recordings or live presentations at competitions like National Youth Science and Technology Innovation Competition (全国青少年科技创新大赛) or Beijing Jinpeng Science and Technology Forum (北京金鹏科技论坛). Creates visually distinctive presentations with speaker notes, project photos integration, and age-appropriate content. Each project gets a unique visual design.
---

# Presentation Generator for Student Innovation Projects

## Overview

Create professional, visually distinctive presentation slides for student competition projects. Each presentation is uniquely designed — different projects receive different color themes, cover layouts, and content arrangements to avoid cookie-cutter outputs.

**IMPORTANT**: Before generating any presentation, you MUST also read the pptx skill at `/mnt/skills/public/pptx/SKILL.md` and its `pptxgenjs.md` reference for technical implementation details.

## Workflow

### Step 1: Gather Project Information

Collect essential information before designing:

**Required:**
- Project name (项目名称)
- Student grade level (年级)
- Project type: hardware / software / integrated system
- Brief description of what the project does
- Presentation purpose: video recording (视频录制) or live presentation (现场答辩)
- Time limit (typically 5 minutes)

**Strongly Recommended:**
- Technical paper or documentation (竞赛论文/技术文档)
- Project photos (项目照片)
- Key data/test results

**If a technical paper is provided**, extract all content from it rather than asking the student to describe everything. Parse the paper for: problem background, system design, implementation details, test results, innovation points, and reflections.

### Step 2: Select Visual Theme

**CRITICAL: Every project must look visually distinct.**

Select a design theme based on the project's domain and characteristics. Refer to `references/design-themes.md` for the full theme catalog.

**Theme Selection Rules:**
1. Match the theme to the project's subject domain (e.g., fire/safety → warm reds; environment → greens; medical/health → blues)
2. If the domain doesn't clearly map, use the project name's first character Unicode value modulo the number of available themes to select one deterministically
3. NEVER default to the same theme — always make an active selection
4. Record the selected theme name in a code comment for traceability

### Step 3: Select Layout Variants

**CRITICAL: Slide layouts must vary across projects.**

For each slide type (cover, content, data, process, etc.), multiple layout variants exist. Refer to `references/layout-variants.md` for the complete catalog.

**Layout Selection Rules:**
1. For the COVER slide: select based on (grade_level + theme_index) modulo number_of_cover_variants
2. For CONTENT slides: rotate through available variants — don't use the same layout for adjacent slides
3. For DATA slides: select based on the nature of the data (few big numbers → hero-number layout; comparison → side-by-side; timeline → horizontal flow)
4. Mix at least 3 different content layout patterns within a single presentation

### Step 4: Design Slide Structure

Standard structure for a 5-minute competition presentation (13 slides):

| Slide | Content | Time | Type |
|-------|---------|------|------|
| 1 | Title / Cover | ~15s | cover |
| 2 | Project Origin / Problem | ~25s | story |
| 3 | Background Research | ~25s | data |
| 4 | System Architecture | ~30s | architecture |
| 5 | Component A Detail | ~25s | detail |
| 6 | Component B Detail | ~30s | detail |
| 7 | Making Process | ~25s | process |
| 8 | Difficulties & Solutions | ~25s | comparison |
| 9 | Testing & Results | ~30s | data |
| 10 | Innovation Points | ~25s | grid |
| 11 | Personal Contribution | ~25s | grid |
| 12 | Reflections & Learnings | ~25s | emotional |
| 13 | Thank You | ~10s | closing |

Refer to `references/slide-structures.md` for content guidelines per slide type and grade-level adaptations.

**Adjustment rules:**
- For shorter time limits (3 min), merge slides 5+6 and remove slide 11
- For longer time limits (8 min), add demo/video slide and expand testing
- For live presentations (vs video), add more visual anchors and less text

### Step 5: Integrate Project Photos

If the user provides project photos (via PPTX, images, or document):

1. Extract all photos to `/home/claude/paper_images/`
2. Identify which photos match which slides by analyzing content
3. Name photos descriptively (e.g., `fig_robot_full.jpg`, `fig_sensor_box.jpg`)
4. Use `sizing: { type: "contain" }` or `sizing: { type: "cover" }` appropriately
5. Add photo captions with `▲` prefix in muted color

**If no photos are available**, design slides to work without images — use colored shapes, icons, and typography instead.

### Step 6: Generate the Presentation

Use Node.js with `pptxgenjs` to create the .pptx file. Follow the pptx skill's `pptxgenjs.md` for technical API details.

**Code Generation Rules:**

1. **Always use react-icons for icons** — render to PNG via sharp, then embed as images
2. **Speaker notes on every slide** — written as a speaking script with timing hints (约Xs)
3. **Font strategy**: Use one display font (title) + one body font (content) per theme
4. **Shadow helper**: Create a reusable `mkShadow()` function for card elements
5. **Image safety**: Always check `fs.existsSync()` before adding images
6. **Color constants**: Define all colors as a `C` object at the top of the script
7. **Output path**: Save to `/home/claude/presentation.pptx`, then copy to `/mnt/user-data/outputs/`

### Step 7: Visual QA

After generating:

1. Convert to PDF: `python /mnt/skills/public/pptx/scripts/office/soffice.py --headless --convert-to pdf presentation.pptx`
2. Generate thumbnails: `pdftoppm -jpeg -r 150 presentation.pdf slide`
3. Review at least 4 representative slides (cover, content, data, closing)
4. Check for: text overflow, image placement, color contrast, layout balance
5. Fix any issues and regenerate

### Step 8: Deliver

1. Copy final file to `/mnt/user-data/outputs/` with descriptive Chinese filename
2. Present using `present_files` tool
3. Summarize: slide count, structure overview, time allocation
4. Remind user to replace `[姓名]` and `[学校名称]` placeholders

## Speaker Notes Guidelines

Write speaker notes as if coaching the student to speak:

- **Elementary school (1-6年级)**: Conversational, simple sentences, 自然口语化
- **Middle school (7-9年级)**: Slightly more technical, but still accessible
- Each note should include approximate timing: `（约25秒）`
- Use first person: "我发现..." not "该项目发现..."
- Include pause hints: `（停顿2秒）` for dramatic moments
- Total speaking time across all notes should match the time limit

## Personal Contribution Slide

**Always include a personal contribution slide** (我的贡献) — this is critical for competition credibility. Position it between Innovation Points and Reflections.

Content should highlight 5-6 specific things the student personally did:
- Field research / investigation
- Key design decisions (especially creative solutions)
- Hands-on building / soldering / assembly
- Programming / coding
- Testing and iteration
- Self-learning new skills

Bottom disclaimer: "指导老师提供方向建议，所有设计、制作、编程、测试均由我独立完成"

## Quality Checklist

Before delivering, verify:

- [ ] Theme is distinct (not the default/first theme)
- [ ] Cover layout differs from a standard centered layout
- [ ] At least 3 different content layout patterns are used
- [ ] All slides have speaker notes with timing
- [ ] Photos are properly integrated (if provided)
- [ ] Personal contribution slide is present
- [ ] Total time allocation matches the time limit
- [ ] Text is readable (min 10pt for captions, min 13pt for body)
- [ ] Color contrast is sufficient (light text on dark bg or vice versa)
- [ ] Placeholders [姓名] and [学校名称] are present
