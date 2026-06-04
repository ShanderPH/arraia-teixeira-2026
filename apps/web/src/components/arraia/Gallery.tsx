"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MdAddPhotoAlternate, MdPhoto } from "react-icons/md";
import { api, type GalleryPhotoResponse } from "@/lib/api";

function RealPhotoTile({ photo }: { photo: GalleryPhotoResponse }) {
  return (
    <div
      className="relative flex-shrink-0 w-56 h-72 sm:w-64 sm:h-80 rounded-3xl overflow-hidden shadow-overlay border border-white/15 lift"
      aria-label={photo.title ?? "Foto da festa"}
      role="img"
    >
      <img src={photo.photo_url} alt={photo.title ?? "Foto da festa"} className="w-full h-full object-cover" />
      {photo.title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/65 to-transparent">
          <p className="text-white font-hand text-xl">{photo.title}</p>
        </div>
      )}
    </div>
  );
}

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhotoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPhotos((await api.gallery.list()) as GalleryPhotoResponse[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const photo = await api.gallery.upload(file.name.replace(/\.[^.]+$/, ""), file);
        setPhotos((prev) => [...prev, photo]);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const hasPhotos = photos.length > 0;
  const doubled = [...photos, ...photos];

  return (
    <section
      id="galeria"
      aria-label="Galeria de lembranças"
      className="bg-navy text-white py-16 sm:py-20 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-10">
        <h2 className="font-display text-4xl sm:text-5xl text-corn uppercase">
          Lembranças da Arraia
        </h2>
        <p className="font-hand text-2xl text-white/80">
          Compartilhe suas fotos e ajude a guardar cada lembrança dessa noite especial.
        </p>

        <div className="pt-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-corn text-[#1a0a00] font-bold hover:brightness-95 transition active:scale-[0.98] disabled:opacity-60"
          >
            {uploading ? (
              <span className="w-4 h-4 border-2 border-[#1a0a00] border-t-transparent rounded-full animate-spin" />
            ) : (
              <MdAddPhotoAlternate className="text-xl" aria-hidden="true" />
            )}
            {uploading ? "Enviando..." : "Adicionar fotos"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            aria-hidden="true"
          />
        </div>
      </div>

      {loading ? (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full aspect-[3/4] rounded-3xl bg-white/10 animate-pulse" />
            ))}
          </div>
        </div>
      ) : !hasPhotos ? (
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-10 text-center text-white/80 space-y-3">
            <MdPhoto className="mx-auto text-5xl opacity-60" aria-hidden="true" />
            <p className="font-hand text-2xl text-corn">Ainda não há fotos por aqui.</p>
            <p className="text-sm">Seja a primeira pessoa a enviar uma lembrança do Arraiá.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative group">
            <div className="flex gap-4 sm:gap-6 w-max anim-marquee hover:[animation-play-state:paused]">
              {doubled.map((photo, i) => (
                <RealPhotoTile key={`${photo.id}-${i}`} photo={photo} />
              ))}
            </div>
          </div>

          <div className="relative group mt-6">
            <div className="flex gap-4 sm:gap-6 w-max anim-marquee-rev hover:[animation-play-state:paused]">
              {doubled.map((photo, i) => (
                <RealPhotoTile key={`rev-${photo.id}-${i}`} photo={photo} />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
