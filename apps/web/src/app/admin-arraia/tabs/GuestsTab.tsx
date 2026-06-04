"use client";

import { useCallback, useEffect, useState } from "react";
import { MdDeleteOutline, MdSearch, MdPeople } from "react-icons/md";
import { api, type GuestResponse, type DishResponse } from "@/lib/api";

export default function GuestsTab() {
  const [guests, setGuests] = useState<GuestResponse[]>([]);
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterAttending, setFilterAttending] = useState<"all" | "yes" | "no">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [g, d] = await Promise.all([api.guests.list(), api.dishes.list()]);
      setGuests(g);
      setDishes(d);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const dishById = Object.fromEntries(dishes.map((d) => [d.id, d]));

  const filtered = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterAttending === "all" ||
      (filterAttending === "yes" && g.attending) ||
      (filterAttending === "no" && !g.attending);
    return matchSearch && matchFilter;
  });

  const totalGuests = guests.filter((g) => g.attending).reduce((s, g) => s + (g.guest_count ?? 1), 0);
  const totalConfirmed = guests.filter((g) => g.attending).length;

  async function handleDelete(id: string) {
    if (!confirm("Remover participante?")) return;
    setDeletingId(id);
    try {
      await api.guests.delete(id);
      setGuests((prev) => prev.filter((g) => g.id !== id));
    } finally { setDeletingId(null); }
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Confirmados", value: totalConfirmed, emoji: "✅" },
          { label: "Total pessoas", value: totalGuests, emoji: "👥" },
          { label: "Não vão", value: guests.filter((g) => !g.attending).length, emoji: "❌" },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-xl p-3 text-center">
            <div className="text-xl" aria-hidden="true">{s.emoji}</div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-lg" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-field-border bg-field text-field-foreground placeholder:text-field-placeholder focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
        </div>
        <div className="flex gap-1.5 p-1 bg-background rounded-xl border border-border">
          {(["all", "yes", "no"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterAttending(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterAttending === v ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground"}`}
            >
              {v === "all" ? "Todos" : v === "yes" ? "Vão" : "Não vão"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted">
          <MdPeople className="text-4xl mx-auto mb-2 opacity-40" aria-hidden="true" />
          <p>Nenhum participante encontrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((g) => {
            const dish = g.dish_id ? dishById[g.dish_id] : null;
            return (
              <div
                key={g.id}
                className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${g.attending ? "bg-junina-green" : "bg-danger"}`}
                  aria-label={g.attending ? "Confirmado" : "Não vai"}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{g.name}</p>
                  <p className="text-xs text-muted">
                    {g.attending
                      ? `${g.guest_count ?? 1} pessoa${(g.guest_count ?? 1) !== 1 ? "s" : ""} · ${dish ? dish.name : "sem prato"}`
                      : "Não vai comparecer"
                    }
                  </p>
                </div>
                <span className="text-xs text-muted hidden sm:block">
                  {new Date(g.created_at).toLocaleDateString("pt-BR")}
                </span>
                <button
                  onClick={() => handleDelete(g.id)}
                  disabled={deletingId === g.id}
                  aria-label={`Remover ${g.name}`}
                  className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition disabled:opacity-40"
                >
                  {deletingId === g.id
                    ? <span className="w-4 h-4 border-2 border-danger border-t-transparent rounded-full animate-spin block" />
                    : <MdDeleteOutline className="text-xl" />
                  }
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-2" aria-busy="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-default animate-pulse" />
      ))}
    </div>
  );
}
