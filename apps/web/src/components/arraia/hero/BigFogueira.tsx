"use client";

import { useMemo } from "react";
import { Fogueira } from "../svgs";
import { mulberry32 } from "./rng";

interface Ember {
  left: number;
  dx: number;
  delay: number;
  duration: number;
}

export default function BigFogueira({ emberCount = 14 }: { emberCount?: number }) {
  const embers = useMemo<Ember[]>(() => {
    const rng = mulberry32(1001 + emberCount);
    return Array.from({ length: emberCount }, (_, i) => ({
      left: 20 + rng() * 60,
      dx: (rng() - 0.5) * 30,
      delay: (i * 0.2) % 2.5,
      duration: 2.4 + rng() * 1.6,
    }));
  }, [emberCount]);

  return (
    <div className="relative w-48 sm:w-56 md:w-64 lg:w-72">
      <div className="anim-flicker">
        <Fogueira size={260} className="w-full h-auto" />
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        {embers.map((e, i) => (
          <span
            key={i}
            className="absolute bottom-10 w-1.5 h-1.5 rounded-full bg-[#FEDD00] anim-ember"
            style={
              {
                left: `${e.left}%`,
                animationDelay: `${e.delay}s`,
                animationDuration: `${e.duration}s`,
                ["--ember-dx" as string]: `${e.dx}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-full blur-2xl opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, #D45D12 0%, transparent 70%)" }}
      />
    </div>
  );
}
