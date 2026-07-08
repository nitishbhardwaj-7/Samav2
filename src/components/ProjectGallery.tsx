"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import GalleryScrollButton from "./GalleryScrollButton";

interface ProjectGalleryProps {
  gallery: string[];
  projectTitle: string;
}

export default function ProjectGallery({ gallery, projectTitle }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  // Navigate to next media item
  const nextMedia = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev < gallery.length - 1 ? prev + 1 : 0));
  }, [activeIndex, gallery.length]);

  // Navigate to previous media item
  const prevMedia = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : gallery.length - 1));
  }, [activeIndex, gallery.length]);

  // Keyboard controls
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, closeLightbox, nextMedia, prevMedia]);

  return (
    <>
      {/* COLUMN 3: GALLERY (Vertical CSS Slider without visible scrollbar) */}
      <div 
        data-lenis-prevent
        className="gallery-container flex flex-col gap-6 w-full overflow-y-auto snap-y snap-mandatory relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ aspectRatio: '1 / 1.7' }}
      >
        {gallery.map((mediaUrl, i) => {
          const isVideo = mediaUrl.toLowerCase().endsWith('.mp4') || mediaUrl.toLowerCase().endsWith('.webm');
          
          return (
            <div 
              key={i} 
              onClick={() => setActiveIndex(i)}
              className="relative w-full shrink-0 aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-[#E5D9C4]/10 group snap-start bg-black/10 cursor-zoom-in"
            >
              {isVideo ? (
                <video
                  src={mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <Image
                  src={mediaUrl}
                  alt={`${projectTitle} gallery ${i}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              )}
            </div>
          );
        })}
        
        {/* Scroll indicator overlay pinned to the bottom of the container */}
        {gallery.length > 1 && (
          <GalleryScrollButton />
        )}
      </div>

       {/* LIGHTBOX OVERLAY */}
      {activeIndex !== null && (
        <div 
          data-lenis-prevent
          onClick={closeLightbox}
          className="fixed inset-0 z-[999999] bg-[#12190e]/75 backdrop-blur-xl flex items-center justify-center transition-all duration-300 animate-fadeIn"
        >
          {/* Top panel: Close Button */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-end items-center z-50">
            <button 
              onClick={closeLightbox}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all duration-300 group cursor-pointer"
              aria-label="Close preview"
            >
              <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Left Navigation Arrow */}
          <button
            onClick={prevMedia}
            className="absolute left-4 sm:left-8 w-14 h-14 rounded-full border border-white/10 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all duration-300 z-50 group cursor-pointer"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6 text-white group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Center Content Container */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-[90vw] max-h-[75vh] sm:max-h-[80vh] flex items-center justify-center select-none"
          >
            {(() => {
              const currentMedia = gallery[activeIndex];
              const isVideo = currentMedia.toLowerCase().endsWith('.mp4') || currentMedia.toLowerCase().endsWith('.webm');

              return isVideo ? (
                <video
                  src={currentMedia}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-w-full max-h-[75vh] sm:max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              ) : (
                <img
                  src={currentMedia}
                  alt={`${projectTitle} fullscreen view`}
                  className="max-w-full max-h-[75vh] sm:max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              );
            })()}
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={nextMedia}
            className="absolute right-4 sm:right-8 w-14 h-14 rounded-full border border-white/10 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all duration-300 z-50 group cursor-pointer"
            aria-label="Next image"
          >
            <svg className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Bottom Panel: Counter */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center text-white/70 font-ivymode tracking-widest text-sm z-50 select-none">
            <span className="bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
              {activeIndex + 1} / {gallery.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
