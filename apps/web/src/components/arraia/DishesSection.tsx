"use client";

import { useMemo, useState } from "react";
import type { DishResponse, GuestResponse } from "@/lib/api";
import { getDishEntry, normalizeDishName } from "@/lib/dish-catalog";
import RSVPModal from "./RSVPModal";
import { Chapeu } from "./svgs";

interface DishesSectionProps {
  dishes: DishResponse[];
  guests: GuestResponse[];
}

const KNOWN_DISHES = [
  "Canjica",
  "Pamonha",
  "Bolo de Fubá",
  "Quentão",
  "Paçoca",
  "Pipoca doce",
  "Bolinho de chuva",
  "Arroz doce",
];

export default function DishesSection({ dishes, guests }: DishesSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [preselected, setPreselected] = useState<string | null>(null);

  const guestsByDishId = useMemo(() => {
    const map = new Map<string, GuestResponse[]>();
    for (const g of guests) {
      if (!g.attending || !g.dish_id) continue;
      const list = map.get(g.dish_id) ?? [];
      list.push(g);
      map.set(g.dish_id, list);
    }
    return map;
  }, [guests]);

  // Ensure known dishes always appear (even if backend doesn't have them yet)
  const mergedDishes = useMemo(() => {
    const byName = new Map<string, DishResponse>();
    for (const d of dishes) {
      byName.set(normalizeDishName(d.name), d);
    }
    const result: Array<{ id: string | null; name: string; count: number }> = [];
    for (const known of KNOWN_DISHES) {
      const existing = byName.get(normalizeDishName(known));
      if (existing) {
        result.push({
          id: existing.id,
          name: existing.name,
          count: guestsByDishId.get(existing.id)?.length ?? 0,
        });
        byName.delete(normalizeDishName(known));
      } else {
        result.push({ id: null, name: known, count: 0 });
      }
    }
    for (const d of byName.values()) {
      result.push({
        id: d.id,
        name: d.name,
        count: guestsByDishId.get(d.id)?.length ?? 0,
      });
    }
    return result;
  }, [dishes, guestsByDishId]);

  function openForDish(name: string) {
    setPreselected(name);
    setModalOpen(true);
  }

  return (
    <section
      id="pratos"
      aria-label="Pratos do cardápio"
      className="wood py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="mx-auto max-w-6xl relative z-10">
        <header className="text-center mb-10 sm:mb-14 space-y-3">
          <div className="flex justify-center text-earth">
            <Chapeu size={72} />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-earth uppercase">
            Cardápio da Arraia
          </h2>
          <p className="font-hand text-2xl text-accent">
            Escolha um prato e deixe sua marca na festa!
          </p>
        </header>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {mergedDishes.map((dish) => {
            const entry = getDishEntry(dish.name);
            const Icon = entry.Icon;
            const claimed = dish.count > 0;
            return (
              <li key={dish.name}>
                <button
                  type="button"
                  onClick={() => openForDish(dish.name)}
                  aria-label={`Escolher ${dish.name}${claimed ? ` (${dish.count} já confirmou)` : ""}`}
                  className={`
                    group relative w-full h-full p-4 sm:p-5
                    rounded-3xl border-2 border-earth/25
                    bg-surface text-foreground
                    shadow-surface lift press
                    flex flex-col items-center text-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                  `}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${entry.tone}`}>
                    <Icon size={52} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl uppercase tracking-wide leading-tight">
                    {dish.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-snug">
                    {entry.desc}
                  </p>
                  {claimed ? (
                    <span
                      className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-junina-green bg-junina-green/10 border border-junina-green/30 px-2.5 py-1 rounded-full"
                    >
                      ✓ {dish.count} trazendo
                    </span>
                  ) : (
                    <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 border border-accent/30 px-2.5 py-1 rounded-full">
                      + Escolher
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <RSVPModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedDish={preselected}
        availableDishes={mergedDishes.map((d) => d.name)}
      />
    </section>
  );
}
