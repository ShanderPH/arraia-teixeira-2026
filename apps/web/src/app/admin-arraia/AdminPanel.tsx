"use client";

import { useState } from "react";
import { Tabs } from "@heroui/react";
import { MdRestaurantMenu, MdPeople, MdPhoto, MdPictureAsPdf, MdLock } from "react-icons/md";
import DishesTab from "./tabs/DishesTab";
import GuestsTab from "./tabs/GuestsTab";
import GalleryTab from "./tabs/GalleryTab";
import ExportTab from "./tabs/ExportTab";

const ADMIN_PASSWORD = "arraia2026";

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      setError(true);
      setPassword("");
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-8 shadow-surface space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center text-4xl mb-2" aria-hidden="true">🎪</div>
            <h1 className="font-display text-2xl text-accent uppercase">Admin</h1>
            <p className="text-sm text-muted">Arraia Teixeira 2026</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MdLock className="text-accent" aria-hidden="true" />
                Senha de acesso
              </label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full px-4 py-3 rounded-xl border bg-field text-field-foreground placeholder:text-field-placeholder focus:outline-none focus:ring-2 focus:ring-accent ${error ? "border-danger focus:ring-danger" : "border-field-border"}`}
              />
              {error && <p className="text-danger text-sm" role="alert">Senha incorreta.</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 transition active:scale-[0.98]"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">🎪</span>
          <div>
            <h1 className="font-display text-lg text-accent uppercase leading-none">Admin</h1>
            <p className="text-xs text-muted">Arraia Teixeira 2026</p>
          </div>
        </div>
        <button
          onClick={() => setAuthenticated(false)}
          className="text-xs text-muted hover:text-danger transition px-3 py-1.5 rounded-lg border border-border hover:border-danger/40"
        >
          Sair
        </button>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        <Tabs defaultSelectedKey="dishes" className="w-full">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Seções do admin" className="w-full">
              <Tabs.Tab id="dishes">
                <MdRestaurantMenu className="text-base" aria-hidden="true" />
                Pratos
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="guests">
                <Tabs.Separator />
                <MdPeople className="text-base" aria-hidden="true" />
                Participantes
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="gallery">
                <Tabs.Separator />
                <MdPhoto className="text-base" aria-hidden="true" />
                Galeria
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="export">
                <Tabs.Separator />
                <MdPictureAsPdf className="text-base" aria-hidden="true" />
                Exportar PDF
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>

          <Tabs.Panel id="dishes" className="pt-6">
            <DishesTab />
          </Tabs.Panel>
          <Tabs.Panel id="guests" className="pt-6">
            <GuestsTab />
          </Tabs.Panel>
          <Tabs.Panel id="gallery" className="pt-6">
            <GalleryTab />
          </Tabs.Panel>
          <Tabs.Panel id="export" className="pt-6">
            <ExportTab />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}
