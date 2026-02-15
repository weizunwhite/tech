---
name: project-research-log
description: Generate detailed research logs for youth science and technology innovation competition projects. Use when users need to create research logs (研究日志) based on their technical papers or project documentation, especially for competitions like National Youth Science and Technology Innovation Competition (全国青少年科技创新大赛) or Beijing Jinpeng Science and Technology Forum (北京金鹏科技论坛). This skill converts project papers into daily research log entries with proper formatting and Word output.
---

# Project Research Log Generator

## Overview

This skill generates complete research logs for science and technology innovation projects based on technical papers. Research logs are critical evidence of student participation in youth competitions and must follow a specific daily format with dates, research content, problems encountered, solutions, photos, and reflections.

## Core Workflow

**For detailed paper analysis strategies, see [references/paper_analysis.md](references/paper_analysis.md) for comprehensive extraction guidelines.**

### Step 1: Analyze the Project Paper

When the user provides a project paper, first extract:

1. **Project timeline** - Determine realistic start/end dates based on project complexity
2. **Major phases** - Identify distinct stages (research, learning, hardware, software, testing, documentation)
3. **Technical components** - List hardware modules, software features, algorithms used
4. **Problems and solutions** - Extract challenges mentioned in the paper
5. **Key achievements** - Note milestones and test results

### Step 2: Plan the Log Structure

Create a timeline that:

- Spans 3-8 months depending on project complexity
- Includes 15-30 daily entries (not every day, shows realistic work pattern)
- Follows logical progression: research → learning → building → testing → optimizing → documenting
- Allocates more entries to complex phases (hardware/software development)

### Step 3: Generate Daily Entries

For each log entry, create content that matches the student's grade level and the project phase:

**Early phase (research/planning):**
- Problem identification and investigation
- Literature review and survey analysis
- Tool installation and learning
- Initial design and planning

**Middle phase (development):**
- Hardware assembly and circuit connection
- Sensor testing and calibration
- Programming and debugging
- Module integration

**Late phase (testing/refinement):**
- Functional testing
- Problem troubleshooting
- Performance optimization
- Documentation writing

### Step 4: Format Requirements

Each daily entry must include:

| 项目 | 内容 |
|------|------|
| **日期** | YYYY.MM.DD format |
| **内容** | 3-4 brief sentences describing work done that day |
| **遇到的问题** | 2-4 realistic problems (technical, not too complex for grade level) |
| **解决的方法** | Practical solutions for each problem |
| **照片记录** | 5 photo placeholders with descriptions |
| **心得体会** | (Optional) Brief reflection, not needed every day |

### Step 5: Generate Word Output

Use the bundled script `scripts/generate_log.py` to create the final Word document with:
- Proper table formatting
- Chinese fonts (宋体)
- Photo placeholders clearly marked
- Professional appearance

## Content Guidelines

### Writing Style

- **Concise**: Each section should be brief (1-2 sentences per point)
- **Authentic**: Match student's grade level and ability
- **Realistic**: Problems should be genuine technical challenges
- **Progressive**: Show learning and improvement over time

### Common Mistakes to Avoid

❌ Too detailed - research logs are daily notes, not technical reports
❌ Too many entries in one day - keep to 3-4 main points
❌ Unrealistic problems - should match student ability level
❌ Generic solutions - be specific about what was done
❌ Missing photo placeholders - competitions require visual evidence

### Grade Level Adaptation

**Elementary (Grades 1-5):**
- Simple projects (single sensor, basic Arduino)
- 2-3 month timeline
- Basic problems (connection errors, simple bugs)
- Adult guidance acknowledged

**Middle School (Grades 6-9):**
- Moderate complexity (multi-sensor, ESP32/STM32)
- 3-5 month timeline
- Technical problems (communication protocols, data processing)
- Some independent problem-solving

**High School (Grades 10-12):**
- Complex projects (IoT systems, algorithms)
- 4-8 month timeline
- Advanced problems (optimization, edge cases)
- Research-based solutions

## Photo Placeholder Guidelines

Each entry should have 5 photo placeholders showing:

1. **Circuit/hardware photos** - Breadboard connections, component assembly
2. **Code/debugging** - Serial monitor output, debugging process
3. **Testing process** - Experiments, measurements
4. **Handwritten notes** - Circuit diagrams, planning sketches (very important!)
5. **Progress results** - Working prototypes, test data

Format: `[照片占位符 N] Description of what photo should show`

## Example Timeline Structure

For a typical middle school IoT project (5 months):

**Month 1 (3-4 entries):** Problem identification, surveys, tool setup, initial learning
**Month 2 (5-6 entries):** Hardware learning, sensor testing, circuit basics
**Month 3 (6-7 entries):** Programming, module integration, debugging
**Month 4 (5-6 entries):** System testing, optimization, problem fixing
**Month 5 (3-4 entries):** Final testing, documentation, improvements

## Using the Script

Generate the Word document using:

```python
python scripts/generate_log.py --entries <log_entries_json>
```

The script accepts a JSON array of log entries and produces a formatted Word document.

## Quick Example

For a smart pill reminder box project:

```
Date: 2025.8.15
Content: 
- Programmed Bluetooth communication between phone and ESP32
- Learned RTC clock module for timing
- Installed hall sensors on pill box lids
- Set up EEPROM for data storage

Problems:
- Bluetooth connection unstable
- Timer accuracy ±2 minutes
- Hall sensor too sensitive

Solutions:
- Added auto-reconnect (3 retries)
- Switched to DS3231 high-precision RTC
- Added software debouncing

Photos:
[照片占位符 1] Phone app connection interface
[照片占位符 2] Breadboard circuit
[照片占位符 3] Serial monitor debugging
[照片占位符 4] Hall sensor installation
[照片占位符 5] Handwritten circuit diagram

Reflections:
Bluetooth issue took a long time. Thought the chip was broken, even replaced it. Teacher suggested checking the code - found the broadcast interval was too frequent. Changed to 500ms and it worked.
```
