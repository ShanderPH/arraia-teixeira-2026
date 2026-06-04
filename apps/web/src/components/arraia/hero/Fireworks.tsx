"use client";

const bursts = [
  { cx: 220, cy: 120, color: "#FEDD00", delay: 0 },
  { cx: 1180, cy: 90, color: "#D45D12", delay: 1.3 },
  { cx: 720, cy: 60, color: "#B23A1F", delay: 2.1 },
  { cx: 960, cy: 140, color: "#009739", delay: 2.9 },
  { cx: 420, cy: 180, color: "#1FB35A", delay: 3.6 },
];

export default function Fireworks() {
  return (
    <svg
      viewBox="0 0 1440 500"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      {bursts.map((b, i) => (
        <g key={i}>
          {Array.from({ length: 12 }).map((_, k) => {
            const angle = (k / 12) * Math.PI * 2;
            const x2 = b.cx + Math.cos(angle) * 60;
            const y2 = b.cy + Math.sin(angle) * 60;
            return (
              <line
                key={k}
                x1={b.cx}
                y1={b.cy}
                x2={x2}
                y2={y2}
                stroke={b.color}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values="0;1;0.6;0"
                  dur="1.6s"
                  begin={`${b.delay + k * 0.02}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-width"
                  values="0;3;1"
                  dur="1.6s"
                  begin={`${b.delay}s`}
                  repeatCount="indefinite"
                />
              </line>
            );
          })}
          <circle cx={b.cx} cy={b.cy} r="3" fill={b.color}>
            <animate
              attributeName="r"
              values="1;6;2"
              dur="1.6s"
              begin={`${b.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.2;0"
              dur="1.6s"
              begin={`${b.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}
