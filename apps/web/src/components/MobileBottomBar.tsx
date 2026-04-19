"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineCheckCircle, MdOutlineFoodBank, MdHome } from "react-icons/md";

const navItems = [
  { href: "/",        label: "Início",    icon: MdHome               },
  { href: "/rsvp",    label: "Confirmar", icon: MdOutlineCheckCircle  },
  { href: "/dishes",  label: "Pratos",    icon: MdOutlineFoodBank     },
];

export default function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-50 md:hidden"
      aria-label="Navegação principal"
    >
      {/* Liquid glass container */}
      <div
        className="flex items-center justify-around px-2 py-2 rounded-[2rem] border border-white/25 shadow-[0_8px_40px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(92,64,51,0.82) 0%, rgba(61,32,16,0.88) 50%, rgba(106,28,0,0.82) 100%)",
          backdropFilter: "blur(24px) saturate(180%)",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          WebkitBackdropFilter: "blur(24px) saturate(180%)" as any,
        }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className="flex-1 min-w-0"
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={`
                  relative flex flex-col items-center gap-1
                  py-2.5 px-1 rounded-[1.5rem]
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "bg-[#FFD43B]/20 border border-[#FFD43B]/30 scale-105"
                      : "hover:bg-white/8 active:scale-95 border border-transparent"
                  }
                `}
              >
                {/* Indicador ativo — ponto brilhante acima do ícone */}
                {isActive && (
                  <span
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FFD43B]"
                    style={{ boxShadow: "0 0 6px 2px rgba(255,212,59,0.6)" }}
                    aria-hidden="true"
                  />
                )}

                {/* Ícone */}
                <Icon
                  className={`
                    text-[1.6rem] transition-colors duration-300
                    ${isActive ? "text-[#FFD43B]" : "text-white/55"}
                  `}
                  aria-hidden="true"
                />

                {/* Label */}
                <span
                  className={`
                    text-[10px] font-bold tracking-wide uppercase leading-none
                    transition-colors duration-300
                    ${isActive ? "text-[#FFD43B]" : "text-white/45"}
                  `}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
