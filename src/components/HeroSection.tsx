"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroAnimationProps {
  heroData: {
    title: string;
    middleText: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
  };
}

/**
 * HeroSection — Client-side animation wrapper
 * 
 * Cinematic entrance timeline:
 * 1. Hero image scales from 1.15 → 1
 * 2. Title reveals word by word from below
 * 3. Decorative lines draw in
 * 4. Subtitle text fades up
 * 5. Bottom quote appears with delay
 * 
 * On scroll: slow parallax movement on the hero image
 */
export default function HeroSection({ heroData }: HeroAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const middleTextRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const subtitleCharsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.2,
        defaults: { ease: "power4.out" },
        onComplete: () => {
          // Restore plain text to elements to prevent layout/flickering issues during hover animations
          if (titleRef.current) {
            titleRef.current.innerHTML = heroData.title;
          }
          if (subtitleRef.current) {
            subtitleRef.current.innerHTML = heroData.subtitle;
          }
        }
      });

      // Hero image: scale down from 1.15
      if (imageRef.current) {
        gsap.set(imageRef.current, { scale: 1.15 });
        tl.to(
          imageRef.current,
          {
            scale: 1,
            duration: 2.5,
            ease: "expo.out",
          },
          0
        );
      }

      // Overlay fade — green overlay lightens slightly during reveal
      if (overlayRef.current) {
        tl.fromTo(
          overlayRef.current,
          { opacity: 0.7 },
          { opacity: 0.5, duration: 2, ease: "power2.out" },
          0
        );
      }

      // Title: split into chars and reveal
      if (titleRef.current) {
        const text = titleRef.current.textContent || "";
        titleRef.current.innerHTML = "";

        const chars = text.split("").map((char) => {
          const wrapper = document.createElement("span");
          wrapper.style.display = "inline-block";
          wrapper.style.overflow = "hidden";
          wrapper.style.verticalAlign = "bottom";

          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.style.willChange = "transform";
          inner.textContent = char === " " ? "\u00A0" : char;
          wrapper.appendChild(inner);
          titleRef.current!.appendChild(wrapper);
          return inner;
        });

        tl.from(
          chars,
          {
            yPercent: 120,
            duration: 1.4,
            stagger: 0.03,
            ease: "power4.out",
          },
          0.3
        );
      }

      // Lines draw in
      if (topLineRef.current) {
        gsap.set(topLineRef.current, { scaleX: 0, transformOrigin: "center" });
        tl.to(
          topLineRef.current,
          { scaleX: 1, duration: 1.2, ease: "expo.out" },
          1.0
        );
      }

      if (bottomLineRef.current) {
        gsap.set(bottomLineRef.current, {
          scaleX: 0,
          transformOrigin: "center",
        });
        tl.to(
          bottomLineRef.current,
          { scaleX: 1, duration: 1.2, ease: "expo.out" },
          1.1
        );
      }

      // Middle text
      if (middleTextRef.current) {
        tl.from(
          middleTextRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power3.out",
          },
          1.2
        );
      }

      // Subtitle: character reveal
      if (subtitleRef.current) {
        const text = subtitleRef.current.textContent || "";
        subtitleRef.current.innerHTML = "";

        const chars = text.split("").map((char) => {
          const wrapper = document.createElement("span");
          wrapper.style.display = "inline-block";
          wrapper.style.overflow = "hidden";
          wrapper.style.verticalAlign = "bottom";

          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.style.willChange = "transform";
          inner.textContent = char === " " ? "\u00A0" : char;
          wrapper.appendChild(inner);
          subtitleRef.current!.appendChild(wrapper);
          return inner;
        });

        // Store chars for hover effect
        subtitleCharsRef.current = chars;

        tl.from(
          chars,
          {
            yPercent: 120,
            duration: 1.4,
            stagger: 0.02,
            ease: "power4.out",
          },
          1.4
        );
      }

      // Hover: BRAND letter-spacing expansion (restoring the original luxury effect)
      if (cardRef.current && subtitleRef.current) {
        const card = cardRef.current;
        const subtitle = subtitleRef.current;

        const handleMouseEnter = () => {
          gsap.to(subtitle, {
            letterSpacing: "0.29em",
            duration: 1.5,
            ease: "power3.out",
          });
          // Also show the quote on hover
          if (quoteRef.current) {
            gsap.to(quoteRef.current, {
              opacity: 1,
              duration: 1,
              ease: "power3.out",
            });
          }
        };

        const handleMouseLeave = () => {
          gsap.to(subtitle, {
            letterSpacing: "0em",
            duration: 1.5,
            ease: "power3.out",
          });
          if (quoteRef.current) {
            gsap.to(quoteRef.current, {
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          }
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);

        // Set initial state — quote hidden until hover
        gsap.set(quoteRef.current, { opacity: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen pt-16 sm:pt-20 md:pt-24 pb-2 sm:pb-4 md:pb-6 lg:pb-8 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Framed Hero Card */}
      <main ref={cardRef} className="group relative flex-1 w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] h-full overflow-hidden rounded-2xl bg-[#2b2a22] isolate transform translate-z-0">
        {/* Background Image with Olive/Dark Overlay */}
        <div className="absolute inset-0 select-none overflow-hidden">
          <img
            ref={imageRef}
            src={heroData.backgroundImage}
            alt="Spaces that speak for the brand"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Green Overlay Filter */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-[#7C8C70]/50 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-[#7C8C70]/20" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 select-none">
          <div className="flex flex-col items-center text-center">
            {/* SPACES */}
            <h1
              ref={titleRef}
              className="font-ivymode font-normal text-[4.5rem] sm:text-[6.5rem] md:text-[8rem] lg:text-[9.5rem] xl:text-[11rem] tracking-normal leading-[0.9] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              style={{ fontKerning: "none" }}
            >
              {heroData.title}
            </h1>

            {/* Enclosed THAT SPEAK FOR THE */}
            <div className="flex flex-col items-center my-2 md:my-4 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] xl:w-[320px]">
              {/* Top Line */}
              <div
                ref={topLineRef}
                className="w-full h-[1px] bg-white/50"
              />

              {/* Text */}
              <span
                ref={middleTextRef}
                className="font-ivymode text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-[0.1em] text-white/95 uppercase my-1 sm:my-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] whitespace-nowrap"
              >
                {heroData.middleText}
              </span>

              {/* Bottom Line */}
              <div
                ref={bottomLineRef}
                className="w-full h-[1px] bg-white/50"
              />
            </div>

            {/* BRAND */}
            <h2
              ref={subtitleRef}
              className="font-ivymode font-normal text-[4rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[9rem] xl:text-[10.5rem] tracking-tight leading-[0.9] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              style={{ fontKerning: "none" }}
            >
              {heroData.subtitle}
            </h2>
          </div>
        </div>

        <div
          ref={quoteRef}
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 z-10 max-w-[180px] sm:max-w-[240px] md:max-w-[320px] text-right select-none opacity-0"
        >
          <p className="font-ivymode italic text-xs sm:text-sm md:text-base text-white/90 leading-relaxed tracking-wide font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {heroData.description}
          </p>
        </div>
      </main>
    </div>
  );
}
