import { useState } from "react";

export default function ScanButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        padding: "14px",
        background: hovered
          ? "rgba(124,106,247,0.25)"
          : "rgba(124,106,247,0.15)",
        border: `1px solid ${hovered ? "#7c6af7" : "rgba(124,106,247,0.3)"}`,
        borderRadius: 10,
        color: "#7c6af7",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all 0.2s",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <span style={{ fontSize: 16 }}>🔍</span>
      Scan this page for issues
    </button>
  );
}
