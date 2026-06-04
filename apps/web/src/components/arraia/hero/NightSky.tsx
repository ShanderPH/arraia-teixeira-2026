"use client";

import { useMemo } from "react";
import { mulberry32 } from "./rng";

interface Star {
  cx: number;
  cy: number;
  r: number;
  delay: number;
}

export default function NightSky({ count = 70 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    const rng = mulberry32(42);
    return Array.from({ length: count }, () => ({
      cx: rng() * 1440,
      cy: rng() * 400,
      r: 0.6 + rng() * 1.8,
      delay: rng() * 4,
    }));
  }, [count]);

  return (
    <svg
      viewBox="0 0 1440 500"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      {/* Moon */}
      <g>
        <circle cx="1220" cy="110" r="52" fill="#FFFDF7" opacity="0.95" />
        <circle cx="1200" cy="100" r="48" fill="#0D1B2A" />
      </g>
      {/* Distant mountains */}
      <path
        d="M0,420 L120,340 L240,380 L360,320 L520,410 L660,360 L820,400 L1000,340 L1200,400 L1440,360 L1440,500 L0,500 Z"
        fill="#071220"
        opacity="0.75"
      />
      <path
        d="M0,440 L140,400 L300,430 L480,390 L640,430 L820,410 L1020,440 L1240,410 L1440,430 L1440,500 L0,500 Z"
        fill="#0A1828"
      />
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="white"
          className="anim-twinkle"
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}
    </svg>
  );
}

