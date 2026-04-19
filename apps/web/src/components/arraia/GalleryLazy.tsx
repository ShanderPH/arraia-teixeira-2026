"use client";

import dynamic from "next/dynamic";

const Gallery = dynamic(() => import("./Gallery"), { ssr: false });

export default function GalleryLazy() {
  return <Gallery />;
}
