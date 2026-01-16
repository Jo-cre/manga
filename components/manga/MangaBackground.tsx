"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MangaBackground({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-screen w-full overflow-hidden">
      <div
        className="relative h-screen w-full transition-transform duration-75 ease-out"
        style={{ transform: `translateY(-${scrollY * 0.2}px)` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className="object-cover object-top brightness-50"
        />
      </div>
    </div>
  );
}
