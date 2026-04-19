"use client";

import { Milho, Fogueira, Balao, Chapeu } from "./svgs";

interface Photo {
  title: string;
  bg: string;
  icon: "milho" | "fogueira" | "balao" | "chapeu";
}

const PHOTOS: Photo[] = [
  { title: "Fogueira acesa", bg: "from-[#F76707] to-[#C92A2A]", icon: "fogueira" },
  { title: "Milho cozido", bg: "from-[#FFD43B] to-[#F1B90F]", icon: "milho" },
  { title: "Balões no céu", bg: "from-[#364FC7] to-[#1E2E7A]", icon: "balao" },
  { title: "Chapéu de palha", bg: "from-[#B5763A] to-[#8B5A2B]", icon: "chapeu" },
  { title: "Dança na quadrilha", bg: "from-[#2B8A3E] to-[#1E6B2E]", icon: "milho" },
  { title: "Mesa farta", bg: "from-[#FFD43B] to-[#F76707]", icon: "chapeu" },
  { title: "Fogos no ar", bg: "from-[#C92A2A] to-[#4A0A00]", icon: "balao" },
  { title: "Família reunida", bg: "from-[#FFF3BF] to-[#FFD43B]", icon: "fogueira" },
];

function PhotoTile({ photo }: { photo: Photo }) {
  return (
    <div
      className={`
        relative flex-shrink-0 w-56 h-72 sm:w-64 sm:h-80 rounded-3xl overflow-hidden
        bg-gradient-to-br ${photo.bg}
        shadow-overlay border border-white/15 lift
      `}
      aria-label={photo.title}
      role="img"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {photo.icon === "milho" && <Milho size={120} />}
        {photo.icon === "fogueira" && <Fogueira size={140} />}
        {photo.icon === "balao" && <Balao size={140} />}
        {photo.icon === "chapeu" && <Chapeu size={140} />}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/65 to-transparent">
        <p className="text-white font-hand text-xl">{photo.title}</p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const doubled = [...PHOTOS, ...PHOTOS];

  return (
    <section
      id="galeria"
      aria-label="Galeria de lembranças"
      className="bg-earth text-earth-foreground py-16 sm:py-20 overflow-hidden"
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
          {doubled.map((photo, i) => (
            <PhotoTile key={`${photo.title}-${i}`} photo={photo} />
          ))}
        </div>
      </div>

      <div className="relative group mt-6">
        <div className="flex gap-4 sm:gap-6 w-max anim-marquee-rev hover:[animation-play-state:paused]">
          {doubled.map((photo, i) => (
            <PhotoTile key={`rev-${photo.title}-${i}`} photo={photo} />
          ))}
        </div>
      </div>
    </section>
  );
}
