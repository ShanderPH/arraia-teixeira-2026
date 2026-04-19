"use client";

import { useState, useId } from "react";
import { Button } from "@heroui/react";
import { MdOutlineCheckCircle, MdOutlineCancel } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import Link from "next/link";
import { PREDEFINED_DISHES, CATEGORIES, CATEGORY_EMOJI } from "@/lib/dishes";
import { api } from "@/lib/api";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  name?: string;
  dish?: string;
}

export default function RSVPForm() {
  const formId = useId();

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string>("");
  const [customDish, setCustomDish] = useState("");
  const [useCustomDish, setUseCustomDish] = useState(false);

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
          {attending
            ? `Tá confirmado, ${submittedName}!`
            : `Que pena, ${submittedName}!`}
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
      <div className="p-6 sm:p-8 space-y-8">
        {/* Error banner */}
        {formState === "error" && (
          <div
            role="alert"
            className="bg-danger/10 border border-danger/30 text-danger rounded-xl p-4 text-sm"
          >
            Ocorreu um erro ao salvar. Tente novamente.
          </div>
        )}

        {/* ── Name field ── */}
        <div className="space-y-2">
          <label
            htmlFor={`${formId}-name`}
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <FaUserAlt className="text-accent text-xs" aria-hidden="true" />
            Seu Nome <span className="text-danger" aria-label="obrigatório">*</span>
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Ex: João da Silva"
            autoComplete="given-name"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            className={`
              w-full px-4 py-3 rounded-xl border
              bg-field text-field-foreground
              placeholder:text-field-placeholder
              text-base
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
              ${errors.name
                ? "border-danger focus:ring-danger"
                : "border-field-border hover:border-accent/50"
              }
            `}
          />
          {errors.name && (
            <p id={`${formId}-name-error`} className="text-danger text-sm" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* ── Attendance ── */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-foreground">
            Você vai comparecer?{" "}
            <span className="text-danger" aria-label="obrigatório">*</span>
          </legend>

          <div className="grid grid-cols-2 gap-4" role="radiogroup">
            {/* YES */}
            <label
              className={`
                relative flex items-center justify-center gap-3
                px-4 py-4 rounded-xl border-2 cursor-pointer
                transition-all duration-150
                ${attending === true
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-background text-muted hover:border-accent/50 hover:bg-accent/5"
                }
              `}
            >
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={attending === true}
                onChange={() => setAttending(true)}
                className="sr-only"
                aria-label="Sim, vou comparecer"
              />
              <MdOutlineCheckCircle className="text-2xl flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold text-sm">Sim, vou! 🎉</span>
            </label>

            {/* NO */}
            <label
              className={`
                relative flex items-center justify-center gap-3
                px-4 py-4 rounded-xl border-2 cursor-pointer
                transition-all duration-150
                ${attending === false
                  ? "border-danger bg-danger/10 text-danger"
                  : "border-border bg-background text-muted hover:border-danger/50 hover:bg-danger/5"
                }
              `}
            >
              <input
                type="radio"
                name="attending"
                value="no"
                checked={attending === false}
                onChange={() => setAttending(false)}
                className="sr-only"
                aria-label="Não poderei comparecer"
              />
              <MdOutlineCancel className="text-2xl flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold text-sm">Não posso 😢</span>
            </label>
          </div>
        </fieldset>

        {/* ── Dish section (only when attending) ── */}
        {attending === true && (
          <div className="space-y-4 border-t border-border pt-6">
            <div className="flex items-center gap-2">
              <GiMeal className="text-accent text-xl" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-foreground">
                Qual prato você vai trazer?{" "}
                <span className="text-danger" aria-label="obrigatório">*</span>
              </h3>
            </div>

            {/* Toggle predefined vs custom */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setUseCustomDish(false); setErrors((p) => ({ ...p, dish: undefined })); }}
                className={`
                  flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-all duration-150
                  ${!useCustomDish
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-background text-muted border-border hover:border-accent/50"
                  }
                `}
                aria-pressed={!useCustomDish}
              >
                Escolher da lista
              </button>
              <button
                type="button"
                onClick={() => { setUseCustomDish(true); setErrors((p) => ({ ...p, dish: undefined })); }}
                className={`
                  flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-all duration-150
                  ${useCustomDish
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-background text-muted border-border hover:border-accent/50"
                  }
                `}
                aria-pressed={useCustomDish}
              >
                Sugerir prato próprio
              </button>
            </div>

            {/* Predefined dish selector */}
            {!useCustomDish && (
              <div className="space-y-4">
                {CATEGORIES.filter((cat) =>
                  PREDEFINED_DISHES.some((d) => d.category === cat)
                ).map((category) => (
                  <div key={category}>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
                      {CATEGORY_EMOJI[category]} {category}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PREDEFINED_DISHES.filter((d) => d.category === category).map(
                        (dish) => (
                          <label
                            key={dish.id}
                            className={`
                              flex items-center gap-2 px-3 py-2.5 rounded-xl
                              border cursor-pointer text-sm font-medium
                              transition-all duration-150
                              ${selectedDishId === dish.id
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border bg-background text-foreground hover:border-accent/40 hover:bg-accent/5"
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="dish"
                              value={dish.id}
                              checked={selectedDishId === dish.id}
                              onChange={() => {
                                setSelectedDishId(dish.id);
                                setErrors((p) => ({ ...p, dish: undefined }));
                              }}
                              className="sr-only"
                              aria-label={dish.name}
                            />
                            <span aria-hidden="true">{dish.emoji}</span>
                            {dish.name}
                          </label>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Custom dish input */}
            {useCustomDish && (
              <div className="space-y-2">
                <label
                  htmlFor={`${formId}-custom-dish`}
                  className="text-sm font-medium text-foreground"
                >
                  Descreva o prato que vai trazer
                </label>
                <input
                  id={`${formId}-custom-dish`}
                  type="text"
                  value={customDish}
                  onChange={(e) => {
                    setCustomDish(e.target.value);
                    if (errors.dish) setErrors((p) => ({ ...p, dish: undefined }));
                  }}
                  placeholder="Ex: Bolo de mandioca da vovó"
                  aria-required="true"
                  aria-invalid={!!errors.dish}
                  aria-describedby={errors.dish ? `${formId}-dish-error` : undefined}
                  className={`
                    w-full px-4 py-3 rounded-xl border
                    bg-field text-field-foreground
                    placeholder:text-field-placeholder
                    text-base
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
                    ${errors.dish
                      ? "border-danger focus:ring-danger"
                      : "border-field-border hover:border-accent/50"
                    }
                  `}
                />
              </div>
            )}

            {errors.dish && (
              <p id={`${formId}-dish-error`} className="text-danger text-sm" role="alert">
                {errors.dish}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Footer / Submit ── */}
      <div className="bg-background border-t border-border px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted">
          <span className="text-danger">*</span> Campos obrigatórios
        </p>
        <Button
          type="submit"
          isDisabled={formState === "submitting" || attending === null}
          isPending={formState === "submitting"}
          size="lg"
          className="
            bg-accent text-accent-foreground
            font-bold px-8 rounded-xl
            shadow-md hover:shadow-lg
            hover:scale-[1.02]
            transition-all duration-200
            w-full sm:w-auto
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {formState === "submitting" ? "Enviando..." : "Confirmar Presença 🎊"}
        </Button>
      </div>
    </form>
  );
}
