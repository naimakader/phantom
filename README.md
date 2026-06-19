# 👁️ Phantom — Accessibility Transformer

> A Chrome Extension that scans any website for accessibility issues, highlights broken elements live on the page, simulates disability modes, generates code fixes, exports professional PDF reports, and tracks score improvements over time.

![Status](https://img.shields.io/badge/Status-Active-00d4aa?style=flat-square) ![Manifest V3](https://img.shields.io/badge/Manifest-V3-7c6af7?style=flat-square) ![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2-f59e0b?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square) ![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)

---

## The Problem

**1.3 billion people** have disabilities. **97% of websites** fail basic accessibility standards. Every existing tool — Lighthouse, axe DevTools, WAVE — only _reports_ problems. They give you a list and leave you alone.

**Phantom is different.** It finds the issue, highlights the exact broken element on the live page, shows you the broken code, generates the fix, exports a shareable report, and tracks whether the site improves over time.

---

## Features

### 📄 PDF Audit Report Export

One click generates a professional multi-page PDF report — the kind accessibility consultants charge clients for. Includes a branded cover page with score circle and summary stats, followed by every violation listed with severity badge, description, affected element count, and WCAG rule ID. Downloads instantly as `phantom-report-{domain}.pdf`.

### 🔴 Live Element Highlighter

After scanning, click "Highlight issues on page" — Phantom injects colored glowing borders directly onto every broken element on the live website:

- 🔴 **Red** — Critical violations
- 🟠 **Orange** — Serious violations
- 🟡 **Yellow** — Moderate violations
- ⬜ **Grey** — Minor violations

Hover any highlighted element to see a tooltip with the exact issue name. A floating panel shows the total count with a one-click clear button.

### 🔍 Real-Time Accessibility Scanner

Runs 57 WCAG 2.2 checks against any website in under 3 seconds using the axe-core engine. Every issue categorized by severity with affected element count.

### ✦ AI Fix Engine

Click any issue → see the actual broken HTML extracted from the live page → get the exact corrected code. Smart fixes for missing labels, alt text, bad contrast, invalid ARIA, wrong heading order, and broken list structure. Full before/after diff with one-click copy.

### 📊 Scan History

Every scan saved automatically. History panel groups scans by website and shows score, issue count, timestamp, and delta (↑ improved / ↓ regressed / → unchanged) vs the previous scan. Stores up to 50 scans persistently using `chrome.storage`.

### 🎭 Disability Simulation Modes

Experience any website through the eyes of a disabled user — live, no page reload: Colorblind, Low Vision, Dyslexia, and Normal reset modes.

### 📈 Accessibility Score Ring

Animated SVG score ring (0–100) with automatic color coding — Green 80+, Yellow 50-79, Red below 50.

---

## Tech Stack

| Technology                   | Purpose                                             |
| ---------------------------- | --------------------------------------------------- |
| React 18 + TypeScript        | Popup UI and component architecture                 |
| Chrome Extension Manifest V3 | Browser integration and permissions                 |
| axe-core                     | WCAG 2.2 accessibility engine — 57 rules            |
| jsPDF                        | Client-side PDF generation for audit reports        |
| chrome.scripting API         | Live DOM injection and element extraction           |
| chrome.storage API           | Persistent scan history across sessions             |
| CSS Injection                | Live element highlighting with color-coded outlines |
| Vite                         | Multi-entry build system                            |

---

## How It Works

```
User clicks scan
      ↓
chrome.tabs.query() finds active tab
      ↓
chrome.scripting injects axe.min.js into the live page
      ↓
axe.run() scans 57 WCAG rules against the real DOM
      ↓
Results rendered — score calculated, scan saved to history
      ↓
User can: highlight broken elements live → generate AI fixes → export PDF report
      ↓
Each action reads live page data via chrome.scripting and
renders results back inside the React popup
```

---

## Getting Started

```bash
git clone https://github.com/naimakader/phantom.git
cd phantom
npm install
npm run build
```

**Load in Chrome:**

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `dist/` folder

---

## Project Structure

```
phantom/
├── src/
│   ├── popup/
│   │   ├── App.tsx              # Main app — 4 views: home, scanning, results, error
│   │   ├── main.tsx             # React entry point
│   │   └── index.css            # Design system
│   ├── components/
│   │   ├── Header.tsx           # Top bar, history button
│   │   ├── ScoreRing.tsx        # Animated SVG accessibility score
│   │   ├── IssueList.tsx        # Expandable issue cards
│   │   ├── ScanButton.tsx       # Main scan trigger
│   │   ├── SimulationBar.tsx    # 4 disability simulation modes
│   │   ├── FixPanel.tsx         # AI Fix Engine — before/after code diff
│   │   ├── HistoryPanel.tsx     # Scan history with score delta tracking
│   │   ├── HighlightToggle.tsx  # Live element highlighter
│   │   └── ExportButton.tsx     # PDF report generator
│   ├── background/index.ts      # Chrome service worker
│   ├── content/index.ts         # Page injection script
│   └── types.ts                 # TypeScript interfaces
├── public/manifest.json         # Chrome Extension manifest v3
└── vite.config.ts               # Multi-entry build configuration
```

---

## Roadmap

- [x] Core accessibility scanner — 57 WCAG 2.2 rules
- [x] Score ring with severity color coding
- [x] Disability simulation modes
- [x] AI Fix Engine with before/after code diff
- [x] Scan history with score delta tracking
- [x] Live element highlighter
- [x] PDF audit report export
- [ ] Multi-page site audit — crawl entire domains
- [ ] Score trend chart — visualize improvement over time

---

## Why I Built This

Most accessibility tools tell developers _what_ is broken. Nobody shows them _where_ it is, tells them _how_ to fix it, lets them _share_ the findings, or tracks whether they're _improving_. Phantom solves all four — making the web more accessible for 1.3 billion people who depend on it every day.

---

Built by [Naima Kader](https://github.com/naimakader)
