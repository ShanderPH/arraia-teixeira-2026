"use client";

import { useCallback, useEffect, useState } from "react";
import { MdPictureAsPdf, MdDownload, MdRestaurantMenu, MdPeople } from "react-icons/md";
import { api, type GuestResponse, type DishResponse } from "@/lib/api";
import { PREDEFINED_DISHES } from "@/lib/dishes";

export default function ExportTab() {
  const [guests, setGuests] = useState<GuestResponse[]>([]);
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(true);

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
  const attending = guests.filter((g) => g.attending);
  const totalPeople = attending.reduce((s, g) => s + (g.guest_count ?? 1), 0);

  function printSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head>
        <title>Arraia Teixeira 2026</title>
        <style>
          body { font-family: sans-serif; padding: 24px; color: #1a1a1a; }
          h1 { font-size: 22px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
          th { background: #f5f5f5; font-weight: 600; }
          tr:nth-child(even) td { background: #fafafa; }
          .footer { margin-top: 24px; font-size: 11px; color: #888; text-align: center; }
        </style>
      </head><body>
        ${el.innerHTML}
        <div class="footer">Gerado em ${new Date().toLocaleString("pt-BR")}</div>
      </body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 300);
  }

  const participantRows = attending.map((g) => {
    const dish = g.dish_id ? dishById[g.dish_id] : null;
    return `<tr>
      <td>${g.name}</td>
      <td style="text-align:center">${g.guest_count ?? 1}</td>
      <td>${dish?.name ?? "—"}</td>
      <td>${new Date(g.created_at).toLocaleDateString("pt-BR")}</td>
    </tr>`;
  }).join("");

  const dishCountByName = attending.reduce<Record<string, number>>((acc, g) => {
    const name = g.dish_id ? (dishById[g.dish_id]?.name ?? null) : null;
    if (name) acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});

  const menuRows = PREDEFINED_DISHES.map((d) => {
    const count = dishCountByName[d.name] ?? 0;
    return `<tr>
      <td>${d.emoji} ${d.name}</td>
      <td>${d.category}</td>
      <td style="text-align:center">${count}</td>
    </tr>`;
  }).join("");

  if (loading) return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-default animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats summary */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-2">
        <h2 className="font-bold text-sm text-muted uppercase tracking-widest">Resumo</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { label: "Confirmados", value: attending.length, emoji: "✅" },
            { label: "Total pessoas", value: totalPeople, emoji: "👥" },
            { label: "Pratos escolhidos", value: Object.keys(dishCountByName).length, emoji: "🍽️" },
            { label: "Não vão", value: guests.length - attending.length, emoji: "❌" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl" aria-hidden="true">{s.emoji}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Export cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ExportCard
          icon={<MdPeople className="text-3xl" />}
          title="Lista de Participantes"
          description={`${attending.length} confirmados · ${totalPeople} pessoas`}
          onPrint={() => printSection("export-participants")}
        />
        <ExportCard
          icon={<MdRestaurantMenu className="text-3xl" />}
          title="Cardápio da Festa"
          description={`${PREDEFINED_DISHES.length} pratos · ${Object.keys(dishCountByName).length} escolhidos`}
          onPrint={() => printSection("export-menu")}
        />
      </div>

      {/* Hidden print templates */}
      <div className="hidden" aria-hidden="true">
        <div id="export-participants">
          <h1>Lista de Participantes — Arraia Teixeira 2026</h1>
          <table>
            <thead><tr><th>Nome</th><th>Pessoas</th><th>Prato</th><th>Confirmado em</th></tr></thead>
            <tbody dangerouslySetInnerHTML={{ __html: participantRows }} />
          </table>
        </div>
        <div id="export-menu">
          <h1>Cardápio da Arraia Teixeira 2026</h1>
          <table>
            <thead><tr><th>Prato</th><th>Categoria</th><th>Escolhido por</th></tr></thead>
            <tbody dangerouslySetInnerHTML={{ __html: menuRows }} />
          </table>
        </div>
      </div>
    </div>
  );
}

function ExportCard({
  icon,
  title,
  description,
  onPrint,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPrint: () => void;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="text-accent">{icon}</div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={onPrint}
        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-background text-sm font-semibold hover:border-accent/60 hover:text-accent transition active:scale-[0.98]"
      >
        <MdPictureAsPdf className="text-lg" aria-hidden="true" />
        Imprimir / Salvar PDF
      </button>
    </div>
  );
}
