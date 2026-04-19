"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { MdOutlineCheckCircle } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import { PREDEFINED_DISHES, CATEGORIES, CATEGORY_EMOJI, type DishCategory } from "@/lib/dishes";
import { api, type DishResponse, type GuestResponse } from "@/lib/api";

interface DishEntry {
  dishName: string;
  category: DishCategory | "Outros";
  guests: string[];
}

function categoryForName(name: string): DishCategory | "Outros" {
  const found = PREDEFINED_DISHES.find(
    (d) => d.name.toLowerCase() === name.toLowerCase()
  );
  return found?.category ?? "Outros";
}

export default function DishList() {
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [guests, setGuests] = useState<GuestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([api.dishes.list(), api.guests.list()])
      .then(([d, g]) => {
        setDishes(d);
        setGuests(g);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl text-center py-12 text-muted">
        Carregando pratos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md text-center py-12 space-y-4">
        <div className="text-5xl" aria-hidden="true">⚠️</div>
        <p className="text-muted">Não foi possível carregar os dados. Tente novamente.</p>
      </div>
    );
  }

  const dishMap = new Map(dishes.map((d) => [d.id, d]));

  const attending = guests.filter((g) => g.attending);
  const notAttending = guests.filter((g) => !g.attending);
  const attendingWithDish = attending.filter((g) => g.dish_id);
  const attendingNoDish = attending.filter((g) => !g.dish_id);

  // Build dish entries: dish_id → { dishName, category, guests[] }
  const dishEntryMap = new Map<string, DishEntry>();
  for (const guest of attendingWithDish) {
    const dish = dishMap.get(guest.dish_id!);
    if (!dish) continue;
    const existing = dishEntryMap.get(dish.id);
    if (existing) {
      existing.guests.push(guest.name);
    } else {
      dishEntryMap.set(dish.id, {
        dishName: dish.name,
        category: categoryForName(dish.name),
        guests: [guest.name],
      });
    }
  }

  const categories: Array<DishCategory | "Outros"> = [...CATEGORIES, "Outros"];

  if (guests.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center space-y-6 py-12">
        <div className="text-6xl" aria-hidden="true">🍽️</div>
        <h2 className="text-xl font-bold text-foreground">Nenhum prato ainda!</h2>
        <p className="text-muted text-sm">
          Seja o primeiro a confirmar presença e escolher um prato especial.
        </p>
        <Link href="/rsvp">
          <Button className="bg-accent text-accent-foreground font-bold px-6 rounded-xl">
            <MdOutlineCheckCircle className="text-lg" aria-hidden="true" />
            Confirmar minha presença
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Confirmados",
            value: attending.length,
            color: "text-junina-green",
            bg: "bg-junina-green/10",
            emoji: "✅",
          },
          {
            label: "Pratos",
            value: dishEntryMap.size,
            color: "text-accent",
            bg: "bg-accent/10",
            emoji: "🍽️",
          },
          {
            label: "Duplicatas",
            value: Array.from(dishEntryMap.values()).filter((d) => d.guests.length > 1).length,
            color: "text-warning",
            bg: "bg-warning/10",
            emoji: "⚠️",
          },
          {
            label: "Não vão",
            value: notAttending.length,
            color: "text-muted",
            bg: "bg-default",
            emoji: "😢",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-2xl p-4 text-center border border-border`}
          >
            <div className="text-2xl mb-1" aria-hidden="true">{stat.emoji}</div>
            <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Dishes by category ── */}
      {categories.map((category) => {
        const entries = Array.from(dishEntryMap.values()).filter(
          (e) => e.category === category
        );
        if (entries.length === 0) return null;

        return (
          <section key={category} aria-label={`Pratos da categoria ${category}`}>
            <h2 className="flex items-center gap-2 text-xl font-bold text-foreground mb-4">
              <span aria-hidden="true">{CATEGORY_EMOJI[category as DishCategory] ?? "🎉"}</span>
              {category}
              <span className="text-sm font-normal text-muted">
                ({entries.length} prato{entries.length !== 1 ? "s" : ""})
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map((entry) => (
                <article
                  key={entry.dishName}
                  className={`
                    relative bg-surface border rounded-2xl p-4 space-y-3
                    shadow-surface transition-all duration-200 hover:shadow-overlay hover:-translate-y-0.5
                    ${entry.guests.length > 1 ? "border-warning/60" : "border-border"}
                  `}
                  aria-label={`${entry.dishName} — ${entry.guests.length} pessoa(s)`}
                >
                  {entry.guests.length > 1 && (
                    <span
                      className="absolute top-3 right-3 bg-warning text-warning-foreground text-xs font-bold px-2 py-0.5 rounded-full"
                      aria-label={`${entry.guests.length} pessoas escolheram este prato`}
                    >
                      ×{entry.guests.length} duplicata
                    </span>
                  )}

                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {PREDEFINED_DISHES.find(
                        (d) => d.name.toLowerCase() === entry.dishName.toLowerCase()
                      )?.emoji ?? "🍽️"}
                    </span>
                    <div>
                      <h3 className="font-bold text-foreground text-base leading-tight">
                        {entry.dishName}
                      </h3>
                      <p className="text-xs text-muted mt-0.5">{entry.category}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {entry.guests.map((guestName) => (
                      <div
                        key={guestName}
                        className="flex items-center gap-1.5 text-sm text-muted"
                      >
                        <MdOutlineCheckCircle
                          className="text-junina-green flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>{guestName}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {/* ── Attending but no dish ── */}
      {attendingNoDish.length > 0 && (
        <section aria-label="Confirmados sem prato">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground mb-4">
            <span aria-hidden="true">❓</span>
            Confirmados sem prato
            <span className="text-sm font-normal text-muted">({attendingNoDish.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {attendingNoDish.map((g) => (
              <div
                key={g.id}
                className="bg-surface border border-border rounded-xl p-3 flex items-center gap-2 text-sm"
              >
                <GiMeal className="text-muted flex-shrink-0" aria-hidden="true" />
                <span className="text-foreground font-medium">{g.name}</span>
                <span className="text-muted text-xs ml-auto">sem prato</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Not attending ── */}
      {notAttending.length > 0 && (
        <section aria-label="Não vão comparecer">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground mb-4">
            <span aria-hidden="true">😢</span>
            Não vão comparecer
            <span className="text-sm font-normal text-muted">({notAttending.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {notAttending.map((g) => (
              <div
                key={g.id}
                className="bg-surface border border-border rounded-xl p-3 flex items-center gap-2 text-sm opacity-60"
              >
                <span className="text-foreground font-medium">{g.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <div className="text-center pt-4 pb-2">
        <Link href="/rsvp">
          <Button className="bg-accent text-accent-foreground font-bold px-8 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
            <MdOutlineCheckCircle className="text-lg" aria-hidden="true" />
            Confirmar minha presença
          </Button>
        </Link>
      </div>
    </div>
  );
}
