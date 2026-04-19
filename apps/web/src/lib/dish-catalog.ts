import type { ComponentType, SVGProps } from "react";
import {
  IconArrozDoce,
  IconBolinho,
  IconBolo,
  IconCanjica,
  IconPacoca,
  IconPamonha,
  IconPipoca,
  IconQuentao,
} from "@/components/arraia/svgs";

export interface DishCatalogEntry {
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  tone: string;
  accent: string;
  desc: string;
}

export function normalizeDishName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const DISH_CATALOG: Record<string, DishCatalogEntry> = {
  canjica: {
    Icon: IconCanjica,
    tone: "bg-corn/30",
    accent: "text-corn-foreground",
    desc: "Quentinha, cremosa e com canela — clássico junino.",
  },
  pamonha: {
    Icon: IconPamonha,
    tone: "bg-junina-green/15",
    accent: "text-junina-green",
    desc: "Milho verde ralado na palha, cozida no ponto certo.",
  },
  "bolo de fuba": {
    Icon: IconBolo,
    tone: "bg-fire/15",
    accent: "text-fire",
    desc: "Bolo fofinho com queijo e um toque de erva-doce.",
  },
  quentao: {
    Icon: IconQuentao,
    tone: "bg-accent/15",
    accent: "text-accent",
    desc: "Cachaça, gengibre, cravo e canela — esquenta a alma.",
  },
  pacoca: {
    Icon: IconPacoca,
    tone: "bg-earth/20",
    accent: "text-earth",
    desc: "Amendoim moído, doce e quebradiço.",
  },
  "pipoca doce": {
    Icon: IconPipoca,
    tone: "bg-accent/15",
    accent: "text-accent",
    desc: "Caramelizada na panela, um abraço doce.",
  },
  "bolinho de chuva": {
    Icon: IconBolinho,
    tone: "bg-corn/30",
    accent: "text-corn-foreground",
    desc: "Fritos na hora, passados no açúcar com canela.",
  },
  "arroz doce": {
    Icon: IconArrozDoce,
    tone: "bg-royal/15",
    accent: "text-royal",
    desc: "Cremoso, com leite condensado e canela em pau.",
  },
};

export const FALLBACK_ENTRY: DishCatalogEntry = {
  Icon: IconBolinho,
  tone: "bg-default",
  accent: "text-foreground",
  desc: "Uma delícia surpresa para a festa.",
};

export function getDishEntry(name: string): DishCatalogEntry {
  return DISH_CATALOG[normalizeDishName(name)] ?? FALLBACK_ENTRY;
}
