import { useState } from "react";
import type { Issue } from "../types";

interface HighlightToggleProps {
  violations: Issue[];
  tabId: number;
}

type HighlightState = "off" | "on" | "loading";

// ── Runs inside the webpage ───────────────────────────────────
function injectHighlights(
  violations: { selector: string; impact: string; help: string }[],
) {
  // Clean up any previous highlights first
  document.getElementById("phantom-styles")?.remove();
  document.getElementById("phantom-counter")?.remove();
  document.querySelectorAll("[data-phantom]").forEach((el) => {
    el.removeAttribute("data-phantom");
    el.classList.remove(
      "phantom-critical",
      "phantom-serious",
      "phantom-moderate",
      "phantom-minor",
    );
  });

  // Inject highlight styles
  const style = document.createElement("style");
  style.id = "phantom-styles";
  style.textContent = `
    [data-phantom] {
      outline-offset: 3px !important;
      position: relative !important;
      cursor: pointer !important;
      transition: outline 0.15s !important;
    }
    .phantom-critical {
      outline: 2px solid #ff4444 !important;
      box-shadow: 0 0 0 4px rgba(255,68,68,0.15) !important;
    }
    .phantom-serious {
      outline: 2px solid #ff8800 !important;
      box-shadow: 0 0 0 4px rgba(255,136,0,0.15) !important;
    }
    .phantom-moderate {
      outline: 2px solid #f59e0b !important;
      box-shadow: 0 0 0 4px rgba(245,158,11,0.15) !important;
    }
    .phantom-minor {
      outline: 2px solid #8888aa !important;
      box-shadow: 0 0 0 4px rgba(136,136,170,0.15) !important;
    }
    [data-phantom]:hover::after {
      content: attr(data-phantom-label) !important;
      position: fixed !important;
      bottom: 80px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: #1a1a2e !important;
      color: #f0f0f8 !important;
      font-size: 12px !important;
      font-family: system-ui, sans-serif !important;
      font-weight: 500 !important;
      padding: 6px 12px !important;
      border-radius: 6px !important;
      white-space: nowrap !important;
      z-index: 2147483647 !important;
      pointer-events: none !important;
      max-width: 320px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
  `;
  document.head.appendChild(style);

  // Apply highlights to each broken element
  let count = 0;
  violations.forEach((v) => {
    if (!v.selector) return;
    try {
      const el = document.querySelector(v.selector);
      if (!el) return;
      el.classList.add(`phantom-${v.impact}`);
      el.setAttribute("data-phantom", "true");
      el.setAttribute("data-phantom-label", `⚠ ${v.help}`);
      count++;
    } catch {
      /* invalid selector — skip */
    }
  });

  // Floating counter panel
  const counter = document.createElement("div");
  counter.id = "phantom-counter";
  counter.innerHTML = `
    <div style="
      position: fixed; bottom: 20px; right: 20px;
      background: #1a1a2e; border: 1px solid rgba(124,106,247,0.4);
      border-radius: 12px; padding: 10px 16px;
      font-family: system-ui, sans-serif;
      font-size: 13px; font-weight: 600;
      color: #f0f0f8; z-index: 2147483646;
      display: flex; align-items: center; gap: 8px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.4);
      cursor: default;
    ">
      <span style="font-size:16px">👁️</span>
      <span style="color:#7c6af7">${count}</span>
      <span style="color:#8888aa; font-weight:400">issues highlighted</span>
      <span style="
        margin-left:4px; font-size:11px;
        background:rgba(255,255,255,0.06);
        border-radius:4px; padding:2px 8px;
        color:#555570; cursor:pointer;
      " onclick="
        document.getElementById('phantom-styles')?.remove();
        document.getElementById('phantom-counter')?.remove();
        document.querySelectorAll('[data-phantom]').forEach(function(el){
          el.removeAttribute('data-phantom');
          el.removeAttribute('data-phantom-label');
          el.classList.remove('phantom-critical','phantom-serious','phantom-moderate','phantom-minor');
        });
      ">✕ clear</span>
    </div>
  `;
  document.body.appendChild(counter);

  return count;
}

// ── Runs inside the webpage — removes all highlights ─────────
function clearHighlights() {
  document.getElementById("phantom-styles")?.remove();
  document.getElementById("phantom-counter")?.remove();
  document.querySelectorAll("[data-phantom]").forEach((el) => {
    el.removeAttribute("data-phantom");
    el.removeAttribute("data-phantom-label");
    el.classList.remove(
      "phantom-critical",
      "phantom-serious",
      "phantom-moderate",
      "phantom-minor",
    );
  });
}

// ── React component ───────────────────────────────────────────
export default function HighlightToggle({
  violations,
  tabId,
}: HighlightToggleProps) {
  const [state, setState] = useState<HighlightState>("off");
  const [count, setCount] = useState(0);

  const handleToggle = async () => {
    if (state === "loading") return;

    if (state === "on") {
      // Turn off
      setState("loading");
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          func: clearHighlights,
        });
      } catch {
        /* tab may have navigated */
      }
      setState("off");
      setCount(0);
      return;
    }

    // Turn on
    setState("loading");

    const payload = violations
      .filter((v) => v.selector)
      .map((v) => ({ selector: v.selector!, impact: v.impact, help: v.help }));

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: injectHighlights,
        args: [payload],
      });
      const highlighted = (result?.result as number) ?? 0;
      setCount(highlighted);
      setState("on");
    } catch (err) {
      console.error("Highlight failed:", err);
      setState("off");
    }
  };

  const isOn = state === "on";
  const isLoading = state === "loading";

  return (
    <div
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "#0e0e16",
      }}
    >
      <button
        onClick={handleToggle}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "11px 16px",
          background: isOn ? "rgba(255,68,68,0.12)" : "rgba(124,106,247,0.1)",
          border: `1px solid ${isOn ? "rgba(255,68,68,0.35)" : "rgba(124,106,247,0.25)"}`,
          borderRadius: 10,
          color: isOn ? "#ff6b6b" : "#7c6af7",
          fontSize: 13,
          fontWeight: 600,
          cursor: isLoading ? "wait" : "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all 0.2s",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? (
          <>
            <span style={{ fontSize: 15 }}>⏳</span>
            {isOn ? "Clearing..." : "Highlighting..."}
          </>
        ) : isOn ? (
          <>
            <span style={{ fontSize: 15 }}>✕</span>
            Clear highlights
            <span
              style={{
                fontSize: 11,
                background: "rgba(255,68,68,0.15)",
                padding: "2px 8px",
                borderRadius: 10,
              }}
            >
              {count} elements
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 15 }}>🔴</span>
            Highlight issues on page
            <span
              style={{
                fontSize: 11,
                background: "rgba(124,106,247,0.15)",
                padding: "2px 8px",
                borderRadius: 10,
              }}
            >
              {violations.length} violations
            </span>
          </>
        )}
      </button>

      {isOn && (
        <p
          style={{
            fontSize: 11,
            color: "#555570",
            textAlign: "center",
            margin: "8px 0 0",
            lineHeight: 1.5,
          }}
        >
          Switch to the page tab to see highlighted elements — hover each one to
          see the issue
        </p>
      )}
    </div>
  );
}
