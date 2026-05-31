# 👁️ Phantom — Accessibility Transformer

> A Chrome Extension that scans any website for accessibility issues, simulates how disabled users experience the web, and generates instant code fixes — powered by AI.

![Phantom Demo](https://img.shields.io/badge/Status-Active-00d4aa?style=flat-square) ![Manifest V3](https://img.shields.io/badge/Manifest-V3-7c6af7?style=flat-square) ![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2-f59e0b?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square)

---

## The Problem

**1.3 billion people** have disabilities. **97% of websites** fail basic accessibility standards. Every existing tool — Lighthouse, axe DevTools, WAVE — only *reports* problems. They show you a list and leave you alone.

**Phantom is different.** It finds the issue, shows you the broken code, and generates the exact fix — right inside your browser.

---

## Features

### 🔍 Real-Time Accessibility Scanner
Runs 57 WCAG 2.2 checks against any website in under 3 seconds using the axe-core engine. Every issue is categorized by severity — Critical, Serious, Moderate, Minor.

### ✦ AI Fix Engine
Click any issue → see the actual broken HTML extracted from the live page → get the exact corrected code. Before/After diff with one-click copy.

### 🎭 Disability Simulation Modes
Experience any website through the eyes of a disabled user — live, in the browser:
- **Colorblind** — grayscale filter simulating monochromacy
- **Low Vision** — blur + contrast reduction
- **Dyslexia** — font, spacing, and line-height adjustments
- **Normal** — reset to default

### 📊 Accessibility Score
Visual score ring (0–100) with color-coded rating. Green = Good, Yellow = Needs Work, Red = Critical.

### 📋 Detailed Issue Cards
Every issue expands to show description, number of affected elements, severity, and a direct link to the WCAG fix guide on deque.com.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Popup UI |
| Chrome Extension Manifest V3 | Browser integration |
| axe-core (WebAssembly) | WCAG 2.2 accessibility engine |
| chrome.scripting API | Live page injection |
| chrome.storage API | Persistent settings |
| Vite | Build system |

---

## How It Works

```
User clicks scan
      ↓
chrome.tabs.query() — finds active tab
      ↓
chrome.scripting.executeScript() — injects axe.min.js into the page
      ↓
axe.run() — scans 57 WCAG rules against the live DOM
      ↓
Results returned to React popup
      ↓
Score calculated + issues rendered
      ↓
User clicks "Generate Fix" on any issue
      ↓
chrome.scripting extracts real broken HTML using CSS selector
      ↓
Smart fix engine generates corrected HTML
      ↓
Before/After diff displayed — copy to clipboard
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
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist/` folder

---

## Project Structure

```
phantom/
├── src/
│   ├── popup/
│   │   ├── App.tsx          # Main app — 4 views: home, scanning, results, error
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Design system — CSS variables, fonts
│   ├── components/
│   │   ├── Header.tsx       # Top bar with logo and navigation
│   │   ├── ScoreRing.tsx    # Animated SVG accessibility score
│   │   ├── IssueList.tsx    # Expandable issue cards
│   │   ├── ScanButton.tsx   # Main scan trigger
│   │   ├── SimulationBar.tsx # Disability simulation modes
│   │   └── FixPanel.tsx     # AI Fix Engine — before/after diff
│   ├── background/
│   │   └── index.ts         # Service worker
│   ├── content/
│   │   └── index.ts         # Page injection script
│   └── types.ts             # TypeScript interfaces
├── public/
│   └── manifest.json        # Chrome Extension config
└── vite.config.ts           # Build configuration
```

---

## Roadmap

- [x] Core accessibility scanner
- [x] Score ring + severity badges
- [x] Disability simulation modes
- [x] AI Fix Engine with before/after diff
- [ ] Export full PDF accessibility report
- [ ] Scan history — track score over time
- [ ] Real-time element highlighting on page
- [ ] Claude AI-powered natural language fix explanations

---

## Why I Built This

Most accessibility tools tell developers *what* is broken. Nobody tells them *how* to fix it. Phantom bridges that gap — making the web more accessible for 1.3 billion people who depend on it every day.

---

Built by [Naima Kader](https://github.com/naimakader)