"use client";

import { useCallback, useState } from "react";

const COLORS = ["#C92A2A", "#FFD43B", "#364FC7", "#2B8A3E", "#F76707"];

interface FlagState {
  id: number;
  dropped: boolean;
}

export default function PluckableBandeirinhas({ count = 20 }: { count?: number }) {
  const [flags, setFlags] = useState<FlagState[]>(() =>
    Array.from({ length: count }, (_, i) => ({ id: i, dropped: false }))
  );

  const pluck = useCallback((id: number) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id && !f.dropped ? { ...f, dropped: true } : f))
    );
    // Respawn after drop animation
    window.setTimeout(() => {
      setFlags((prev) =>
        prev.map((f) => (f.id === id ? { ...f, dropped: false } : f))
      );
    }, 900);
  }, []);

  const gap = 56;
  const startX = 4;
  const width = startX * 2 + count * gap;

  return (
    <svg
      viewBox={`0 0 ${width} 100`}
      preserveAspectRatio="none"
      className="w-full h-12 sm:h-14 anim-sway"
      role="group"
      aria-label="Bandeirinhas de festa junina interativas"
    >
      {/* String */}
      <path
        d={`M${startX},22 ${Array.from({ length: count }).map((_, i) => {
          const up = i % 2 === 0;
          const cx = startX + i * gap + gap / 2;
          const cy = up ? 8 : 28;
          const nx = startX + (i + 1) * gap;
          const ny = up ? 22 : 14;
          return `Q${cx},${cy} ${nx},${ny}`;
        }).join(" ")}`}
        stroke="#5C4033"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {flags.map((flag, i) => {
        const cx = startX + i * gap + gap / 2;
        const cy = i % 2 === 0 ? 20 : 14;
        const color = COLORS[i % COLORS.length];
        return (
          <g
            key={flag.id}
            className={flag.dropped ? "anim-drop" : ""}
            style={flag.dropped ? { transformOrigin: `${cx}px ${cy}px` } : undefined}
          >
            <polygon
              points={`${cx - 14},${cy} ${cx + 14},${cy} ${cx},${cy + 38}`}
              fill={color}
              stroke="#1A0500"
              strokeWidth="1"
              tabIndex={0}
              role="button"
              aria-label={`Arrancar bandeirinha ${i + 1}`}
              style={{ cursor: "pointer" }}
              onClick={() => pluck(flag.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pluck(flag.id);
                }
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
