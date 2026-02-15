# Design Themes Catalog

Each theme defines: color palette, font pairing, background strategy, accent elements, and overall mood. **Select ONE theme per project — never mix themes.**

---

## Theme 1: Fire & Safety (火焰安全)

**Best for:** Fire safety, emergency response, security systems, alarm devices

```javascript
const C = {
  darkBg:   "1B1B2F",   // deep navy
  accent1:  "E63946",   // fire red
  accent2:  "FF8C42",   // warm orange
  accent3:  "457B9D",   // steel blue
  lightBg:  "FFF8F0",   // warm cream
  cardBg:   "FFFFFF",
  textDark: "1A1A2E",
  textMid:  "555566",
  textLight:"FFFFFF",
  textMuted:"999999",
  tagline:  "F4A261",   // golden
  green:    "4CAF50",
};
const FONT_H = "Georgia", FONT_B = "Calibri";
```

**Visual elements:**
- Top decorative bar: red stripe (0.06h) + orange stripe (0.03h)
- Left accent bar on content pages (0.12w, colored by section)
- Card-based layouts with soft shadows
- Fire icon (FaFire) as brand element on cover and closing

---

## Theme 2: Nature & Environment (自然环保)

**Best for:** Environmental monitoring, plant growth, water quality, air purification, ecology

```javascript
const C = {
  darkBg:   "1A2F1A",   // deep forest
  accent1:  "2D6A4F",   // forest green
  accent2:  "52B788",   // leaf green
  accent3:  "95D5B2",   // mint
  lightBg:  "F0F7F0",   // pale green tint
  cardBg:   "FFFFFF",
  textDark: "1B2A1B",
  textMid:  "4A6A4A",
  textLight:"FFFFFF",
  textMuted:"8A9A8A",
  tagline:  "B7E4C7",   // soft mint
  green:    "40916C",
};
const FONT_H = "Cambria", FONT_B = "Calibri";
```

**Visual elements:**
- Top decorative bar: gradient green (dark→light, two stripes)
- Rounded corner cards (simulate with rectangles + shadow)
- Leaf icon (FaLeaf) as brand element
- Organic feel with generous whitespace

---

## Theme 3: Tech & Robotics (科技机器人)

**Best for:** Robots, AI, Arduino/ESP32 projects, smart devices, automation

```javascript
const C = {
  darkBg:   "0F0F23",   // midnight blue
  accent1:  "6C63FF",   // electric purple
  accent2:  "00D2FF",   // cyan
  accent3:  "FF6B6B",   // coral
  lightBg:  "F5F5FF",   // lavender tint
  cardBg:   "FFFFFF",
  textDark: "1A1A3E",
  textMid:  "555577",
  textLight:"FFFFFF",
  textMuted:"9999BB",
  tagline:  "A5A0FF",   // soft purple
  green:    "00C853",
};
const FONT_H = "Calibri", FONT_B = "Calibri";
```

**Visual elements:**
- Top decorative bar: purple stripe + cyan stripe
- Geometric accent: small diagonal line or dot grid in background corners
- Robot icon (FaRobot) as brand element
- Clean, modern, slightly futuristic feel

---

## Theme 4: Health & Medical (健康医疗)

**Best for:** Medicine dispensers, health monitoring, assistive devices, elderly care, accessibility

```javascript
const C = {
  darkBg:   "1A2744",   // deep blue
  accent1:  "0077B6",   // medical blue
  accent2:  "00B4D8",   // sky blue
  accent3:  "E63946",   // emergency red
  lightBg:  "F0F8FF",   // alice blue
  cardBg:   "FFFFFF",
  textDark: "1A2744",
  textMid:  "4A6A8A",
  textLight:"FFFFFF",
  textMuted:"8AAACC",
  tagline:  "90E0EF",   // light cyan
  green:    "06D6A0",
};
const FONT_H = "Georgia", FONT_B = "Calibri";
```

**Visual elements:**
- Top decorative bar: blue + lighter blue stripes
- Cross/heart icon (FaHeartbeat) as brand element
- Clean, trustworthy, professional feel
- Blue-dominant color usage conveys reliability

---

## Theme 5: Urban & Transportation (城市交通)

**Best for:** Traffic systems, smart city, navigation, parking, public transportation

```javascript
const C = {
  darkBg:   "212529",   // charcoal
  accent1:  "FCA311",   // amber/yellow
  accent2:  "E85D04",   // traffic orange
  accent3:  "14213D",   // dark navy
  lightBg:  "FFFBF0",   // warm white
  cardBg:   "FFFFFF",
  textDark: "212529",
  textMid:  "555555",
  textLight:"FFFFFF",
  textMuted:"999999",
  tagline:  "FCBF49",   // golden
  green:    "2EC4B6",
};
const FONT_H = "Calibri", FONT_B = "Calibri";
```

**Visual elements:**
- Top decorative bar: amber + orange stripes
- Traffic light icon (FaTrafficLight) or map icon (FaMapMarkerAlt)
- Bold, high-contrast design
- Industrial/urban aesthetic

---

## Theme 6: Ocean & Water (海洋水利)

**Best for:** Water quality, aquatic life, flood prevention, marine research, irrigation

```javascript
const C = {
  darkBg:   "0B132B",   // deep ocean
  accent1:  "1C7293",   // ocean blue
  accent2:  "3DBCE5",   // sky blue
  accent3:  "F97068",   // coral accent
  lightBg:  "F0FAFF",   // ice blue
  cardBg:   "FFFFFF",
  textDark: "0B132B",
  textMid:  "4A6A8A",
  textLight:"FFFFFF",
  textMuted:"8AAABB",
  tagline:  "6FFFE9",   // aqua mint
  green:    "5BC0BE",
};
const FONT_H = "Cambria", FONT_B = "Calibri";
```

**Visual elements:**
- Top decorative bar: ocean blue + sky blue stripes
- Water drop icon (FaTint) or wave motif
- Flowing, calm aesthetic
- Cool-toned throughout

---

## Theme Selection Algorithm

```
function selectTheme(projectName, projectDomain) {
  // 1. Try domain mapping first
  const domainMap = {
    "fire|消防|灭火|安全|报警": "fire_safety",
    "植物|环境|空气|水质|生态|绿色": "nature_environment",
    "机器人|智能|AI|自动|识别|跟随": "tech_robotics",
    "医疗|健康|药|老人|残疾|辅助": "health_medical",
    "交通|城市|车|停车|红绿灯|导航": "urban_transportation",
    "水|海洋|鱼|灌溉|防洪|水质": "ocean_water",
  };

  for (const [keywords, theme] of Object.entries(domainMap)) {
    if (new RegExp(keywords).test(projectName + projectDomain)) {
      return theme;
    }
  }

  // 2. Fallback: deterministic hash from project name
  let hash = 0;
  for (const ch of projectName) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  const themes = Object.values(domainMap);
  return themes[Math.abs(hash) % themes.length];
}
```

---

## Adding New Themes

To add a theme, define:
1. `C` color object (12 colors: darkBg, accent1-3, lightBg, cardBg, textDark/Mid/Light/Muted, tagline, green)
2. Font pairing (FONT_H for headings, FONT_B for body)
3. Visual elements description (top bar, accent elements, brand icon, overall mood)
4. Domain keywords for automatic selection
