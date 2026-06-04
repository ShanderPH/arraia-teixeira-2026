"use client";

interface DancingCoupleProps {
  flip?: boolean;
  delay?: number;
}

export default function DancingCouple({ flip = false, delay = 0 }: DancingCoupleProps) {
  return (
    <div
      className="relative"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 160" width={120} height={160}>
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-6 60 140; 6 60 140; -6 60 140"
            dur="1.4s"
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
          {/* Woman — red dress */}
          <g>
            <circle cx="36" cy="42" r="10" fill="#F5D0A9" stroke="#0A1828" strokeWidth="1.2" />
            {/* pigtails */}
            <circle cx="28" cy="38" r="3" fill="#0D1B2A" />
            <circle cx="44" cy="38" r="3" fill="#0D1B2A" />
            <path d="M26 32 Q36 26 46 32" fill="#0D1B2A" />
            {/* painted freckles */}
            <circle cx="32" cy="46" r="0.7" fill="#D45D12" />
            <circle cx="40" cy="46" r="0.7" fill="#D45D12" />
            {/* Dress */}
            <path d="M20 54 Q36 52 52 54 L60 120 L12 120 Z" fill="#D45D12" stroke="#0A1828" strokeWidth="1.2" />
            <path d="M14 100 L58 100" stroke="#FEDD00" strokeWidth="3" />
            <path d="M16 110 L56 110" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Arms */}
            <line x1="22" y1="60" x2="12" y2="78" stroke="#F5D0A9" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="60" x2="66" y2="72" stroke="#F5D0A9" strokeWidth="4" strokeLinecap="round" />
            {/* Legs */}
            <line x1="26" y1="120" x2="22" y2="150" stroke="#0A1828" strokeWidth="5" strokeLinecap="round" />
            <line x1="46" y1="120" x2="50" y2="150" stroke="#0A1828" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Man — plaid shirt */}
          <g>
            <circle cx="90" cy="42" r="10" fill="#F5D0A9" stroke="#0A1828" strokeWidth="1.2" />
            {/* straw hat */}
            <ellipse cx="90" cy="32" rx="16" ry="4" fill="#009739" stroke="#003D1A" strokeWidth="1" />
            <path d="M80 32 Q90 22 100 32 Z" fill="#006B29" stroke="#003D1A" strokeWidth="1" />
            {/* painted mustache */}
            <path d="M84 46 Q90 48 96 46" stroke="#0D1B2A" strokeWidth="1.4" fill="none" />
            {/* Plaid shirt */}
            <path d="M76 54 L104 54 L108 100 L72 100 Z" fill="#009739" stroke="#0A1828" strokeWidth="1.2" />
            <path d="M76 54 L104 54 L108 100 L72 100 Z" fill="url(#plaid)" />
            <defs>
              <pattern id="plaid" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="transparent" />
                <line x1="0" y1="5" x2="10" y2="5" stroke="#FEDD00" strokeWidth="0.8" opacity="0.7" />
                <line x1="5" y1="0" x2="5" y2="10" stroke="white" strokeWidth="0.8" opacity="0.7" />
              </pattern>
            </defs>
            {/* Patches */}
            <rect x="80" y="66" width="6" height="6" fill="#FEDD00" stroke="#0A1828" strokeWidth="0.8" transform="rotate(15 83 69)" />
            <rect x="96" y="82" width="5" height="5" fill="#FEDD00" stroke="#0A1828" strokeWidth="0.8" />
            {/* Arms */}
            <line x1="78" y1="60" x2="62" y2="72" stroke="#F5D0A9" strokeWidth="4" strokeLinecap="round" />
            <line x1="106" y1="60" x2="118" y2="78" stroke="#F5D0A9" strokeWidth="4" strokeLinecap="round" />
            {/* Pants */}
            <line x1="82" y1="100" x2="78" y2="150" stroke="#0A1828" strokeWidth="5" strokeLinecap="round" />
            <line x1="98" y1="100" x2="102" y2="150" stroke="#0A1828" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
