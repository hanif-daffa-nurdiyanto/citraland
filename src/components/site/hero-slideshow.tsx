"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroSlideshow({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % images.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [images.length]);
  return (
    <div className="hero-slideshow" aria-hidden="true">
      {images.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt={alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={index === active ? "active" : ""}
        />
      ))}
    </div>
  );
}
