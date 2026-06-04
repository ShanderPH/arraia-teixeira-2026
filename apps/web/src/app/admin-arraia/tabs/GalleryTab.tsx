"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MdDeleteOutline, MdAddPhotoAlternate, MdPhoto } from "react-icons/md";
import { api, type GalleryPhotoResponse } from "@/lib/api";

export default function GalleryTab() {
  const [photos, setPhotos] = useState<GalleryPhotoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setPhotos((await api.gallery.list()) as GalleryPhotoResponse[]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

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

  async function handleDelete(id: string) {
    if (!confirm("Remover foto da galeria?")) return;
    setDeletingId(id);
    try {
      await api.gallery.delete(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } finally { setDeletingId(null); }
  }

  return (
    <div className="space-y-5">
      {/* Upload button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{photos.length} foto{photos.length !== 1 ? "s" : ""} na galeria</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-bold hover:opacity-90 transition active:scale-[0.98] disabled:opacity-50"
        >
          {uploading ? (
            <span className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <MdAddPhotoAlternate className="text-lg" aria-hidden="true" />
          )}
          Adicionar fotos
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

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-default animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 text-muted space-y-3">
          <MdPhoto className="text-5xl mx-auto opacity-30" aria-hidden="true" />
          <p>Nenhuma foto ainda. Adicione a primeira!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-default">
              <img
                src={photo.photo_url}
                alt={photo.title ?? "Foto da galeria"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  aria-label="Remover foto"
                  className="p-2 rounded-full bg-danger text-white hover:bg-danger/80 transition disabled:opacity-40"
                >
                  {deletingId === photo.id
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin block" />
                    : <MdDeleteOutline className="text-xl" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
