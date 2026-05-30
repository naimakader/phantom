import React, { useState } from "react";
import Header from "../components/Header";
import ScanButton from "../components/ScanButton";
import IssueList from "../components/IssueList";
import ScoreRing from "../components/ScoreRing";
import SimulationBar from "../components/SimulationBar";
import type { ScanResult } from "../types";

type View = "home" | "scanning" | "results" | "error";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"issues" | "fixed">("issues");
  const [tabId, setTabId] = useState<number>(0);

  const handleScan = async () => {
    setView("scanning");
    setErrorMsg("");

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id) {
      setErrorMsg("No active tab found.");
      setView("error");
      return;
    }

    if (
      tab.url?.startsWith("chrome://") ||
      tab.url?.startsWith("chrome-extension://") ||
      tab.url?.startsWith("edge://")
    ) {
      setErrorMsg(
        "Cannot scan browser system pages.\n\nGo to any real website first\ne.g. amazon.com or bbc.com",
      );
      setView("error");
      return;
    }

    setTabId(tab.id);

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["axe.min.js"],
      });

      const [scanResult] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: runAxeScan,
      });

      if (scanResult?.result) {
        setResult(scanResult.result as ScanResult);
        setView("results");
      } else {
        setErrorMsg(
          "Scan returned no results.\nTry refreshing the page and scanning again.",
        );
        setView("error");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(
        msg.includes("Cannot access")
          ? "Cannot scan this page.\nTry a regular website like amazon.com"
          : `Scan failed: ${msg}`,
      );
      setView("error");
    }
  };

  const handleReset = () => {
    setResult(null);
    setView("home");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "560px" }}
    >
      <Header onReset={view !== "home" ? handleReset : undefined} />
      {view === "home" && <HomeView onScan={handleScan} />}
      {view === "scanning" && <ScanningView />}
      {view === "error" && (
        <ErrorView message={errorMsg} onRetry={handleReset} />
      )}
      {view === "results" && result && (
        <ResultsView
          result={result}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabId={tabId}
        />
      )}
    </div>
  );
}

// ─── Home View ────────────────────────────────────────────────
function HomeView({ onScan }: { onScan: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          background: "#16161f",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14,
          padding: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(124,106,247,0.15)",
            border: "1px solid rgba(124,106,247,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
            fontSize: 22,
          }}
        >
          👁️
        </div>
        <h2
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#f0f0f8",
            marginBottom: 6,
          }}
        >
          Scan this page
        </h2>
        <p
          style={{ fontSize: 13, color: "#8888aa", lineHeight: 1.6, margin: 0 }}
        >
          Phantom runs 57 WCAG accessibility checks and shows you exactly what's
          broken — and how to fix it.
        </p>
      </div>
      <SimulationBar />
      <ScanButton onClick={onScan} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}
      >
        {[
          { label: "Contrast", icon: "🎨" },
          { label: "Alt Text", icon: "🖼️" },
          { label: "Keyboard", icon: "⌨️" },
          { label: "ARIA", icon: "🔖" },
          { label: "Forms", icon: "📋" },
          { label: "Links", icon: "🔗" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "#16161f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "10px 8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 16, marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontSize: 11, color: "#8888aa", fontWeight: 500 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Scanning View ────────────────────────────────────────────
function ScanningView() {
  const [tick, setTick] = useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  const messages = [
    "Loading axe-core engine...",
    "Checking color contrast ratios...",
    "Validating ARIA labels...",
    "Checking keyboard navigation...",
    "Analyzing form elements...",
    "Verifying image alt text...",
  ];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        gap: 20,
      }}
    >
      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      <div style={{ position: "relative", width: 72, height: 72 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid rgba(124,106,247,0.2)",
            borderTopColor: "#7c6af7",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: "50%",
            background: "rgba(124,106,247,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          👁️
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#f0f0f8",
            marginBottom: 6,
          }}
        >
          Scanning page{".".repeat((tick % 3) + 1)}
        </p>
        <p style={{ fontSize: 12, color: "#8888aa" }}>
          Running WCAG 2.2 accessibility checks
        </p>
      </div>
      <div
        style={{
          background: "#16161f",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          padding: "12px 16px",
          width: "100%",
        }}
      >
        {messages
          .slice(0, Math.min(tick + 1, messages.length))
          .map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 0",
                animation: "fadeUp 0.4s ease both",
              }}
            >
              <span style={{ color: "#00d4aa", fontSize: 12 }}>✓</span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "#8888aa",
                }}
              >
                {msg}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── Error View ───────────────────────────────────────────────
function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 36 }}>⚠️</div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#f0f0f8",
            marginBottom: 8,
          }}
        >
          Couldn't scan this page
        </p>
        <p
          style={{
            fontSize: 13,
            color: "#8888aa",
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}
        >
          {message}
        </p>
      </div>
      <button
        onClick={onRetry}
        style={{
          background: "rgba(124,106,247,0.15)",
          border: "1px solid rgba(124,106,247,0.3)",
          borderRadius: 10,
          padding: "10px 24px",
          color: "#7c6af7",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        ← Try another page
      </button>
    </div>
  );
}

// ─── Results View ─────────────────────────────────────────────
function ResultsView({
  result,
  activeTab,
  setActiveTab,
  tabId,
}: {
  result: ScanResult;
  activeTab: "issues" | "fixed";
  setActiveTab: (t: "issues" | "fixed") => void;
  tabId: number;
}) {
  const score = Math.max(0, Math.round(100 - result.violations.length * 3.5));

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          background: "#16161f",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <ScoreRing score={score} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: "#8888aa", marginBottom: 6 }}>
            Accessibility score
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Pill label={`${result.violations.length} issues`} color="coral" />
            <Pill label={`${result.passes.length} passed`} color="teal" />
            <Pill
              label={`${result.incomplete.length} warnings`}
              color="amber"
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#111118",
        }}
      >
        {(["issues", "fixed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: 11,
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab
                  ? "2px solid #7c6af7"
                  : "2px solid transparent",
              color: activeTab === tab ? "#7c6af7" : "#8888aa",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {tab === "issues"
              ? `Issues (${result.violations.length})`
              : `Passed (${result.passes.length})`}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <IssueList
          items={activeTab === "issues" ? result.violations : result.passes}
          type={activeTab}
          tabId={tabId}
        />
      </div>
    </div>
  );
}

function Pill({
  label,
  color,
}: {
  label: string;
  color: "coral" | "teal" | "amber";
}) {
  const map = {
    coral: { bg: "rgba(255,107,107,0.12)", text: "#ff6b6b" },
    teal: { bg: "rgba(0,212,170,0.12)", text: "#00d4aa" },
    amber: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" },
  };
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        padding: "3px 8px",
        borderRadius: 20,
        background: map[color].bg,
        color: map[color].text,
      }}
    >
      {label}
    </span>
  );
}

// ─── Runs INSIDE the webpage — no React, no imports ──────────
function runAxeScan() {
  return (window as any).axe.run().then((results: any) => ({
    violations: results.violations.map((v: any) => ({
      id: v.id,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      impact: v.impact,
      nodes: v.nodes.length,
      selector: v.nodes?.[0]?.target?.[0] ?? null,
    })),
    passes: results.passes.map((p: any) => ({
      id: p.id,
      description: p.description,
      help: p.help,
      impact: "none",
      nodes: p.nodes.length,
      selector: p.nodes?.[0]?.target?.[0] ?? null,
    })),
    incomplete: results.incomplete,
  }));
}
