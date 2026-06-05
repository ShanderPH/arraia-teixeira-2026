"use client";

import { useEffect, useMemo, useState } from "react";
import type { DishResponse, GuestResponse } from "@/lib/api";
import { PREDEFINED_DISHES, CATEGORY_EMOJI, type DishCategory } from "@/lib/dishes";
import RSVPModal from "./RSVPModal";
import { Chapeu } from "./svgs";
import { api } from "@/lib/api";

interface DishesSectionProps {
  dishes: DishResponse[];
  guests: GuestResponse[];
}

const DISPLAY_CATEGORIES: DishCategory[] = ["Doces", "Caldos", "Salgados"];

export default function DishesSection({ dishes: initialDishes, guests }: DishesSectionProps) {
  const [dishes, setDishes] = useState(initialDishes);
  const [modalOpen, setModalOpen] = useState(false);
  const [preselected, setPreselected] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<DishCategory>("Doces");
  const [openCustom, setOpenCustom] = useState(false);

  useEffect(() => {
    api.dishes.list().then(setDishes).catch(() => {});
  }, []);

  const countByDishName = useMemo(() => {
    const nameById = new Map<string, string>();
    for (const d of dishes) nameById.set(d.id, d.name);
    const counts = new Map<string, number>();
    for (const g of guests) {
      if (!g.attending || !g.dish_id) continue;
      const name = nameById.get(g.dish_id);
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return counts;
  }, [dishes, guests]);

  function openForDish(name: string) {
    setOpenCustom(false);
    setPreselected(name);
    setModalOpen(true);
  }

  function openForCustom() {
    setPreselected(null);
    setOpenCustom(true);
    setModalOpen(true);
  }

  const photoByName = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of dishes) {
      if (d.photo_url) map.set(d.name.toLowerCase(), d.photo_url);
    }
    return map;
  }, [dishes]);

  const displayedDishes = PREDEFINED_DISHES.filter((d) => d.category === activeCategory);

  return (
    <section
      id="pratos"
      aria-label="Pratos do cardápio"
      className="wood py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="mx-auto max-w-6xl relative z-10">
        <header className="text-center mb-8 sm:mb-12 space-y-3">
          <div className="flex justify-center text-corn">
            <Chapeu size={72} />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-corn uppercase">
            Cardápio da Arraia
          </h2>
          <p className="font-hand text-2xl text-accent">
            Escolha um prato e deixe sua marca na festa!
          </p>
        </header>

        {/* Category tabs */}
        <div
          className="flex justify-center mb-8 p-1.5 rounded-2xl bg-black/30 border border-white/10 w-fit mx-auto gap-1"
          role="tablist"
          aria-label="Categorias de pratos"
        >
          {DISPLAY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-corn
                ${activeCategory === cat
                  ? "bg-corn text-[#1a0a00] shadow-md scale-105"
                  : "text-corn/70 hover:text-corn hover:bg-white/10"
                }
              `}
            >
              <span aria-hidden="true">{CATEGORY_EMOJI[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        <ul
          role="tabpanel"
          aria-label={`Pratos: ${activeCategory}`}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {displayedDishes.map((dish) => {
            const count = countByDishName.get(dish.name) ?? 0;
            const claimed = count > 0;
            const photoUrl = photoByName.get(dish.name.toLowerCase());
            return (
              <li key={dish.id}>
                {photoUrl ? (
                  /* ── Card com foto ── */
                  <button
                    type="button"
                    onClick={claimed ? undefined : () => openForDish(dish.name)}
                    disabled={claimed}
                    aria-label={claimed ? `${dish.name} — já escolhido por ${count} pessoa${count !== 1 ? "s" : ""}` : `Escolher ${dish.name}`}
                    className={`group relative w-full aspect-[3/4] rounded-3xl overflow-hidden border-2 shadow-surface focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${claimed ? "border-junina-green/50 cursor-not-allowed" : "border-white/15 lift press"}`}
                  >
                    <img
                      src={photoUrl}
                      alt={dish.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${claimed ? "" : "group-hover:scale-105"}`}
                    />
                    {/* base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* claimed: extra dark backdrop + centered badge */}
                    {claimed && (
                      <>
                        <div className="absolute inset-0 bg-black/55" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-junina-green/90 px-3 py-1.5 rounded-full shadow">
                            ✓ Já escolhido
                          </span>
                        </div>
                      </>
                    )}
                    {/* footer info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex flex-col items-center text-center gap-1.5">
                      <h3 className="font-display text-base sm:text-lg text-white uppercase tracking-wide leading-tight drop-shadow">
                        {dish.name}
                      </h3>
                      {claimed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80">
                          {count} trazendo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-accent/80 px-2.5 py-1 rounded-full">
                          + Escolher
                        </span>
                      )}
                    </div>
                  </button>
                ) : (
                  /* ── Card sem foto ── */
                  <button
                    type="button"
                    onClick={claimed ? undefined : () => openForDish(dish.name)}
                    disabled={claimed}
                    aria-label={claimed ? `${dish.name} — já escolhido por ${count} pessoa${count !== 1 ? "s" : ""}` : `Escolher ${dish.name}`}
                    className={`group relative w-full aspect-[3/4] rounded-3xl border-2 shadow-surface flex flex-col items-center justify-center text-center gap-2 p-4 sm:p-5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${claimed ? "border-junina-green/50 bg-surface/60 cursor-not-allowed" : "border-white/15 bg-surface text-foreground lift press"}`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 ${claimed ? "opacity-40" : "bg-accent/10"}`} aria-hidden="true">
                      {dish.emoji}
                    </div>
                    <h3 className={`font-display text-lg sm:text-xl uppercase tracking-wide leading-tight ${claimed ? "text-foreground/50" : ""}`}>
                      {dish.name}
                    </h3>
                    {claimed ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-junina-green/80 px-2.5 py-1 rounded-full">
                        ✓ Já escolhido · {count}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 border border-accent/30 px-2.5 py-1 rounded-full">
                        + Escolher
                      </span>
                    )}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={openForCustom}
            className="inline-flex items-center gap-2 font-hand text-xl text-corn border-2 border-corn/60 bg-corn/10 hover:bg-corn/20 px-6 py-3 rounded-2xl shadow-surface transition lift press focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <span aria-hidden="true">🍽️</span>
            Levar outro prato
          </button>
        </div>
      </div>

      <RSVPModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setOpenCustom(false); }}
        preselectedDish={preselected}
        openOnCustom={openCustom}
      />
    </section>
  );
}
