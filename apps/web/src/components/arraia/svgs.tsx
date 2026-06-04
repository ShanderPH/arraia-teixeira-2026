import type { SVGProps } from "react";

/* ────────────────────────────────────────────────────────────
   Shared types
   ──────────────────────────────────────────────────────────── */

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (size = 48): Partial<SVGProps<SVGSVGElement>> => ({
  width: size,
  height: size,
  focusable: false,
  "aria-hidden": true,
});

/* ────────────────────────────────────────────────────────────
   Bandeirinhas — long festive flag string
   ──────────────────────────────────────────────────────────── */

export interface BandeirinhasProps extends SVGProps<SVGSVGElement> {
  count?: number;
  colors?: string[];
}

export function Bandeirinhas({
  count = 16,
  colors = ["#009739", "#FEDD00", "#D45D12", "#B23A1F", "#1FB35A"],
  className,
  ...rest
}: BandeirinhasProps) {
  const gap = 56;
  const startX = 4;
  const total = count;
  const width = startX * 2 + total * gap;

  return (
    <svg
      viewBox={`0 0 ${width} 70`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path
        d={`M${startX},22 ${Array.from({ length: total }).map((_, i) => {
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
      {Array.from({ length: total }).map((_, i) => {
        const cx = startX + i * gap + gap / 2;
        const cy = i % 2 === 0 ? 20 : 14;
        const color = colors[i % colors.length];
        return (
          <polygon
            key={i}
            points={`${cx - 14},${cy} ${cx + 14},${cy} ${cx},${cy + 38}`}
            fill={color}
            stroke="#0A1828"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Fogueira — main campfire illustration
   ──────────────────────────────────────────────────────────── */

export interface FogueiraProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function Fogueira({ size = 160, className, ...rest }: FogueiraProps) {
  return (
    <svg
      viewBox="0 0 100 130"
      width={size}
      height={(size * 130) / 100}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path
        d="M50,118 C28,88 12,70 20,46 C25,30 40,22 50,8 C60,22 75,30 80,46 C88,70 72,88 50,118Z"
        fill="#D45D12"
      >
        <animate
          attributeName="opacity"
          values="0.85;1;0.88;1;0.85"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M50,115 C34,88 28,72 34,54 C38,42 47,36 50,24 C53,36 62,42 66,54 C72,72 66,88 50,115Z"
        fill="#FEDD00"
      >
        <animate
          attributeName="opacity"
          values="1;0.85;1;0.9;1"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M50,110 C41,90 40,78 44,65 C47,56 50,50 50,40 C50,50 53,56 56,65 C60,78 59,90 50,110Z"
        fill="white"
        opacity="0.75"
      />
      <circle cx="36" cy="112" r="4" fill="#D45D12" opacity="0.8" />
      <circle cx="64" cy="116" r="3" fill="#FEDD00" opacity="0.7" />
      <circle cx="50" cy="120" r="2.5" fill="#D45D12" opacity="0.6" />
      <rect x="18" y="116" width="64" height="9" rx="4.5" fill="#0A1828" />
      <line x1="28" y1="124" x2="58" y2="112" stroke="#0A1828" strokeWidth="7" strokeLinecap="round" />
      <line x1="72" y1="124" x2="42" y2="112" stroke="#0A1828" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Milho — ear of corn
   ──────────────────────────────────────────────────────────── */

export function Milho({ size = 48, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...defaults(size)} {...rest}>
      <ellipse cx="32" cy="34" rx="14" ry="22" fill="#FEDD00" stroke="#0A1828" strokeWidth="1.5" />
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 4 }).map((__, col) => (
          <circle
            key={`${row}-${col}`}
            cx={22 + col * 6}
            cy={18 + row * 7}
            r="2.4"
            fill="#E0B400"
            stroke="#0A1828"
            strokeWidth="0.5"
          />
        ))
      )}
      <path d="M18 16 Q10 4 22 6 Q20 14 26 16 Z" fill="#009739" />
      <path d="M46 16 Q54 4 42 6 Q44 14 38 16 Z" fill="#009739" />
      <path d="M32 10 Q26 2 30 0 Q36 4 32 10 Z" fill="#1FB35A" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Chapeu — straw/country hat
   ──────────────────────────────────────────────────────────── */

export function Chapeu({ size = 48, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...defaults(size)} {...rest}>
      <path d="M6 42 Q32 30 58 42 Q32 50 6 42 Z" fill="#009739" stroke="#003D1A" strokeWidth="1.5" />
      <path d="M20 42 Q20 20 32 16 Q44 20 44 42 Z" fill="#006B29" stroke="#003D1A" strokeWidth="1.5" />
      <path d="M20 40 Q32 36 44 40 L44 42 Q32 44 20 42 Z" fill="#D45D12" />
      <circle cx="28" cy="30" r="2" fill="#FEDD00" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Balao — festa junina hot-air balloon
   ──────────────────────────────────────────────────────────── */

export interface BalaoProps extends SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  accent?: string;
}

export function Balao({
  size = 80,
  color = "#D45D12",
  accent = "#FEDD00",
  className,
  ...rest
}: BalaoProps) {
  return (
    <svg
      viewBox="0 0 80 120"
      width={size}
      height={(size * 120) / 80}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path
        d="M40 6 C18 6 6 28 6 50 C6 68 22 82 40 82 C58 82 74 68 74 50 C74 28 62 6 40 6 Z"
        fill={color}
        stroke="#0A1828"
        strokeWidth="1.5"
      />
      <path d="M40 6 C28 10 22 30 22 50 C22 66 30 80 40 82" stroke={accent} strokeWidth="3" fill="none" />
      <path d="M40 6 C52 10 58 30 58 50 C58 66 50 80 40 82" stroke={accent} strokeWidth="3" fill="none" />
      <ellipse cx="40" cy="50" rx="10" ry="26" fill={accent} opacity="0.65" />
      <line x1="28" y1="82" x2="34" y2="100" stroke="#0A1828" strokeWidth="1.2" />
      <line x1="52" y1="82" x2="46" y2="100" stroke="#0A1828" strokeWidth="1.2" />
      <rect x="32" y="100" width="16" height="10" rx="2" fill="#0D1B2A" stroke="#003D1A" strokeWidth="1.2" />
      <circle cx="40" cy="110" r="4" fill="#D45D12">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Dish icons
   ──────────────────────────────────────────────────────────── */

export function IconCanjica({ size = 56, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...defaults(size)} {...rest}>
      <path d="M10 30 Q32 22 54 30 L50 52 Q32 58 14 52 Z" fill="#FFFDF7" stroke="#0A1828" strokeWidth="1.5" />
      <ellipse cx="32" cy="30" rx="22" ry="5" fill="white" stroke="#0A1828" strokeWidth="1.5" />
      {[20, 26, 32, 38, 44].map((cx, i) => (
        <circle key={i} cx={cx} cy="30" r="2.2" fill="#FEDD00" />
      ))}
      <path d="M24 24 Q32 12 40 24" stroke="#009739" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export function IconPamonha({ size = 56, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...defaults(size)} {...rest}>
      <path d="M14 20 Q32 8 50 20 L50 50 Q32 60 14 50 Z" fill="#009739" stroke="#0A1828" strokeWidth="1.5" />
      <path d="M18 22 Q32 14 46 22 L46 48 Q32 56 18 48 Z" fill="#1FB35A" />
      <path d="M22 26 L42 26 M22 32 L42 32 M22 38 L42 38 M22 44 L42 44" stroke="#009739" strokeWidth="1.2" />
      <path d="M32 10 L26 4 M32 10 L38 4" stroke="#0A1828" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconBolo({ size = 56, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...defaults(size)} {...rest}>
      <rect x="10" y="28" width="44" height="24" rx="2" fill="#C98C5C" stroke="#0A1828" strokeWidth="1.5" />
      <rect x="10" y="28" width="44" height="6" fill="#FEDD00" stroke="#0A1828" strokeWidth="1.5" />
      <path d="M10 34 Q20 28 28 34 Q36 40 44 34 Q52 28 54 34" fill="none" stroke="#D45D12" strokeWidth="1.5" />
      <rect x="28" y="18" width="3" height="12" fill="#FEDD00" />
      <path d="M29.5 12 Q29 18 33 18 Q29 16 29.5 12 Z" fill="#D45D12">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export function IconQuentao({ size = 56, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...defaults(size)} {...rest}>
      <path d="M18 24 L46 24 L44 54 Q32 60 20 54 Z" fill="#0D3B1A" stroke="#0A1828" strokeWidth="1.5" />
      <ellipse cx="32" cy="24" rx="14" ry="4" fill="#0A2E14" />
      <path d="M46 30 Q56 32 56 40 Q56 48 46 46" fill="none" stroke="#0A1828" strokeWidth="2.5" />
      <path d="M26 12 Q24 18 28 20 M32 10 Q30 18 34 20 M38 12 Q36 18 40 20" stroke="#D45D12" strokeWidth="2" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export function IconPacoca({ size = 56, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...defaults(size)} {...rest}>
      <rect x="14" y="22" width="36" height="22" rx="3" fill="#FEDD00" stroke="#0A1828" strokeWidth="1.5" />
      <rect x="14" y="22" width="36" height="22" rx="3" fill="url(#pacocaDots)" />
      <defs>
        <pattern id="pacocaDots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.8" fill="#009739" />
        </pattern>
      </defs>
      <path d="M14 30 L50 30 M14 36 L50 36" stroke="#0A1828" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

export function IconPipoca({ size = 56, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...defaults(size)} {...rest}>
      <path d="M18 28 L46 28 L44 56 L20 56 Z" fill="#D45D12" stroke="#0A1828" strokeWidth="1.5" />
      <path d="M18 28 L46 28 L44 56 L20 56 Z" fill="url(#pipocaStripes)" opacity="0.4" />
      <defs>
        <pattern id="pipocaStripes" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="4" height="8" fill="white" />
        </pattern>
      </defs>
      {[
        [22, 22], [28, 16], [34, 20], [40, 14], [46, 22], [32, 24], [20, 26], [44, 26],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="#FFFDF7" stroke="#FEDD00" strokeWidth="1" />
      ))}
    </svg>
  );
}

export function IconBolinho({ size = 56, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...defaults(size)} {...rest}>
      <ellipse cx="32" cy="38" rx="20" ry="14" fill="#1FB35A" stroke="#0A1828" strokeWidth="1.5" />
      <ellipse cx="32" cy="34" rx="18" ry="10" fill="#009739" />
      <circle cx="24" cy="32" r="1.2" fill="#009739" />
      <circle cx="32" cy="30" r="1.2" fill="#009739" />
      <circle cx="40" cy="33" r="1.2" fill="#009739" />
      <circle cx="28" cy="38" r="1.2" fill="#009739" />
      <circle cx="38" cy="38" r="1.2" fill="#009739" />
    </svg>
  );
}

export function IconArrozDoce({ size = 56, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" {...defaults(size)} {...rest}>
      <path d="M10 30 Q32 22 54 30 L50 52 Q32 58 14 52 Z" fill="#FFFDF7" stroke="#0A1828" strokeWidth="1.5" />
      <ellipse cx="32" cy="30" rx="22" ry="5" fill="white" stroke="#0A1828" strokeWidth="1.5" />
      {Array.from({ length: 14 }).map((_, i) => (
        <ellipse
          key={i}
          cx={16 + (i * 31) % 32}
          cy={28 + (i * 17) % 20}
          rx="1.6"
          ry="0.8"
          fill="#FFFDF7"
          stroke="#FEDD00"
          strokeWidth="0.4"
        />
      ))}
      <path d="M22 22 L24 26 M32 20 L34 24 M42 22 L44 26" stroke="#009739" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}
