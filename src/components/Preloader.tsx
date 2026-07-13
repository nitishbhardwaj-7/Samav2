"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Luxury Preloader
 * 
 * A cinematic page entrance inspired by high-end architecture portfolios.
 * 
 * Sequence:
 * 1. Solid overlay covers page
 * 2. Logo/brand text elegantly reveals
 * 3. Counter ticks from 0 → 100
 * 4. Overlay splits/reveals page beneath
 * 5. Page content is revealed
 */
export default function Preloader({
  tagline = "Interior Design & Implementation",
  onComplete,
}: {
  tagline?: string;
  onComplete: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    // Lock scrolling on page load while preloader is active
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Counter animation object
      const counter = { value: 0 };

      // Phase 1: Reveal text and tagline
      tl.from(
        textRef.current,
        {
          yPercent: 100,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        },
        0.3
      );

      tl.from(
        taglineRef.current,
        {
          yPercent: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
        },
        0.7
      );

      // Phase 2: Progress line draws
      tl.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 2,
          ease: "power2.inOut",
        },
        0.5
      );

      // Phase 2: Counter ticks
      tl.to(
        counter,
        {
          value: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(
                Math.round(counter.value)
              );
            }
          },
        },
        0.5
      );

      // Phase 3: Text exit
      tl.to(
        [textRef.current, taglineRef.current, counterRef.current?.parentElement, lineRef.current],
        {
          opacity: 0,
          yPercent: -30,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.in",
        },
        2.8
      );

      // Phase 4: Overlay reveals page — clip-path wipe
      tl.to(
        overlayRef.current,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.2,
          ease: "expo.inOut",
        },
        3.2
      );
    });

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#7C8C70]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      {/* Brand Text */}
      <div className="flex flex-col items-center gap-4">
        <div className="overflow-hidden">
          <div
            ref={textRef}
            className="font-ivymode text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#E5D9C4] tracking-wide select-none"
          >
            SAMA
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            ref={taglineRef}
            className="font-ivymode text-sm sm:text-base tracking-[0.3em] text-white/70 uppercase select-none"
          >
            {tagline}
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[200px] sm:w-[280px] flex flex-col items-center gap-4">
        <div
          ref={lineRef}
          className="w-full h-[1px] bg-white/40"
        />
        <div className="font-ivymode text-xs tracking-[0.2em] text-white/50">
          <span ref={counterRef}>0</span>
        </div>
      </div>
    </div>
  );
}
