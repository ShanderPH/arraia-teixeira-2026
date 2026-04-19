"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { MdClose, MdOutlineCheckCircle, MdOutlineCancel } from "react-icons/md";
import { useRouter } from "next/navigation";
import { submitRsvp } from "@/lib/data";

interface RSVPModalProps {
  open: boolean;
  onClose: () => void;
  preselectedDish?: string | null;
  availableDishes?: string[];
}

export default function RSVPModal({
  open,
  onClose,
  preselectedDish = null,
  availableDishes = [],
}: RSVPModalProps) {
  const router = useRouter();
  const formId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean>(true);
  const [dish, setDish] = useState(preselectedDish ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset dish when opening for a new preselected value — during-render pattern.
  const [prevKey, setPrevKey] = useState(`${open}-${preselectedDish ?? ""}`);
  const currentKey = `${open}-${preselectedDish ?? ""}`;
  if (prevKey !== currentKey) {
    setPrevKey(currentKey);
    setDish(preselectedDish ?? "");
  }

  // Focus trap + Esc close
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    firstFieldRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Por favor, informe seu nome.");
      return;
    }
    setStatus("saving");
    setErrorMessage(null);
    try {
      await submitRsvp({
        name: name.trim(),
        attending,
        dish_name: attending ? (dish.trim() || null) : null,
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
    setAttending(true);
    setDish(preselectedDish ?? "");
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
        className="
          relative w-full sm:max-w-lg
          bg-surface text-foreground
          rounded-t-3xl sm:rounded-3xl
          shadow-overlay border border-border
          max-h-[95vh] overflow-y-auto
        "
      >
        {/* Drag handle on mobile */}
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
          <h2
            id={`${formId}-title`}
            className="font-display text-2xl sm:text-3xl text-accent"
          >
            Confirmar presença
          </h2>
          <p className="text-sm text-muted mt-1">
            Preencha e venha curtir a festa com a gente!
          </p>
        </div>

        {status === "success" ? (
          <div className="px-5 sm:px-7 py-6 space-y-4 text-center">
            <div className="text-5xl" aria-hidden="true">🎉</div>
            <h3 className="font-bold text-lg">
              {attending ? "Tá confirmado!" : "Resposta registrada!"}
            </h3>
            <p className="text-sm text-muted">
              {attending
                ? "Mal podemos esperar para te ver na festa."
                : "Esperamos te ver em outro momento!"}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button
                type="button"
                onPress={reset}
                className="bg-default text-foreground"
              >
                Nova confirmação
              </Button>
              <Button
                type="button"
                onPress={onClose}
                className="bg-accent text-accent-foreground font-bold"
              >
                Fechar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 sm:px-7 pb-6 space-y-5">
            {errorMessage && (
              <p
                role="alert"
                className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-3 py-2"
              >
                {errorMessage}
              </p>
            )}

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
                required
                className="w-full px-4 py-3 rounded-xl border border-field-border bg-field text-field-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold">Você vai comparecer?</legend>
              <div className="grid grid-cols-2 gap-3" role="radiogroup">
                <label
                  className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 cursor-pointer transition ${
                    attending
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-background text-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    checked={attending}
                    onChange={() => setAttending(true)}
                    className="sr-only"
                  />
                  <MdOutlineCheckCircle className="text-xl" aria-hidden="true" />
                  Sim, vou!
                </label>
                <label
                  className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 cursor-pointer transition ${
                    !attending
                      ? "border-danger bg-danger/10 text-danger"
                      : "border-border bg-background text-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    checked={!attending}
                    onChange={() => setAttending(false)}
                    className="sr-only"
                  />
                  <MdOutlineCancel className="text-xl" aria-hidden="true" />
                  Não posso
                </label>
              </div>
            </fieldset>

            {attending && (
              <div className="space-y-1.5">
                <label htmlFor={`${formId}-dish`} className="text-sm font-semibold">
                  Prato que vai trazer
                </label>
                <input
                  id={`${formId}-dish`}
                  type="text"
                  list={`${formId}-dish-list`}
                  value={dish}
                  onChange={(e) => setDish(e.target.value)}
                  placeholder="Ex: Canjica da vovó"
                  className="w-full px-4 py-3 rounded-xl border border-field-border bg-field text-field-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {availableDishes.length > 0 && (
                  <datalist id={`${formId}-dish-list`}>
                    {availableDishes.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                )}
                <p className="text-xs text-muted">
                  Deixe em branco se ainda não decidiu.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <Button
                type="button"
                onPress={onClose}
                className="bg-default text-foreground order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isPending={status === "saving"}
                isDisabled={status === "saving"}
                className="bg-accent text-accent-foreground font-bold order-1 sm:order-2"
              >
                {status === "saving" ? "Enviando..." : "Confirmar presença 🎊"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
