# 👁️ Phantom — Accessibility Transformer

> A Chrome Extension that scans any website for accessibility issues, simulates how disabled users experience the web, generates instant code fixes, and tracks score improvements over time.

![Status](https://img.shields.io/badge/Status-Active-00d4aa?style=flat-square) ![Manifest V3](https://img.shields.io/badge/Manifest-V3-7c6af7?style=flat-square) ![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2-f59e0b?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square) ![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)

---

## The Problem

**1.3 billion people** have disabilities. **97% of websites** fail basic accessibility standards. Every existing tool — Lighthouse, axe DevTools, WAVE — only _reports_ problems. They show you a list and leave you alone.

**Phantom is different.** It finds the issue, shows you the broken code, generates the exact fix, and tracks whether the site is improving over time.

---

## Features

### 🔍 Real-Time Accessibility Scanner

Runs 57 WCAG 2.2 checks against any website in under 3 seconds using the axe-core engine. Every issue is categorized by severity — Critical, Serious, Moderate, Minor.

### ✦ AI Fix Engine

Click any issue → see the actual broken HTML extracted from the live page → get the exact corrected code. Smart fixes for:

- Missing form labels — wraps inputs in correct `<label>` tags
- Missing alt text — reads filename and generates descriptive alt text
- Bad color contrast — swaps colors to meet WCAG AA ratio
- Invalid ARIA attributes — removes bad attrs, adds correct `role` and `aria-label`
- Wrong heading order — corrects heading level numbers
- Broken list structure — wraps stray children in proper `<li>` tags

Full before/after diff with one-click copy to clipboard.

### 📊 Scan History

Every scan is saved automatically. The history panel groups scans by website and shows:

- Accessibility score per scan
- Number of issues found
- Exact timestamp
- Score delta (↑ improved / ↓ regressed / → unchanged) vs previous scan

Stores up to 50 scans persistently using Chrome storage.

### 🎭 Disability Simulation Modes

Experience any website through the eyes of a disabled user — live, in the browser, no page reload:

- **Colorblind** — grayscale filter simulating monochromacy
- **Low Vision** — blur + contrast reduction
- **Dyslexia** — font, spacing, and line-height adjustments
- **Normal** — reset to default

### 📈 Accessibility Score Ring

Animated SVG score ring (0–100) with automatic color coding:

- 🟢 80–100 — Good
- 🟡 50–79 — Needs Work
- 🔴 0–49 — Critical

---

## Tech Stack

| Technology                   | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| React 18 + TypeScript        | Popup UI and component architecture       |
| Chrome Extension Manifest V3 | Browser integration and permissions       |
| axe-core                     | WCAG 2.2 accessibility engine — 57 rules  |
| chrome.scripting API         | Live DOM injection and element extraction |
| chrome.storage API           | Persistent scan history across sessions   |
| Vite                         | Build system with multi-entry compilation |

---

## How It Works

```
User clicks scan
      ↓
chrome.tabs.query() — finds active tab
      ↓
chrome.scripting.executeScript() — injects axe.min.js into the live page
      ↓
axe.run() — scans 57 WCAG rules against the real DOM
      ↓
Results returned to React popup
      ↓
Score calculated + issues rendered with severity badges
      ↓
Scan saved to chrome.storage with timestamp and score delta
      ↓
User expands any issue → clicks "Generate Fix"
      ↓
chrome.scripting extracts real broken HTML via CSS selector
      ↓
Fix engine generates corrected HTML based on violation type
      ↓
Before/After diff displayed — copy to clipboard in one click
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/naimakader/phantom.git
cd phantom

# Install dependencies
npm install

# Build the extension
npm run build
```

**Load in Chrome:**

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder

---

## Project Structure

```
phantom/
├── src/
│   ├── popup/
│   │   ├── App.tsx            # Main app — 4 views: home, scanning, results, error
│   │   ├── main.tsx           # React entry point
│   │   └── index.css          # Design system — CSS variables, typography
│   ├── components/
│   │   ├── Header.tsx         # Top bar with logo, history button, navigation
│   │   ├── ScoreRing.tsx      # Animated SVG accessibility score
│   │   ├── IssueList.tsx      # Expandable issue cards with severity badges
│   │   ├── ScanButton.tsx     # Main scan trigger with hover animation
│   │   ├── SimulationBar.tsx  # 4 disability simulation modes
│   │   ├── FixPanel.tsx       # AI Fix Engine — before/after code diff
│   │   └── HistoryPanel.tsx   # Scan history with score delta tracking
│   ├── background/
│   │   └── index.ts           # Chrome service worker
│   ├── content/
│   │   └── index.ts           # Page injection script for simulations
│   └── types.ts               # TypeScript interfaces
├── public/
│   └── manifest.json          # Chrome Extension manifest v3
└── vite.config.ts             # Multi-entry build configuration
```

---

## Roadmap

- [x] Core accessibility scanner — 57 WCAG 2.2 rules
- [x] Score ring with severity color coding
- [x] Disability simulation modes (colorblind, low vision, dyslexia)
- [x] AI Fix Engine with before/after code diff
- [x] Scan history with score delta tracking
- [ ] Real-time element highlighting — draw borders around broken elements
- [ ] Export full PDF accessibility report
- [ ] Claude AI-powered natural language fix explanations

---

## Why I Built This

Most accessibility tools tell developers _what_ is broken. Nobody tells them _how_ to fix it or whether they're actually improving. Phantom bridges both gaps — making the web more accessible for 1.3 billion people who depend on it every day.

---

Built by [Naima Kader](https://github.com/naimakader)
