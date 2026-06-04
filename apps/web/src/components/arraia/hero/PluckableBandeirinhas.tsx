"use client";

import { useCallback, useState } from "react";

const COLORS = ["#009C3B", "#FFDF00", "#002776", "#009C3B", "#FFDF00"];

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

  const gap = 72;
  const startX = 8;
  const flagWidth = 18;
  const flagHeight = 48;
  const width = startX * 2 + count * gap;

  return (
    <svg
      viewBox={`0 0 ${width} 100`}
      preserveAspectRatio="none"
      className="w-full h-16 sm:h-20 md:h-24 anim-sway"
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
        stroke="#0A1828"
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
              points={`${cx - flagWidth},${cy} ${cx + flagWidth},${cy} ${cx},${cy + flagHeight}`}
              fill={color}
              stroke="#0A1828"
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
