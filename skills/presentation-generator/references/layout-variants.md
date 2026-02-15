# Layout Variants Catalog

Each slide type has 3-4 layout variants. **Select different variants for each project** to ensure visual diversity. Within a single presentation, **rotate variants** so adjacent slides look different.

---

## Cover Slide (封面) — 4 Variants

### Cover-A: Center Icon (居中图标型)
```
┌──────────────────────────────┐
│  ═══════ top bar ═══════════ │
│                              │
│          [icon]              │
│     Title Line 1             │
│     Title Line 2             │
│     subtitle (accent color)  │
│                              │
│     name · grade · school    │
│                              │
│          [photo right half]  │
└──────────────────────────────┘
```
- Icon centered above title
- Photo on right side (if available), text on left
- Best for: projects with a strong hero product photo

### Cover-B: Full Bleed Photo (全图背景型)
```
┌──────────────────────────────┐
│  [photo covers full slide]   │
│  [dark overlay 50%]          │
│                              │
│     Title Line 1             │
│     Title Line 2             │
│     subtitle                 │
│                              │
│     name · grade · school    │
└──────────────────────────────┘
```
- Photo fills entire background with semi-transparent dark overlay
- All text in white/light colors on top
- Best for: projects with dramatic photos (fire tests, outdoor scenes)

### Cover-C: Split Diagonal (对角分割型)
```
┌──────────────────────────────┐
│ Dark bg         ╱            │
│                ╱   [photo    │
│  Title        ╱    area]     │
│  subtitle    ╱               │
│             ╱                │
│  name      ╱                 │
│═══════════╱══════════════════│
└──────────────────────────────┘
```
- Simulated with overlapping shapes: dark rectangle left + photo right
- Bottom accent bar spans full width
- Best for: modern, tech-forward projects

### Cover-D: Minimal Text (极简文字型)
```
┌──────────────────────────────┐
│  ═══════ top bar ═══════════ │
│                              │
│                              │
│   small label (muted)        │
│   BIG TITLE (48pt, bold)     │
│   subtitle (accent)          │
│                              │
│   name · grade · school      │
│                              │
└──────────────────────────────┘
```
- No photo on cover — pure typography
- Title is oversized for impact
- Best for: when product photo will be revealed on a later slide

**Implementation notes:**
- Cover-A: `addImage` right side with `sizing: contain`, text left-aligned at x=0.8
- Cover-B: `addImage` full slide + `addShape RECTANGLE` with `transparency: 50` overlay
- Cover-C: Two overlapping rectangles at angle (use shape positioning to simulate)
- Cover-D: No image, just text blocks with generous vertical spacing

---

## Section Header (章节标题) — 3 Variants

### SectionHeader-A: Left Bar + Icon (左竖条+图标)
```
┌──────────────────────────────┐
│█ [icon] Section Title        │
│█                             │
│  ... content below ...       │
└──────────────────────────────┘
```
- Thin colored bar on far left (x=0, w=0.12)
- Icon + title in top area
- Content area below (y > 1.0)

### SectionHeader-B: Top Banner (顶部横幅)
```
┌──────────────────────────────┐
│ ██████████████████████████── │
│ │ [icon]  Section Title    │ │
│ ██████████████████████████── │
│                              │
│  ... content below ...       │
└──────────────────────────────┘
```
- Colored horizontal banner at top (h=0.8, accent color with 90% opacity)
- Icon and title inside the banner in white
- Content starts below banner

### SectionHeader-C: Accent Underline (底部强调线)
```
┌──────────────────────────────┐
│                              │
│  Section Title               │
│  ══════════ (accent color)   │
│                              │
│  ... content below ...       │
└──────────────────────────────┘
```
- No bar or banner — just title text with a short colored line beneath
- Minimalist, Apple-inspired
- More whitespace, content starts lower (y > 1.3)

---

## Content Layouts — 5 Variants

### Content-A: Card Grid (卡片网格)
```
┌──────────────────────────────┐
│  Section Title               │
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ card │ │ card │ │ card │ │
│  │      │ │      │ │      │ │
│  └──────┘ └──────┘ └──────┘ │
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ card │ │ card │ │ card │ │
│  └──────┘ └──────┘ └──────┘ │
└──────────────────────────────┘
```
- 2×3 or 3×2 grid of equal-sized cards
- Each card: colored top stripe + title + description
- Good for: innovation points, features list, contribution items
- Card shadow: `{ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.15 }`

### Content-B: Photo + List (图文左右)
```
┌──────────────────────────────┐
│  Section Title               │
│  ┌─────────┐  • item 1      │
│  │         │  • item 2      │
│  │  photo  │  • item 3      │
│  │         │  • item 4      │
│  └─────────┘                 │
└──────────────────────────────┘
```
- Photo on left (40% width), text/list on right
- Or reversed: text left, photo right
- Good for: component details, sensor specs

