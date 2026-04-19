import Link from "next/link";
import { GiPartyFlags } from "react-icons/gi";
import WhatsAppButton from "./WhatsAppButton";

export default function Footer() {
  return (
    <footer className="bg-earth text-earth-foreground mt-auto">
      <div className="bandeirinhas-border w-full" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-corn font-display text-xl uppercase">
              <GiPartyFlags className="text-2xl" aria-hidden="true" />
              Arraia Teixeira
            </div>
            <p className="text-sm text-straw/80 leading-relaxed">
              A melhor festa junina do pedaço! Venha dançar forró, comer bem
              e se divertir com a família Teixeira.
            </p>
            <p className="font-hand text-xl text-corn">Te esperamos na fogueira! 🔥</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display uppercase tracking-wider text-corn text-sm">
              O evento
            </h3>
            <ul className="space-y-1.5 text-sm text-straw/80">
              <li>📅 <strong className="text-straw">Data:</strong> 20 de junho de 2026</li>
              <li>⏰ <strong className="text-straw">Horário:</strong> a partir das 18h</li>
              <li>📍 <strong className="text-straw">Local:</strong> Sítio da família</li>
              <li>🎶 <strong className="text-straw">Música:</strong> forró ao vivo</li>
            </ul>
            <nav aria-label="Navegar pela página" className="pt-2">
              <ul className="flex flex-wrap gap-3 text-xs uppercase tracking-wider">
                <li><Link href="/#pratos" className="hover:text-corn">Cardápio</Link></li>
                <li><Link href="/#confirmados" className="hover:text-corn">Confirmados</Link></li>
                <li><Link href="/#galeria" className="hover:text-corn">Galeria</Link></li>
                <li><Link href="/rsvp" className="hover:text-corn">Confirmar</Link></li>
              </ul>
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="font-display uppercase tracking-wider text-corn text-sm">
              Suporte
            </h3>
            <p className="text-sm text-straw/80">
              Dúvida, troca de prato ou imprevisto? Fala com a gente no
              WhatsApp.
            </p>
            <WhatsAppButton variant="inline" />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-straw/20 text-center text-xs text-straw/50">
          © {new Date().getFullYear()} Arraia Teixeira · Feito com 🎉 para a família
        </div>
      </div>
    </footer>
  );
}
