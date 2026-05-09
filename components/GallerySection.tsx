import React from "react";
import Image from "next/image";

export default function GallerySection() {
  const images = [
    "https://picsum.photos/id/237/400/600",
    "https://picsum.photos/id/238/400/600",
    "https://picsum.photos/id/239/400/600",
    "https://picsum.photos/id/240/400/600",
    "https://picsum.photos/id/241/400/600",
    "https://picsum.photos/id/242/400/600",
  ];

  return (
    <section className="py-20 px-4 space-y-12 bg-background">
      <div className="text-center space-y-6">
        <h2 className="text-xl tracking-[0.2em] text-accent uppercase font-medium">Gallery</h2>
        <div className="w-8 h-[1px] bg-accent/30 mx-auto"></div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {images.map((src, index) => (
          <div key={index} className="aspect-[2/3] relative overflow-hidden bg-secondary/50 rounded-sm">
            <Image
              src={src}
              alt={`Wedding Gallery ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 500px) 50vw, 250px"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
