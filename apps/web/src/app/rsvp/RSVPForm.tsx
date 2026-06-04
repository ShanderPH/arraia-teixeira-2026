"use client";

import { useState, useId } from "react";
import { Button, Tabs } from "@heroui/react";
import { MdOutlineCheckCircle, MdOutlineCancel } from "react-icons/md";
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import Link from "next/link";
import {
  PREDEFINED_DISHES,
  CATEGORIES,
  CATEGORY_EMOJI,
  type DishCategory,
} from "@/lib/dishes";
import { api } from "@/lib/api";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  name?: string;
  guestCount?: string;
  dish?: string;
}

const DISH_CATEGORIES = (["Doces", "Caldos", "Salgados"] as DishCategory[]).filter((c) =>
  PREDEFINED_DISHES.some((d) => d.category === c)
);

export default function RSVPForm() {
  const formId = useId();

  const [name, setName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string>("");
  const [customDish, setCustomDish] = useState("");
  const [useCustomDish, setUseCustomDish] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(DISH_CATEGORIES[0]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [submittedName, setSubmittedName] = useState("");

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!name.trim()) {
      errs.name = "Por favor, informe seu nome.";
    } else if (name.trim().length < 2) {
      errs.name = "Nome deve ter pelo menos 2 caracteres.";
    }
    if (guestCount < 1 || guestCount > 20) {
      errs.guestCount = "Informe entre 1 e 20 pessoas.";
    }
    if (attending === true) {
      if (useCustomDish && !customDish.trim()) {
        errs.dish = "Por favor, descreva o prato que vai trazer.";
      } else if (!useCustomDish && !selectedDishId) {
        errs.dish = "Por favor, selecione ou informe um prato.";
      }
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setFormState("submitting");
    try {
      const dishName = attending
        ? useCustomDish
          ? customDish.trim() || null
          : PREDEFINED_DISHES.find((d) => d.id === selectedDishId)?.name ?? null
        : null;

      await api.rsvp.submit({
        name: name.trim(),
        attending: attending ?? false,
        guest_count: guestCount,
        dish_name: dishName,
      });

      setSubmittedName(name.trim());
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  function handleReset() {
    setName("");
    setGuestCount(1);
    setAttending(null);
    setSelectedDishId("");
    setCustomDish("");
    setUseCustomDish(false);
    setErrors({});
    setFormState("idle");
    setSubmittedName("");
  }

  /* ── SUCCESS STATE ── */
  if (formState === "success") {
    return (
      <div
        className="mx-auto max-w-md text-center space-y-6 bg-surface border border-border rounded-2xl p-8 shadow-surface"
        role="alert"
        aria-live="polite"
      >
        <div className="text-6xl" aria-hidden="true">🎉</div>
        <h2 className="text-2xl font-bold text-foreground">
          {attending ? `Tá confirmado, ${submittedName}!` : `Que pena, ${submittedName}!`}
        </h2>
        <p className="text-muted">
          {attending
            ? "Sua presença foi registrada com sucesso. Mal podemos esperar para te ver na festa!"
            : "Sua resposta foi registrada. Esperamos te ver em outro momento!"}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onPress={handleReset}
            variant="outline"
            className="border-accent text-accent hover:bg-accent/10"
          >
            Nova Confirmação
          </Button>
          <Link href="/dishes">
            <Button className="bg-accent text-accent-foreground w-full sm:w-auto">
              Ver Lista de Pratos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-2xl bg-surface border border-border rounded-2xl shadow-surface overflow-hidden"
      aria-label="Formulário de confirmação de presença"
    >
      <div className="p-5 sm:p-7 space-y-7">
        {formState === "error" && (
          <div role="alert" className="bg-danger/10 border border-danger/30 text-danger rounded-xl p-4 text-sm">
            Ocorreu um erro ao salvar. Tente novamente.
          </div>
        )}

        {/* ── Name ── */}
        <div className="space-y-2">
          <label
            htmlFor={`${formId}-name`}
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <FaUserAlt className="text-accent text-xs" aria-hidden="true" />
            Seu Nome <span className="text-danger">*</span>
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
            placeholder="Ex: João da Silva"
            autoComplete="given-name"
            aria-required="true"
            aria-invalid={!!errors.name}
            className={`w-full px-4 py-3 rounded-xl border bg-field text-field-foreground placeholder:text-field-placeholder text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${errors.name ? "border-danger focus:ring-danger" : "border-field-border hover:border-accent/50"}`}
          />
          {errors.name && <p className="text-danger text-sm" role="alert">{errors.name}</p>}
        </div>

        {/* ── Attendance ── */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-foreground">
            Você vai comparecer? <span className="text-danger">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <label className={`relative flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${attending === true ? "border-accent bg-accent/10 text-accent" : "border-border bg-background text-muted hover:border-accent/50 hover:bg-accent/5"}`}>
              <input type="radio" name="attending" value="yes" checked={attending === true} onChange={() => setAttending(true)} className="sr-only" aria-label="Sim, vou comparecer" />
              <MdOutlineCheckCircle className="text-2xl flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold text-sm">Sim, vou! 🎉</span>
            </label>
            <label className={`relative flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${attending === false ? "border-danger bg-danger/10 text-danger" : "border-border bg-background text-muted hover:border-danger/50 hover:bg-danger/5"}`}>
              <input type="radio" name="attending" value="no" checked={attending === false} onChange={() => setAttending(false)} className="sr-only" aria-label="Não poderei comparecer" />
              <MdOutlineCancel className="text-2xl flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold text-sm">Não posso 😢</span>
            </label>
          </div>
        </fieldset>

        {/* ── Guest count (visible after attending chosen) ── */}
        {attending !== null && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FaUsers className="text-accent text-sm" aria-hidden="true" />
              Quantas pessoas você vai levar? <span className="text-danger">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuestCount((v) => Math.max(1, v - 1))}
                aria-label="Diminuir"
                className="w-11 h-11 rounded-xl border border-border bg-background text-foreground text-xl font-bold transition hover:border-accent/60 hover:bg-accent/5 active:scale-95 flex items-center justify-center"
              >
                −
              </button>
              <span className="w-12 text-center text-xl font-bold text-foreground tabular-nums">
                {guestCount}
              </span>
              <button
                type="button"
                onClick={() => setGuestCount((v) => Math.min(20, v + 1))}
                aria-label="Aumentar"
                className="w-11 h-11 rounded-xl border border-border bg-background text-foreground text-xl font-bold transition hover:border-accent/60 hover:bg-accent/5 active:scale-95 flex items-center justify-center"
              >
                +
              </button>
              <span className="text-sm text-muted ml-1">
                {guestCount === 1 ? "pessoa (só eu)" : `pessoas incluindo você`}
              </span>
            </div>
            {errors.guestCount && <p className="text-danger text-sm" role="alert">{errors.guestCount}</p>}
          </div>
        )}

        {/* ── Dish (only when attending) ── */}
        {attending === true && (
          <div className="space-y-4 border-t border-border pt-6">
            <div className="flex items-center gap-2">
              <GiMeal className="text-accent text-xl" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-foreground">
                Qual prato você vai trazer? <span className="text-danger">*</span>
              </h3>
            </div>

            {/* Toggle */}
            <div className="flex gap-2 p-1 bg-background rounded-xl border border-border">
              <button
                type="button"
                onClick={() => { setUseCustomDish(false); setErrors((p) => ({ ...p, dish: undefined })); }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${!useCustomDish ? "bg-accent text-accent-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
                aria-pressed={!useCustomDish}
              >
                🍽️ Escolher da lista
              </button>
              <button
                type="button"
                onClick={() => { setUseCustomDish(true); setErrors((p) => ({ ...p, dish: undefined })); }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${useCustomDish ? "bg-accent text-accent-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
                aria-pressed={useCustomDish}
              >
                ✏️ Outro prato
              </button>
            </div>

            {/* Predefined — Tabs por categoria */}
            {!useCustomDish && (
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
                      {PREDEFINED_DISHES.filter((d) => d.category === cat).map((dish) => (
                        <label
                          key={dish.id}
                          className={`flex items-center gap-2 px-3 py-3 rounded-xl border cursor-pointer text-sm font-medium transition-all duration-150 ${selectedDishId === dish.id ? "border-accent bg-accent/10 text-accent" : "border-border bg-background text-foreground hover:border-accent/40 hover:bg-accent/5"}`}
                        >
                          <input
                            type="radio"
                            name="dish"
                            value={dish.id}
                            checked={selectedDishId === dish.id}
                            onChange={() => { setSelectedDishId(dish.id); setErrors((p) => ({ ...p, dish: undefined })); }}
                            className="sr-only"
                            aria-label={dish.name}
                          />
                          <span className="text-lg" aria-hidden="true">{dish.emoji}</span>
                          <span className="leading-tight">{dish.name}</span>
                          {selectedDishId === dish.id && (
                            <MdOutlineCheckCircle className="ml-auto text-accent flex-shrink-0" aria-hidden="true" />
                          )}
                        </label>
                      ))}
                    </div>
                  </Tabs.Panel>
                ))}
              </Tabs>
            )}

            {/* Custom dish */}
            {useCustomDish && (
              <div className="space-y-2">
                <label htmlFor={`${formId}-custom-dish`} className="text-sm font-medium text-foreground">
                  Descreva o prato que vai trazer
                </label>
                <input
                  id={`${formId}-custom-dish`}
                  type="text"
                  value={customDish}
                  onChange={(e) => { setCustomDish(e.target.value); if (errors.dish) setErrors((p) => ({ ...p, dish: undefined })); }}
                  placeholder="Ex: Bolo de mandioca da vovó"
                  aria-required="true"
                  aria-invalid={!!errors.dish}
                  className={`w-full px-4 py-3 rounded-xl border bg-field text-field-foreground placeholder:text-field-placeholder text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${errors.dish ? "border-danger focus:ring-danger" : "border-field-border hover:border-accent/50"}`}
                />
              </div>
            )}

            {errors.dish && (
              <p className="text-danger text-sm" role="alert">{errors.dish}</p>
            )}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="bg-background border-t border-border px-5 sm:px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted"><span className="text-danger">*</span> Campos obrigatórios</p>
        <Button
          type="submit"
          isDisabled={formState === "submitting" || attending === null}
          isPending={formState === "submitting"}
          size="lg"
          className="bg-accent text-accent-foreground font-bold px-8 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formState === "submitting" ? "Enviando..." : "Confirmar Presença 🎊"}
        </Button>
      </div>
    </form>
  );
}