### Content-C: Comparison Arrows (对比箭头)
```
┌──────────────────────────────┐
│  Section Title               │
│  ┌─── problem ───┐ → ┌─── solution ───┐ │
│  ┌─── problem ───┐ → ┌─── solution ───┐ │
│  ┌─── problem ───┐ → ┌─── solution ───┐ │
└──────────────────────────────┘
```
- Left cards (warm/red tint) → arrow → right cards (cool/green tint)
- Numbered rows (困难1, 困难2, 困难3)
- Good for: difficulties & solutions

### Content-D: Timeline / Process (时间线/流程)
```
┌──────────────────────────────┐
│  Section Title               │
│  ┌────┐   ┌────┐   ┌────┐   │
│  │ S1 │   │ S2 │   │ S3 │   │
│  │img │   │img │   │img │   │
│  │text│   │text│   │text│   │
│  └────┘   └────┘   └────┘   │
└──────────────────────────────┘
```
- 3 equal columns with colored top stripe
- Each column: stage number, subtitle, photo, description
- Good for: making process, development phases

### Content-E: Hero Number (大数字突出)
```
┌──────────────────────────────┐
│  Section Title               │
│  ┌──── ──── ──── ────┐      │
│  │ 58次│100%│<3秒│ 0  │      │
│  │label│label│label│label│     │
│  └──── ──── ──── ────┘      │
│                              │
│  [photo area]    [detail]    │
└──────────────────────────────┘
```
- Top row: 4 stat cards with oversized numbers
- Bottom: photo left + detail text right
- Good for: test results, key metrics

---

## Architecture / Flow Layouts — 3 Variants

### Flow-A: Three Boxes (三段式流程)
```
┌──────────────────────────────┐
│  Section Title               │
│ ┌─────┐  →  ┌─────┐  →  ┌─────┐ │
│ │Box 1│     │Box 2│     │Box 3│ │
│ │img  │     │img  │     │text │ │
│ │text │     │text │     │     │ │
│ └─────┘     └─────┘     └─────┘ │
└──────────────────────────────┘
```
- 3 equal boxes with arrow connectors between them
- Each box: colored top stripe, title, photo, description
- Arrow icons between boxes with communication protocol labels

### Flow-B: Center Hub (中心辐射)
```
┌──────────────────────────────┐
│  Section Title               │
│       ┌───┐                  │
│  ┌───┐│HUB│┌───┐             │
│       └───┘                  │
│       ┌───┐                  │
└──────────────────────────────┘
```
- Central element (e.g., ESP32 controller) with connected nodes
- Lines/arrows radiating outward
- Good for: system with one central processor and multiple peripherals

### Flow-C: Vertical Stack (垂直堆叠)
```
┌──────────────────────────────┐
│  Section Title               │
│  ┌─── Layer 3: Cloud ──────┐ │
│  ┌─── Layer 2: Process ────┐ │
│  ┌─── Layer 1: Sensors ────┐ │
│                              │
│  [detail text / photo]       │
└──────────────────────────────┘
```
- Stacked horizontal bars representing layers
- Bottom-up: hardware → processing → cloud/output
- Good for: IoT systems, layered architectures

---

## Emotional / Closing Layouts — 2 Variants

### Closing-A: Dark Background Quote (暗色引用)
```
┌──────────────────────────────┐  (dark bg)
│  ═══════ top bar ═══════════ │
│  [icon] Title                │
│                              │
│  "Quote text in accent..."   │
│                              │
│  ★ learning point 1          │
│  ★ learning point 2          │
│  ★ learning point 3          │
└──────────────────────────────┘
```
- Dark background (matches cover)
- Golden/accent italic quote
- Star-bullet learning points in muted light text

### Closing-B: Light Background Cards (浅色卡片)
```
┌──────────────────────────────┐  (light bg)
│  Section Title               │
│  ┌──────────────────────┐    │
│  │  "Big quote text"    │    │
│  └──────────────────────┘    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐│
│  │ L1 │ │ L2 │ │ L3 │ │ L4 ││
│  └────┘ └────┘ └────┘ └────┘│
└──────────────────────────────┘
```
- Light background with large quote card
- Bottom row: 4 small learning-point cards
- Uses section header style for consistency

---

## Variant Selection Algorithm

```javascript
function selectVariant(slideType, projectIndex, slideIndex) {
  const variants = {
    cover: ["A", "B", "C", "D"],
    sectionHeader: ["A", "B", "C"],
    content: ["A", "B", "C", "D", "E"],
    flow: ["A", "B", "C"],
    closing: ["A", "B"],
  };

  const options = variants[slideType];
  if (!options) return "A";

  // Mix project-level and slide-level variation
  const seed = (projectIndex * 7 + slideIndex * 3) % options.length;
  return options[seed];
}
```

**Rules for within-presentation variety:**
1. The 2 detail slides (5, 6) should use DIFFERENT content layouts
2. Data slides (3, 9) should use DIFFERENT data layouts
3. Never use the same section header variant 3 times in a row
4. At least ONE slide should feature a full-width photo
