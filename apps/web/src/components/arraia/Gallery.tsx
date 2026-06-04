"use client";

import { useEffect, useState } from "react";
import { Milho, Fogueira, Balao, Chapeu } from "./svgs";
import { api, type GalleryPhotoResponse } from "@/lib/api";

const PLACEHOLDERS = [
  { title: "Fogueira acesa", bg: "from-[#D45D12] to-[#B23A1F]", icon: "fogueira" as const },
  { title: "Milho cozido", bg: "from-[#FEDD00] to-[#E0B400]", icon: "milho" as const },
  { title: "Balões no céu", bg: "from-[#009739] to-[#00702B]", icon: "balao" as const },
  { title: "Chapéu de palha", bg: "from-[#009739] to-[#006B29]", icon: "chapeu" as const },
  { title: "Dança na quadrilha", bg: "from-[#1FB35A] to-[#009739]", icon: "milho" as const },
  { title: "Mesa farta", bg: "from-[#FEDD00] to-[#D45D12]", icon: "chapeu" as const },
  { title: "Fogos no ar", bg: "from-[#D45D12] to-[#0D1B2A]", icon: "balao" as const },
  { title: "Família reunida", bg: "from-[#009739] to-[#FEDD00]", icon: "fogueira" as const },
];

type IconKey = "milho" | "fogueira" | "balao" | "chapeu";

function PlaceholderTile({ title, bg, icon }: { title: string; bg: string; icon: IconKey }) {
  return (
    <div
      className={`relative flex-shrink-0 w-56 h-72 sm:w-64 sm:h-80 rounded-3xl overflow-hidden bg-gradient-to-br ${bg} shadow-overlay border border-white/15 lift`}
      aria-label={title}
      role="img"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {icon === "milho" && <Milho size={120} />}
        {icon === "fogueira" && <Fogueira size={140} />}
        {icon === "balao" && <Balao size={140} />}
        {icon === "chapeu" && <Chapeu size={140} />}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/65 to-transparent">
        <p className="text-white font-hand text-xl">{title}</p>
      </div>
    </div>
  );
}

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

  useEffect(() => {
    api.gallery.list().then(setPhotos).catch(() => {});
  }, []);

  const useReal = photos.length >= 4;
  const tiles = useReal ? photos : PLACEHOLDERS;
  const doubled = [...tiles, ...tiles];

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
          Um pedacinho das festas passadas para esquentar seu coração.
        </p>
      </div>

      <div className="relative group">
        <div className="flex gap-4 sm:gap-6 w-max anim-marquee hover:[animation-play-state:paused]">
          {doubled.map((item, i) =>
            useReal
              ? <RealPhotoTile key={`${(item as GalleryPhotoResponse).id}-${i}`} photo={item as GalleryPhotoResponse} />
              : <PlaceholderTile key={`${(item as typeof PLACEHOLDERS[0]).title}-${i}`} {...(item as typeof PLACEHOLDERS[0])} />
          )}
        </div>
      </div>

      <div className="relative group mt-6">
        <div className="flex gap-4 sm:gap-6 w-max anim-marquee-rev hover:[animation-play-state:paused]">
          {doubled.map((item, i) =>
            useReal
              ? <RealPhotoTile key={`rev-${(item as GalleryPhotoResponse).id}-${i}`} photo={item as GalleryPhotoResponse} />
              : <PlaceholderTile key={`rev-${(item as typeof PLACEHOLDERS[0]).title}-${i}`} {...(item as typeof PLACEHOLDERS[0])} />
          )}
        </div>
      </div>
    </section>
  );
}
