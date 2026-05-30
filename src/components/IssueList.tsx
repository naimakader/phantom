import { useState } from "react";
import type { Issue } from "../types";
import FixPanel from "./FixPanel";

const IMPACT_CONFIG = {
  critical: {
    color: "#ff6b6b",
    label: "Critical",
    bg: "rgba(255,107,107,0.12)",
  },
  serious: { color: "#ff9500", label: "Serious", bg: "rgba(255,149,0,0.12)" },
  moderate: {
    color: "#f59e0b",
    label: "Moderate",
    bg: "rgba(245,158,11,0.12)",
  },
  minor: { color: "#8888aa", label: "Minor", bg: "rgba(136,136,170,0.1)" },
  none: { color: "#00d4aa", label: "Passed", bg: "rgba(0,212,170,0.12)" },
};

export default function IssueList({
  items,
  type,
  tabId,
}: {
  items: Issue[];
  type: "issues" | "fixed";
  tabId: number;
}) {
  if (items.length === 0) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#8888aa",
          fontSize: 13,
        }}
      >
        {type === "issues" ? "🎉 No issues found!" : "No data"}
      </div>
    );
  }
  return (
    <div style={{ padding: "8px 0" }}>
      {items.map((issue, i) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          index={i}
          tabId={tabId}
          showFix={type === "issues"}
        />
      ))}
    </div>
  );
}

function IssueCard({
  issue,
  index,
  tabId,
  showFix,
}: {
  issue: Issue;
  index: number;
  tabId: number;
  showFix: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const config = IMPACT_CONFIG[issue.impact] ?? IMPACT_CONFIG.minor;

  return (
    <>
      {showPanel && (
        <FixPanel
          issue={issue}
          tabId={tabId}
          onClose={() => setShowPanel(false)}
        />
      )}

      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          cursor: "pointer",
          background: expanded ? "#16161f" : "transparent",
          animationDelay: `${index * 0.04}s`,
          animation: "slideIn 0.3s ease both",
        }}
        onMouseEnter={(e) => {
          if (!expanded) e.currentTarget.style.background = "#1e1e2a";
        }}
        onMouseLeave={(e) => {
          if (!expanded) e.currentTarget.style.background = "transparent";
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { opacity:0; transform:translateX(-8px); }
            to   { opacity:1; transform:translateX(0); }
          }
        `}</style>

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: 10,
              background: config.bg,
              color: config.color,
              flexShrink: 0,
              marginTop: 2,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {config.label}
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#f0f0f8",
                marginBottom: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {issue.help}
            </p>
            <p style={{ fontSize: 11, color: "#555570" }}>
              {issue.nodes} element{issue.nodes !== 1 ? "s" : ""} affected
            </p>
          </div>

          <span
            style={{
              color: "#555570",
              fontSize: 12,
              flexShrink: 0,
              transform: expanded ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s",
            }}
          >
            ▾
          </span>
        </div>

        {/* Expanded section */}
        {expanded && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: 12,
              padding: 12,
              background: "#111118",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "#8888aa",
                lineHeight: 1.6,
                marginBottom: 10,
              }}
            >
              {issue.description}
            </p>

            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Learn how to fix link */}
              {issue.helpUrl && (
                <a
                  href={issue.helpUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 11,
                    color: "#7c6af7",
                    textDecoration: "none",
                    fontFamily: "monospace",
                  }}
                >
                  Learn how to fix →
                </a>
              )}

              {/* AI Fix button — only on violations */}
              {showFix && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPanel(true);
                  }}
                  style={{
                    marginLeft: "auto",
                    background: "rgba(124,106,247,0.15)",
                    border: "1px solid rgba(124,106,247,0.3)",
                    borderRadius: 6,
                    padding: "5px 12px",
                    color: "#7c6af7",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(124,106,247,0.25)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(124,106,247,0.15)")
                  }
                >
                  ✦ Generate Fix
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
