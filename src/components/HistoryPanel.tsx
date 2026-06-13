import { useState, useEffect } from "react";

export interface ScanRecord {
  id: string;
  url: string;
  title: string;
  score: number;
  violations: number;
  passes: number;
  timestamp: number;
}

interface HistoryPanelProps {
  onClose: () => void;
}

export default function HistoryPanel({ onClose }: HistoryPanelProps) {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get("phantomHistory", (data) => {
      const history = (data.phantomHistory as ScanRecord[]) ?? [];
      setRecords(history.sort((a, b) => b.timestamp - a.timestamp));
      setLoading(false);
    });
  }, []);

  const clearHistory = () => {
    chrome.storage.local.remove("phantomHistory");
    setRecords([]);
  };

  const grouped = records.reduce<Record<string, ScanRecord[]>>((acc, r) => {
    try {
      const host = new URL(r.url).hostname;
      if (!acc[host]) acc[host] = [];
      acc[host].push(r);
    } catch {
      if (!acc["other"]) acc["other"] = [];
      acc["other"].push(r);
    }
    return acc;
  }, {});

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0f",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          background: "#111118",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#f0f0f8",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ color: "#7c6af7" }}>📊</span> Scan History
          </div>
          <div style={{ fontSize: 11, color: "#8888aa", marginTop: 2 }}>
            {records.length} scan{records.length !== 1 ? "s" : ""} recorded
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {records.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.2)",
                borderRadius: 6,
                padding: "4px 10px",
                color: "#ff6b6b",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "none",
              borderRadius: 6,
              width: 28,
              height: 28,
              color: "#8888aa",
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "inherit",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
        {loading && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#8888aa",
              fontSize: 13,
            }}
          >
            Loading...
          </div>
        )}

        {!loading && records.length === 0 && (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 36 }}>📭</div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#f0f0f8",
                margin: 0,
              }}
            >
              No scans yet
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#8888aa",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Scan any website and your results will appear here automatically.
            </p>
            <button
              onClick={onClose}
              style={{
                background: "rgba(124,106,247,0.15)",
                border: "1px solid rgba(124,106,247,0.3)",
                borderRadius: 8,
                padding: "8px 20px",
                color: "#7c6af7",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                marginTop: 4,
              }}
            >
              ← Scan a page
            </button>
          </div>
        )}

        {!loading &&
          Object.entries(grouped).map(([host, siteRecords]) => (
            <div key={host} style={{ marginBottom: 4 }}>
              <div
                style={{
                  padding: "8px 20px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#555570",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {host}
              </div>
              {siteRecords.map((record, i) => {
                const prev = siteRecords[i + 1];
                const delta = prev ? record.score - prev.score : null;
                const scoreColor =
                  record.score >= 80
                    ? "#00d4aa"
                    : record.score >= 50
                      ? "#f59e0b"
                      : "#ff6b6b";
                const timeStr = new Date(record.timestamp).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                );
                return (
                  <div
                    key={record.id}
                    style={{
                      padding: "12px 20px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      animation: "fadeIn 0.3s ease both",
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }`}</style>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: `${scoreColor}18`,
                        border: `2px solid ${scoreColor}44`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: scoreColor,
                        }}
                      >
                        {record.score}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#f0f0f8",
                          margin: "0 0 3px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {record.title || host}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontSize: 11, color: "#ff6b6b" }}>
                          {record.violations} issues
                        </span>
                        <span style={{ fontSize: 11, color: "#555570" }}>
                          · {timeStr}
                        </span>
                      </div>
                    </div>
                    {delta !== null && (
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 10,
                          flexShrink: 0,
                          background:
                            delta > 0
                              ? "rgba(0,212,170,0.12)"
                              : delta < 0
                                ? "rgba(255,107,107,0.12)"
                                : "rgba(136,136,170,0.1)",
                          color:
                            delta > 0
                              ? "#00d4aa"
                              : delta < 0
                                ? "#ff6b6b"
                                : "#8888aa",
                        }}
                      >
                        {delta > 0
                          ? `↑ +${delta}`
                          : delta < 0
                            ? `↓ ${delta}`
                            : "→ 0"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
}

export async function saveScanToHistory(
  url: string,
  title: string,
  score: number,
  violations: number,
  passes: number,
) {
  const record: ScanRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    url,
    title,
    score,
    violations,
    passes,
    timestamp: Date.now(),
  };
  const data = await chrome.storage.local.get("phantomHistory");
  const history = (data.phantomHistory as ScanRecord[]) ?? [];
  await chrome.storage.local.set({
    phantomHistory: [record, ...history].slice(0, 50),
  });
}
