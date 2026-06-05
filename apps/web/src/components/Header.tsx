import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/#pratos", label: "Cardápio" },
  { href: "/#confirmados", label: "Confirmados" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#pratos", label: "Confirmar" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-border shadow-surface hidden md:block">
      <div className="bandeirinhas-border w-full" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-accent font-display text-xl uppercase tracking-wide hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-md"
            aria-label="Arraia Teixeira — ir para o início"
          >
            <Image
              src="/arraia-teixeira-logo.png"
              alt="Logo Arraia Teixeira"
              width={34}
              height={34}
              className="rounded-full flex-shrink-0"
              priority
            />
            <span>Arraia Teixeira</span>
          </Link>

          <nav aria-label="Menu principal">
            <ul className="flex items-center gap-1 sm:gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      relative px-3 py-2 rounded-md
                      text-sm font-semibold text-foreground
                      hover:text-accent hover:bg-accent/10
                      transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1
                      after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                      after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-200
                      hover:after:w-4/5
                    "
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
