export default function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#00d4aa" : score >= 50 ? "#f59e0b" : "#ff6b6b";
  const label = score >= 80 ? "Good" : score >= 50 ? "Needs work" : "Critical";

  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="4"
      />
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 36 36)"
        style={{
          transition: "stroke-dashoffset 1s ease",
          filter: `drop-shadow(0 0 4px ${color})`,
        }}
      />
      <text
        x="36"
        y="33"
        textAnchor="middle"
        fill="#f0f0f8"
        fontSize="14"
        fontWeight="700"
        fontFamily="inherit"
      >
        {score}
      </text>
      <text
        x="36"
        y="46"
        textAnchor="middle"
        fill={color}
        fontSize="8"
        fontWeight="500"
        fontFamily="inherit"
      >
        {label}
      </text>
    </svg>
  );
}
