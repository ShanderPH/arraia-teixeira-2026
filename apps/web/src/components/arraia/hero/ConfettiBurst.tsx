"use client";

import { useMemo } from "react";
import { mulberry32 } from "./rng";

interface Particle {
  id: number;
  color: string;
  dx: number;
  dy: number;
  rot: number;
}

const PALETTE = ["#C92A2A", "#FFD43B", "#364FC7", "#2B8A3E", "#F76707", "#FFF3BF"];

interface Props {
  trigger: number;
  count?: number;
  origin?: { x: number; y: number };
}

export default function ConfettiBurst({ trigger, count = 18, origin }: Props) {
  const particles = useMemo<Particle[]>(() => {
    if (trigger === 0) return [];
    const rng = mulberry32(trigger * 97 + count);
    return Array.from({ length: count }, (_, i) => {
      const angle = rng() * Math.PI * 2;
      const dist = 40 + rng() * 90;
      return {
        id: i,
        color: PALETTE[i % PALETTE.length],
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 40,
        rot: (rng() - 0.5) * 720,
      };
    });
  }, [trigger, count]);

  if (particles.length === 0) return null;

  return (
    <div
      key={trigger}
      className="pointer-events-none fixed z-[60]"
      style={{
        left: origin?.x ?? "50%",
        top: origin?.y ?? "50%",
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute block w-2 h-3 rounded-sm anim-confetti"
          style={
            {
              left: 0,
              top: 0,
              backgroundColor: p.color,
              ["--cx" as string]: `${p.dx}px`,
              ["--cy" as string]: `${p.dy}px`,
              ["--cr" as string]: `${p.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
