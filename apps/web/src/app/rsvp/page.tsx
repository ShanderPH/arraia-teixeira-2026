import type { Metadata } from "next";
import RSVPForm from "./RSVPForm";

export const metadata: Metadata = {
  title: "Confirmar Presença",
  description: "Confirme sua presença na Arraia Teixeira e escolha o prato que vai trazer.",
};

export default function RSVPPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mx-auto max-w-2xl text-center mb-10 space-y-3">
        <span className="inline-block text-4xl" aria-hidden="true">🎊</span>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          Confirme sua Presença
        </h1>
        <p className="text-muted text-lg">
          Preencha os dados abaixo para confirmar sua presença na festa e escolher
          o prato que vai trazer!
        </p>
      </div>

      <RSVPForm />
    </div>
  );
}
