"use client";

import Hero from "./Hero";

interface HeroClientProps {
  availableDishes?: string[];
}

export default function HeroClient({ availableDishes: _ }: HeroClientProps) {
  function handleRsvp() {
    document.getElementById("pratos")?.scrollIntoView({ behavior: "smooth" });
  }

  return <Hero onRsvp={handleRsvp} />;
}
