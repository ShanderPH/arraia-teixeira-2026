"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button, Tabs } from "@heroui/react";
import { MdClose, MdOutlineCheckCircle, MdEdit } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { submitRsvp } from "@/lib/data";
import { api, type DishResponse } from "@/lib/api";
import {
  PREDEFINED_DISHES,
  CATEGORY_EMOJI,
  type DishCategory,
} from "@/lib/dishes";

interface RSVPModalProps {
  open: boolean;
  onClose: () => void;
  preselectedDish?: string | null;
}

const DISH_CATEGORIES = (["Doces", "Caldos", "Salgados"] as DishCategory[]).filter((c) =>
  PREDEFINED_DISHES.some((d) => d.category === c)
);

export default function RSVPModal({
  open,
  onClose,
  preselectedDish = null,
}: RSVPModalProps) {
  const router = useRouter();
  const formId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [selectedDishId, setSelectedDishId] = useState<string>(() =>
    PREDEFINED_DISHES.find((d) => d.name === preselectedDish)?.id ?? ""
  );
  const [customDish, setCustomDish] = useState("");
  const [useCustomDish, setUseCustomDish] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(DISH_CATEGORIES[0]);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // dish picker overlay
  const [showPicker, setShowPicker] = useState(false);
  // remote dishes for thumbnails
  const [remoteDishes, setRemoteDishes] = useState<DishResponse[]>([]);

  useEffect(() => {
    if (open) api.dishes.list().then(setRemoteDishes).catch(() => {});
  }, [open]);

  const photoByName = new Map(remoteDishes.map((d) => [d.name.toLowerCase(), d.photo_url ?? null]));

  // Sync preselectedDish on open
  const [prevKey, setPrevKey] = useState(`${open}-${preselectedDish ?? ""}`);
  const currentKey = `${open}-${preselectedDish ?? ""}`;
  if (prevKey !== currentKey) {
    setPrevKey(currentKey);
    const match = PREDEFINED_DISHES.find((d) => d.name === preselectedDish);
    setSelectedDishId(match?.id ?? "");
    if (match) setActiveCategory(match.category);
  }

  // Focus trap + Esc close
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; previous?.focus?.(); };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErrorMessage("Por favor, informe seu nome."); return; }
    setStatus("saving");
    setErrorMessage(null);
    try {
      const dishName = useCustomDish
        ? customDish.trim() || null
        : PREDEFINED_DISHES.find((d) => d.id === selectedDishId)?.name ?? null;
      await submitRsvp({
        name: name.trim(),
        attending: true,
        guest_count: guestCount,
        dish_name: dishName,
      });
      setStatus("success");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Não foi possível salvar. Tente novamente.");
    }
  }

  function reset() {
    setName("");
    setGuestCount(1);
    setSelectedDishId(PREDEFINED_DISHES.find((d) => d.name === preselectedDish)?.id ?? "");
    setCustomDish("");
    setUseCustomDish(false);
    setShowPicker(false);
    setStatus("idle");
    setErrorMessage(null);
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
    >
      <div
        ref={dialogRef}
        className="relative w-full sm:max-w-lg bg-surface text-foreground rounded-t-3xl sm:rounded-3xl shadow-overlay border border-border max-h-[95dvh] overflow-y-auto"
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <span className="h-1.5 w-10 rounded-full bg-border" aria-hidden="true" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 p-2 rounded-full text-muted hover:bg-default focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <MdClose className="text-xl" aria-hidden="true" />
        </button>

        <div className="px-5 sm:px-7 pt-6 pb-2">
          <h2 id={`${formId}-title`} className="font-display text-2xl sm:text-3xl text-accent">
            Confirmar presença
          </h2>
          <p className="text-sm text-muted mt-1">Preencha e venha curtir a festa com a gente!</p>
        </div>

        {status === "success" ? (
          <div className="px-5 sm:px-7 py-6 space-y-4 text-center">
            <div className="text-5xl" aria-hidden="true">🎉</div>
            <h3 className="font-bold text-lg">Tá confirmado! 🎊</h3>
            <p className="text-sm text-muted">Mal podemos esperar para te ver na festa.</p>
            <div className="flex gap-3 justify-center pt-2">
              <Button type="button" onPress={reset} className="bg-default text-foreground">Nova confirmação</Button>
              <Button type="button" onPress={onClose} className="bg-accent text-accent-foreground font-bold">Fechar</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 sm:px-7 pb-6 space-y-5 mt-3">
            {errorMessage && (
              <p role="alert" className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-3 py-2">
                {errorMessage}
              </p>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor={`${formId}-name`} className="text-sm font-semibold">
                Seu nome <span className="text-danger">*</span>
              </label>
              <input
                id={`${formId}-name`}
                ref={firstFieldRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria da Silva"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border border-field-border bg-field text-field-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Guest count — centralizado */}
            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 text-sm font-semibold">
                <FaUsers className="text-accent" aria-hidden="true" />
                Quantas pessoas vêm com você?
              </label>
              <div className="flex items-center justify-center gap-4">
                <button type="button" onClick={() => setGuestCount((v) => Math.max(1, v - 1))} aria-label="Diminuir" className="w-11 h-11 rounded-xl border border-border bg-background text-2xl font-bold hover:border-accent/60 active:scale-95 flex items-center justify-center transition">−</button>
                <div className="text-center">
                  <span className="block text-3xl font-black tabular-nums text-accent">{guestCount}</span>
                  <span className="text-xs text-muted">{guestCount === 1 ? "só eu" : "incluindo você"}</span>
                </div>
                <button type="button" onClick={() => setGuestCount((v) => Math.min(20, v + 1))} aria-label="Aumentar" className="w-11 h-11 rounded-xl border border-border bg-background text-2xl font-bold hover:border-accent/60 active:scale-95 flex items-center justify-center transition">+</button>
              </div>
            </div>

            {/* Dish */}
            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-sm font-semibold">Prato que vai trazer</p>

              {/* Toggle Da lista / Outro */}
              <div className="flex gap-1.5 p-1 bg-background rounded-xl border border-border">
                <button type="button" onClick={() => setUseCustomDish(false)} className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition ${!useCustomDish ? "bg-accent text-accent-foreground shadow-sm" : "text-muted hover:text-foreground"}`} aria-pressed={!useCustomDish}>
                  🍽️ Da lista
                </button>
                <button type="button" onClick={() => setUseCustomDish(true)} className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition ${useCustomDish ? "bg-accent text-accent-foreground shadow-sm" : "text-muted hover:text-foreground"}`} aria-pressed={useCustomDish}>
                  ✏️ Outro
                </button>
              </div>

              {!useCustomDish ? (
                selectedDishId && !showPicker ? (
                  /* ── Card do prato selecionado ── */
                  (() => {
                    const dish = PREDEFINED_DISHES.find((d) => d.id === selectedDishId)!;
                    const photo = photoByName.get(dish.name.toLowerCase());
                    return (
                      <div className="flex items-center gap-3 bg-background border-2 border-accent/50 rounded-2xl p-3">
                        <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-default flex items-center justify-center">
                          {photo
                            ? <img src={photo} alt={dish.name} className="w-full h-full object-cover" />
                            : <span className="text-3xl" aria-hidden="true">{dish.emoji}</span>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground truncate">{dish.name}</p>
                          <p className="text-xs text-muted">{dish.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPicker(true)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-accent border border-accent/40 bg-accent/5 hover:bg-accent/15 px-3 py-2 rounded-xl transition"
                          aria-label="Trocar prato"
                        >
                          <MdEdit className="text-base" aria-hidden="true" /> Trocar
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  /* ── Picker com tabs ── */
                  <div className="space-y-2">
                    {showPicker && (
                      <button type="button" onClick={() => setShowPicker(false)} className="text-xs text-muted hover:text-foreground flex items-center gap-1 transition">
                        ← Cancelar troca
                      </button>
                    )}
                    <Tabs
                      selectedKey={activeCategory}
                      onSelectionChange={(k) => setActiveCategory(String(k))}
                      className="w-full"
                    >
                      <Tabs.ListContainer>
                        <Tabs.List aria-label="Categorias de pratos" className="w-full">
                          {DISH_CATEGORIES.map((cat, i) => (
                            <Tabs.Tab key={cat} id={cat}>
                              {i > 0 && <Tabs.Separator />}
                              {CATEGORY_EMOJI[cat]} {cat}
                              <Tabs.Indicator />
                            </Tabs.Tab>
                          ))}
                        </Tabs.List>
                      </Tabs.ListContainer>
                      {DISH_CATEGORIES.map((cat) => (
                        <Tabs.Panel key={cat} id={cat} className="pt-3">
                          <div className="grid grid-cols-2 gap-2">
                            {PREDEFINED_DISHES.filter((d) => d.category === cat).map((dish) => {
                              const photo = photoByName.get(dish.name.toLowerCase());
                              const isSelected = selectedDishId === dish.id;
                              return (
                                <button
                                  key={dish.id}
                                  type="button"
                                  onClick={() => { setSelectedDishId(dish.id); setShowPicker(false); }}
                                  className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-center ${
                                    isSelected ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent/40 hover:bg-accent/5"
                                  }`}
                                  aria-pressed={isSelected}
                                  aria-label={dish.name}
                                >
                                  <div className="w-full aspect-[3/2] rounded-lg overflow-hidden bg-default flex items-center justify-center">
                                    {photo
                                      ? <img src={photo} alt={dish.name} className="w-full h-full object-cover" />
                                      : <span className="text-2xl" aria-hidden="true">{dish.emoji}</span>
                                    }
                                  </div>
                                  <span className="text-xs font-medium leading-tight line-clamp-2">{dish.name}</span>
                                  {isSelected && <MdOutlineCheckCircle className="text-accent" aria-hidden="true" />}
                                </button>
                              );
                            })}
                          </div>
                        </Tabs.Panel>
                      ))}
                    </Tabs>
                  </div>
                )
              ) : (
                <input
                  type="text"
                  value={customDish}
                  onChange={(e) => setCustomDish(e.target.value)}
                  placeholder="Ex: Bolo de mandioca da vovó"
                  className="w-full px-4 py-3 rounded-xl border border-field-border bg-field text-field-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              )}
              <p className="text-xs text-muted">Deixe sem seleção se ainda não decidiu.</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-1">
              <Button type="button" onPress={onClose} className="bg-default text-foreground order-2 sm:order-1">Cancelar</Button>
              <Button type="submit" isPending={status === "saving"} isDisabled={status === "saving"} className="bg-accent text-accent-foreground font-bold order-1 sm:order-2">
                {status === "saving" ? "Enviando..." : "Confirmar presença 🎊"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
