import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@heroui/react";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl" aria-hidden="true">🎪</div>
        <h1 className="text-4xl font-extrabold text-foreground">404</h1>
        <h2 className="text-xl font-bold text-foreground">
          Opa, essa festa não existe!
        </h2>
        <p className="text-muted">
          A página que você procura não foi encontrada. Mas a Arraia Teixeira te espera!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-accent text-accent-foreground font-bold px-6 rounded-xl w-full sm:w-auto">
              Voltar para o início
            </Button>
          </Link>
          <Link href="/rsvp">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 font-bold px-6 rounded-xl w-full sm:w-auto">
              Confirmar presença
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
