import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="bandeirinhas-border w-full" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-corn font-display text-xl uppercase">
              <Image
                src="/arraia-teixeira-logo.png"
                alt="Logo Arraia Teixeira"
                width={32}
                height={32}
                className="rounded-full"
              />
              Arraia Teixeira
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              A melhor festa junina do pedaço! Venha dançar forró, comer bem
              e se divertir com a família Teixeira.
            </p>
            <p className="font-hand text-xl text-corn">Te esperamos na fogueira! 🔥</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display uppercase tracking-wider text-corn text-sm">
              O evento
            </h3>
            <ul className="space-y-1.5 text-sm text-white/70">
              <li>📅 <strong className="text-white">Data:</strong> 20 de junho de 2026</li>
              <li>⏰ <strong className="text-white">Horário:</strong> 19:30h</li>
              <li>
                📍 <strong className="text-white">Local:</strong>{" "}
                <a
                  href="https://maps.app.goo.gl/xREUf8dkk83cuogcA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-corn hover:underline underline-offset-2"
                  aria-label="Abrir localização do evento no aplicativo de mapas"
                >
                  Av. Visconde do Rio Branco, 357 - Vila Prudêncio, Cariacica - ES, 29155-180
                </a>
              </li>
            </ul>
            <nav aria-label="Navegar pela página" className="pt-2">
              <ul className="flex flex-wrap gap-3 text-xs uppercase tracking-wider">
                <li><Link href="/#pratos" className="hover:text-corn">Cardápio</Link></li>
                <li><Link href="/#confirmados" className="hover:text-corn">Confirmados</Link></li>
                <li><Link href="/#galeria" className="hover:text-corn">Galeria</Link></li>
                <li><Link href="/#pratos" className="hover:text-corn">Confirmar</Link></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/15 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Arraia Teixeira · Feito com 🎉 para a família
        </div>
      </div>
    </footer>
  );
}
