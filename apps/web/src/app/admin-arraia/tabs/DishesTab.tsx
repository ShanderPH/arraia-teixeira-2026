"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MdAddPhotoAlternate, MdClose } from "react-icons/md";
import { api, type DishResponse } from "@/lib/api";
import { CATEGORY_EMOJI, type DishCategory } from "@/lib/dishes";
import CropModal from "./CropModal";

interface CropState {
  dishId: string;
  imageSrc: string;
  fileName: string;
}

export default function DishesTab() {
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [cropState, setCropState] = useState<CropState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setDishes(await api.dishes.list()); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handlePhotoClick(dishId: string) {
    // Store which dish we're targeting, then open picker
    fileInputRef.current?.setAttribute("data-dish-id", dishId);
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const dishId = fileInputRef.current?.getAttribute("data-dish-id");
    if (!file || !dishId) return;
    // Open crop modal instead of uploading directly
    const imageSrc = URL.createObjectURL(file);
    setCropState({ dishId, imageSrc, fileName: file.name });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleCropConfirm(croppedFile: File) {
    if (!cropState) return;
    const { dishId, imageSrc: originalSrc } = cropState;
    setCropState(null);
    URL.revokeObjectURL(originalSrc);
    setUploading(dishId);
    // Create preview from the cropped file before uploading
    const previewUrl = URL.createObjectURL(croppedFile);
    try {
      const updated = await api.dishes.uploadPhoto(dishId, croppedFile);
      // Keep local blob URL as preview to avoid Supabase cache issues
      setDishes((prev) =>
        prev.map((d) => (d.id === dishId ? { ...updated, photo_url: previewUrl } : d))
      );
    } catch (err) {
      URL.revokeObjectURL(previewUrl);
      throw err;
    } finally {
      setUploading(null);
    }
  }

  function handleCropCancel() {
    if (cropState) URL.revokeObjectURL(cropState.imageSrc);
    setCropState(null);
  }

  async function handleDeletePhoto(dishId: string) {
    setUploading(dishId);
    try {
      const updated = await api.dishes.deletePhoto(dishId);
      setDishes((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } finally { setUploading(null); }
  }

  const byCategory = dishes.reduce<Record<string, DishResponse[]>>((acc, d) => {
    (acc[d.category] ??= []).push(d);
    return acc;
  }, {});

  if (loading) return <LoadingRows />;

  return (
    <>
      {cropState && (
        <CropModal
          imageSrc={cropState.imageSrc}
          fileName={cropState.fileName}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
      <div className="space-y-8">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} aria-hidden="true" />

      {Object.entries(byCategory).map(([cat, list]) => (
        <section key={cat}>
          <h2 className="flex items-center gap-2 text-sm font-bold text-muted uppercase tracking-widest mb-3">
            <span aria-hidden="true">{CATEGORY_EMOJI[cat as DishCategory] ?? "🍽️"}</span>
            {cat}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {list.map((dish) => (
              <div
                key={dish.id}
                className="flex items-center gap-3 bg-surface border border-border rounded-xl p-3"
              >
                {/* Photo thumbnail */}
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-default flex-shrink-0 flex items-center justify-center">
                  {dish.photo_url ? (
                    <>
                      <img src={dish.photo_url} alt={dish.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeletePhoto(dish.id)}
                        disabled={uploading === dish.id}
                        aria-label={`Remover foto de ${dish.name}`}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition text-white"
                      >
                        <MdClose className="text-lg" />
                      </button>
                    </>
                  ) : (
                    <span className="text-2xl" aria-hidden="true">{dish.emoji}</span>
                  )}
                  {uploading === dish.id && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{dish.name}</p>
                  <p className="text-xs text-muted">{dish.guest_count} pessoa{dish.guest_count !== 1 ? "s" : ""} escolheram</p>
                </div>

                <button
                  onClick={() => handlePhotoClick(dish.id)}
                  disabled={uploading === dish.id}
                  aria-label={`${dish.photo_url ? "Trocar" : "Adicionar"} foto de ${dish.name}`}
                  className="p-2 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition disabled:opacity-40"
                >
                  <MdAddPhotoAlternate className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

        {dishes.length === 0 && (
          <p className="text-center text-muted py-12">Nenhum prato encontrado.</p>
        )}
      </div>
    </>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Carregando pratos">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-default animate-pulse" />
      ))}
    </div>
  );
}
