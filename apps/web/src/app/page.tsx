import type { Metadata } from "next";
import HeroClient from "@/components/arraia/HeroClient";
import DishesSection from "@/components/arraia/DishesSection";
import ConfirmedSection from "@/components/arraia/ConfirmedSection";
import GalleryLazy from "@/components/arraia/GalleryLazy";
import { listDishes, listGuests } from "@/lib/data";

// Always fetch fresh dish + guest data from the API on every request
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Início",
  description:
    "Bem-vindo à Arraia Teixeira! Confirme sua presença, escolha seu prato e entre no clima da melhor festa junina do pedaço.",
};

export default async function HomePage() {
  const [dishes, guests] = await Promise.all([listDishes(), listGuests()]);
  const availableDishes = dishes.map((d) => d.name);

  return (
    <>
      <HeroClient availableDishes={availableDishes} />
      <DishesSection dishes={dishes} guests={guests} />
      <ConfirmedSection dishes={dishes} guests={guests} />
      <GalleryLazy />
    </>
  );
}
