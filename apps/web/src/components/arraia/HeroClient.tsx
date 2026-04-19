"use client";

import { useState } from "react";
import Hero from "./Hero";
import RSVPModal from "./RSVPModal";

interface HeroClientProps {
  availableDishes: string[];
}

export default function HeroClient({ availableDishes }: HeroClientProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Hero onRsvp={() => setOpen(true)} />
      <RSVPModal
        open={open}
        onClose={() => setOpen(false)}
        availableDishes={availableDishes}
      />
    </>
  );
}
