export type DishCategory = "Doces" | "Salgados" | "Bebidas" | "Outros";

export interface Dish {
  id: string;
  name: string;
  category: DishCategory;
  emoji: string;
}

export const PREDEFINED_DISHES: Dish[] = [
  // Doces
  { id: "canjica", name: "Canjica", category: "Doces", emoji: "🌽" },
  { id: "curau", name: "Curau", category: "Doces", emoji: "🌽" },
  { id: "arroz-doce", name: "Arroz Doce", category: "Doces", emoji: "🍚" },
  { id: "bolo-milho", name: "Bolo de Milho", category: "Doces", emoji: "🎂" },
  { id: "bolo-fuba", name: "Bolo de Fubá", category: "Doces", emoji: "🍰" },
  { id: "pamonha", name: "Pamonha", category: "Doces", emoji: "🌽" },
  { id: "mungunza", name: "Mungunzá", category: "Doces", emoji: "🥣" },
  { id: "cocada", name: "Cocada", category: "Doces", emoji: "🥥" },
  { id: "pe-de-moleque", name: "Pé de Moleque", category: "Doces", emoji: "🥜" },
  { id: "brigadeiro", name: "Brigadeiro", category: "Doces", emoji: "🍫" },
  { id: "doce-abobora", name: "Doce de Abóbora", category: "Doces", emoji: "🎃" },
  // Salgados
  { id: "espetinho", name: "Espetinho de Carne", category: "Salgados", emoji: "🍢" },
  { id: "milho-cozido", name: "Milho Cozido", category: "Salgados", emoji: "🌽" },
  { id: "caldinho-feijao", name: "Caldinho de Feijão", category: "Salgados", emoji: "🫘" },
  { id: "caldinho-mandioca", name: "Caldinho de Mandioca", category: "Salgados", emoji: "🍲" },
  { id: "pinhao", name: "Pinhão Cozido", category: "Salgados", emoji: "🌰" },
  { id: "carne-sol", name: "Carne de Sol", category: "Salgados", emoji: "🥩" },
  { id: "baiao-dois", name: "Baião de Dois", category: "Salgados", emoji: "🍛" },
  // Bebidas
  { id: "quentao", name: "Quentão", category: "Bebidas", emoji: "🍵" },
  { id: "vinho-quente", name: "Vinho Quente", category: "Bebidas", emoji: "🍷" },
  { id: "suco-milho", name: "Suco de Milho", category: "Bebidas", emoji: "🥤" },
  { id: "licor", name: "Licor Caseiro", category: "Bebidas", emoji: "🍶" },
];

export const CATEGORIES: DishCategory[] = ["Doces", "Salgados", "Bebidas", "Outros"];

export const CATEGORY_EMOJI: Record<DishCategory, string> = {
  Doces: "🍬",
  Salgados: "🍖",
  Bebidas: "🥤",
  Outros: "🎉",
};
