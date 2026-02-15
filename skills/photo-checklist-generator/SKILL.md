---
name: photo-checklist-generator
description: Generate project photo shooting checklists for science and technology innovation competitions. Use when users need to create a photo documentation checklist (照片拍摄清单) for student projects, especially for competitions like National Youth Science and Technology Innovation Competition (全国青少年科技创新大赛) or Beijing Jinpeng Science and Technology Forum (北京金鹏科技论坛). Outputs a formatted Word document (.docx) with stages, photo content items, importance markers, and tracking columns.
---

# Photo Checklist Generator

生成科创项目的照片拍摄清单（Word 表格）。

## ⚠️ 重要：输出要求

**必须直接生成 Word 文档（.docx），输出内容是一个纯表格，用于打印后勾选记录。**

❌ 不要生成 Markdown 文件
❌ 不要添加"拍摄技巧"、"存储建议"等额外说明文字
❌ 不要生成"使用说明"、"照片命名规范"等内容
✅ 只生成：标题 + 信息栏 + 表格 + 统计说明 + 签字栏

## 输出格式

**横版 Word 文档（.docx）**，包含：

1. **标题**：`{项目名称} - 项目照片拍摄清单`
2. **信息栏**：学生___  老师___  周期___ 至 ___
3. **表格**（核心内容）：
   | 序号 | 阶段 | 照片内容 | 重要性 | 拍摄日期 | 照片1 | 照片2 | 照片3 | 照片4 |
   - 阶段列：同一阶段的行合并单元格
   - 重要性列：必拍项标记 ⭐⭐⭐
   - 照片列：空白或 □ 用于勾选
4. **统计说明**：`⭐⭐⭐ 为竞赛必拍，共X项 | 共X项内容`
5. **签字栏**：`完成确认：___  日期：___`

## 工作流程

### Step 1：获取项目信息

如果上下文中已有项目信息（代码、文档、方案说明等），直接使用，**不需要再询问用户**。

如果没有项目信息，只需确认：
- 项目名称
- 项目类型（硬件/软件/系统集成）

### Step 2：直接生成 Word 文档

复制 `assets/checklist-template.js` 模板，修改 `photoList` 数组，运行生成：

```bash
cp {skill_path}/assets/checklist-template.js generate-checklist.js
# 修改 CONFIG.projectName 和 photoList 数组
node generate-checklist.js
```

**关键代码结构**：
```javascript
const CONFIG = {
    projectName: "项目名称",
    outputPath: "/mnt/user-data/outputs/",
    outputFileName: "照片拍摄清单.docx"
};

const photoList = [
    { stage: "问题发现", content: "用户访谈现场", important: "⭐⭐⭐" },
    { stage: "问题发现", content: "问卷调研执行", important: "" },
    // ... 根据项目定制
];
```

### Step 3：输出文件

将生成的 `.docx` 文件保存到用户的工作目录，并提供下载链接。

## 标准阶段与照片项（参考）

根据项目类型选择适用的阶段和照片项：

| 阶段 | 典型照片项 | 必拍项 ⭐⭐⭐ |
|------|-----------|-------------|
| 问题发现 | 小组讨论、用户访谈、问卷调研、用户画像 | 用户访谈、问卷调研 |
| 方案设计 | 技术讨论、手绘设计图、材料选型 | 手绘设计图 |
| 硬件制作 | 元器件全家福、各模块特写、接线过程、完成照 | 元器件全家福、接线过程、完成照 |
| 软件开发 | 编写代码、调试界面、首次运行成功 | 编写代码、首次运行成功 |
| 测试优化 | 功能测试、用户测试、数据记录 | 功能测试、用户测试 |
| 成果展示 | 作品正面照、功能演示、答辩讲解、团队合影 | 作品正面照、答辩讲解、团队合影 |

## 竞赛必拍项（⭐⭐⭐）

以下是竞赛评审通常要求的照片：
- 用户访谈/问卷调研现场
- 手绘系统设计图
- 元器件全家福（白底摆拍）
- 学生接线/焊接过程
- 系统首次运行成功
- 核心功能测试
- 用户实际使用测试
- 最终作品正面照
- 学生讲解/答辩
- 学生与作品合影
- 团队与指导老师合影

## 注意事项

1. **直接生成**：不要询问用户太多问题，根据已有项目信息直接生成
2. **表格为主**：输出就是一个可打印的表格，不需要任何额外说明
3. **Word 格式**：必须输出 .docx，不要输出 Markdown
4. **横版排版**：表格列较多，使用横版（Landscape）排版
