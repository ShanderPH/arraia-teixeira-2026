export type DishCategory = "Doces" | "Caldos" | "Salgados" | "Outros";

export interface Dish {
  id: string;
  name: string;
  category: DishCategory;
  emoji: string;
}

export const PREDEFINED_DISHES: Dish[] = [
  // Doces
  { id: "canjicao",                      name: "Canjicão",                     category: "Doces",   emoji: "🌽" },
  { id: "papa-de-milho",                 name: "Papa de milho",                category: "Doces",   emoji: "🥣" },
  { id: "churros",                       name: "Churros",                      category: "Doces",   emoji: "�" },
  { id: "bolo-milho",                    name: "Bolo de milho",                category: "Doces",   emoji: "🎂" },
  { id: "bolo-cenoura-chocolate",        name: "Bolo de cenoura com chocolate",category: "Doces",   emoji: "🍰" },
  { id: "bolo-aipim-coco",              name: "Bolo de aipim com coco",       category: "Doces",   emoji: "🥥" },
  { id: "bolo-doce-leite",              name: "Bolo de doce de leite",        category: "Doces",   emoji: "�" },
  { id: "cuscuz-coco",                  name: "Cuscuz de coco",               category: "Doces",   emoji: "�" },
  // Caldos
  { id: "caldo-costela",                name: "Caldo de costela",             category: "Caldos",  emoji: "�" },
  { id: "caldo-verde",                  name: "Caldo verde",                  category: "Caldos",  emoji: "🥬" },
  { id: "caldo-pinto",                  name: "Caldo de pinto",               category: "Caldos",  emoji: "🐔" },
  { id: "caldo-pela-egua",             name: "Caldo pela égua",              category: "Caldos",  emoji: "�️" },
  { id: "caldo-feijao",                name: "Caldo de feijão",              category: "Caldos",  emoji: "🫘" },
  // Salgados
  { id: "salgadinhos",                  name: "Salgadinhos",                  category: "Salgados", emoji: "�" },
  { id: "empadao",                      name: "Empadão",                      category: "Salgados", emoji: "🥧" },
  { id: "torta-frango",                name: "Torta de frango",              category: "Salgados", emoji: "�" },
  { id: "cachorro-quente",             name: "Cachorro quente",              category: "Salgados", emoji: "�" },
];

export const CATEGORIES: DishCategory[] = ["Doces", "Caldos", "Salgados", "Outros"];

export const CATEGORY_EMOJI: Record<DishCategory, string> = {
  Doces:   "🍬",
  Caldos:  "🍲",
  Salgados: "🍖",
  Outros:  "🎉",
};

export const CATEGORY_LABEL: Record<DishCategory, string> = {
  Doces:   "Doces",
  Caldos:  "Caldos",
  Salgados: "Salgados",
  Outros:  "Outros",
};
