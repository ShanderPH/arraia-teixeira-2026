"use client";

import { useSyncExternalStore } from "react";

interface CountdownProps {
  target: Date;
  label?: string;
}

let cachedNow = Date.now();
function getNow() {
  return cachedNow;
}

function subscribe(notify: () => void) {
  const id = window.setInterval(() => {
    cachedNow = Date.now();
    notify();
  }, 1000);
  return () => window.clearInterval(id);
}

function getServerNow() {
  // Return 0 during SSR so we render neutral placeholders
  return 0;
}

export default function Countdown({ target, label = "Contagem regressiva" }: CountdownProps) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);

  const ms = now === 0 ? null : Math.max(0, target.getTime() - now);
  const parts =
    ms === null
      ? null
      : {
          days: Math.floor(ms / 86_400_000),
          hours: Math.floor((ms % 86_400_000) / 3_600_000),
          minutes: Math.floor((ms % 3_600_000) / 60_000),
          seconds: Math.floor((ms % 60_000) / 1000),
        };

  const cells: [string, number | string][] = parts
    ? [
        ["dias", parts.days],
        ["horas", String(parts.hours).padStart(2, "0")],
        ["min", String(parts.minutes).padStart(2, "0")],
        ["seg", String(parts.seconds).padStart(2, "0")],
      ]
    : [
        ["dias", "--"],
        ["horas", "--"],
        ["min", "--"],
        ["seg", "--"],
      ];

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto w-full"
      role="timer"
      aria-label={label}
    >
      {cells.map(([unit, value]) => (
        <div
          key={unit}
          className="flex flex-col items-center justify-center px-2 py-3 sm:px-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_6px_22px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]"
        >
          <span className="font-display text-2xl sm:text-3xl md:text-4xl text-corn leading-none">
            {value}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 mt-1">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
