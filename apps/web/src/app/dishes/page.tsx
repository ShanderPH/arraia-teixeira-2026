import type { Metadata } from "next";
import DishList from "./DishList";

export const metadata: Metadata = {
  title: "Lista de Pratos",
  description: "Veja quais pratos já foram escolhidos pelos convidados da Arraia Teixeira.",
};

export default function DishesPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mx-auto max-w-4xl text-center mb-10 space-y-3">
        <span className="inline-block text-4xl" aria-hidden="true">🍽️</span>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          Pratos da Arraia
        </h1>
        <p className="text-muted text-lg">
          Veja o que cada convidado vai trazer para a festa. Queremos variedade e muito sabor!
        </p>
      </div>

      <DishList />
    </div>
  );
}
