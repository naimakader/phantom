import { useState } from "react";

const MODES = [
  {
    id: "normal",
    label: "Normal",
    icon: "✨",
    filter: "none",
    isDyslexia: false,
  },
  {
    id: "colorblind",
    label: "Colorblind",
    icon: "🔴",
    filter: "grayscale(100%)",
    isDyslexia: false,
  },
  {
    id: "lowvision",
    label: "Low vision",
    icon: "👁️",
    filter: "blur(1.5px) contrast(0.75)",
    isDyslexia: false,
  },
  {
    id: "dyslexia",
    label: "Dyslexia",
    icon: "📖",
    filter: "none",
    isDyslexia: true,
  },
];

function applyVisualMode(filter: string, isDyslexia: boolean) {
  const html = document.documentElement;
  html.style.filter = "";
  html.style.fontFamily = "";
  html.style.letterSpacing = "";
  html.style.wordSpacing = "";
  html.style.lineHeight = "";
  if (filter !== "none") html.style.filter = filter;
  if (isDyslexia) {
    html.style.fontFamily = "Arial, Helvetica, sans-serif";
    html.style.letterSpacing = "0.07em";
    html.style.wordSpacing = "0.18em";
    html.style.lineHeight = "1.9";
  }
}

export default function SimulationBar() {
  const [active, setActive] = useState("normal");
  const [loading, setLoading] = useState(false);

  const handleMode = async (mode: (typeof MODES)[0]) => {
    if (loading) return;
    setLoading(true);
    setActive(mode.id);
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab.id) return;
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: applyVisualMode,
        args: [mode.filter, mode.isDyslexia],
      });
    } catch (e) {
      console.warn("Could not apply simulation:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#16161f",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: "14px",
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#8888aa",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 10,
        }}
      >
        Simulate disability mode
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 6,
        }}
      >
        {MODES.map((mode) => {
          const isActive = active === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => handleMode(mode)}
              disabled={loading}
              style={{
                padding: "9px 4px",
                background: isActive ? "rgba(124,106,247,0.15)" : "#111118",
                border: `1px solid ${isActive ? "rgba(124,106,247,0.35)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 8,
                cursor: loading ? "wait" : "pointer",
                textAlign: "center",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
            >
              <div style={{ fontSize: 15, marginBottom: 4 }}>{mode.icon}</div>
              <div
                style={{
                  fontSize: 10,
                  color: isActive ? "#7c6af7" : "#8888aa",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {mode.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
