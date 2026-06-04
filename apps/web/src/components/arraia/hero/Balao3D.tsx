"use client";

import { useState } from "react";
import { Balao } from "../svgs";
import ConfettiBurst from "./ConfettiBurst";

interface Balao3DProps {
  color?: string;
  accent?: string;
  size?: number;
  delay?: number;
  label?: string;
}

export default function Balao3D({
  color = "#D45D12",
  accent = "#FEDD00",
  size = 80,
  delay = 0,
  label = "Balão de festa junina",
}: Balao3DProps) {
  const [burst, setBurst] = useState(0);
  const [origin, setOrigin] = useState<{ x: number; y: number } | undefined>();

  const pop = (e: React.MouseEvent | React.KeyboardEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setBurst((n) => n + 1);
  };

  return (
    <>
      <button
        type="button"
        className="anim-float press rounded-full focus:outline-none focus:ring-2 focus:ring-corn/80 focus:ring-offset-2 focus:ring-offset-transparent"
        style={{ animationDelay: `${delay}s` }}
        aria-label={label}
        onClick={pop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            pop(e);
          }
        }}
      >
        <Balao size={size} color={color} accent={accent} className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
      </button>
      <ConfettiBurst trigger={burst} origin={origin} />
    </>
  );
}
