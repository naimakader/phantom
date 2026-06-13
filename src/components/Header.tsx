export default function Header({
  onReset,
  onHistory,
}: {
  onReset?: () => void;
  onHistory: () => void;
}) {
  return (
    <div
      style={{
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#111118",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "rgba(124,106,247,0.15)",
            border: "1px solid rgba(124,106,247,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          👁️
        </div>
        <div>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#f0f0f8",
              letterSpacing: "-0.3px",
            }}
          >
            Phantom
          </span>
          <span
            style={{
              fontSize: 10,
              color: "#7c6af7",
              marginLeft: 6,
              background: "rgba(124,106,247,0.15)",
              padding: "1px 6px",
              borderRadius: 10,
            }}
          >
            BETA
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {onReset && (
          <button
            onClick={onReset}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 6,
              padding: "4px 10px",
              color: "#8888aa",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← New scan
          </button>
        )}
        <button
          onClick={onHistory}
          title="Scan history"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
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
          📊
        </button>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#00d4aa",
            boxShadow: "0 0 6px #00d4aa",
          }}
        />
      </div>
    </div>
  );
}
