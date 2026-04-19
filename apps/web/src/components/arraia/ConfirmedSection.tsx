import type { DishResponse, GuestResponse } from "@/lib/api";
import { getDishEntry } from "@/lib/dish-catalog";

interface ConfirmedSectionProps {
  dishes: DishResponse[];
  guests: GuestResponse[];
}

export default function ConfirmedSection({ dishes, guests }: ConfirmedSectionProps) {
  const dishMap = new Map(dishes.map((d) => [d.id, d]));
  const attending = guests.filter((g) => g.attending);
  const confirmedCards = attending.map((g) => {
    const dish = g.dish_id ? dishMap.get(g.dish_id) : null;
    const name = dish?.name ?? "Sem prato definido";
    const entry = dish ? getDishEntry(dish.name) : null;
    return { guestId: g.id, guestName: g.name, dishName: name, entry };
  });

  return (
    <section
      id="confirmados"
      aria-label="Convidados já confirmados"
      className="bg-background py-16 sm:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="text-center space-y-2">
          <h2 className="font-display text-4xl sm:text-5xl text-earth uppercase">
            Quem já confirmou
          </h2>
          <p className="font-hand text-2xl text-accent">
            {confirmedCards.length} pessoa{confirmedCards.length !== 1 ? "s" : ""} vem dançar forró com a gente!
          </p>
        </header>

        {confirmedCards.length === 0 ? (
          <div className="mx-auto max-w-md text-center py-12 space-y-3">
            <div className="text-5xl" aria-hidden="true">🎪</div>
            <p className="text-muted">
              Ainda ninguém confirmou. Seja o primeiro!
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {confirmedCards.map(({ guestId, guestName, dishName, entry }) => {
              const Icon = entry?.Icon;
              return (
                <li
                  key={guestId}
                  className="
                    relative flex items-center gap-3
                    bg-surface border border-border
                    rounded-2xl p-4
                    shadow-surface lift
                  "
                >
                  <div className={`w-14 h-14 flex-shrink-0 rounded-xl flex items-center justify-center ${entry?.tone ?? "bg-default"}`}>
                    {Icon ? <Icon size={46} /> : <span className="text-2xl" aria-hidden="true">🎉</span>}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{guestName}</p>
                    <p className={`text-sm truncate ${entry?.accent ?? "text-muted"}`}>
                      {dishName}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
