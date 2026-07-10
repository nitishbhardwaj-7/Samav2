"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "./TransitionLink";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection({ data, hideKnowMore = false }: { data?: { sectionName: string; title: string; description: string; image: string }, hideKnowMore?: boolean }) {
  const sectionName = data?.sectionName || "about us";
  const title = data?.title || "SAMA";
  const description = data?.description || "SAMA Production is a multidisciplinary design and build studio known for crafting refined, high-impact environments across interiors, exhibitions, and brand activations. Defined by precision, material sophistication, and architectural clarity, each project is meticulously executed to embody brand identity at the highest level.";
  const image = data?.image || "https://samaproductionme.com/wp-content/uploads/2026/06/Frame-139.png";

  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power4.out" },
      });

      // Label rotated text
      if (labelRef.current) {
        tl.from(labelRef.current, {
          opacity: 0,
          x: -20,
          duration: 1,
        }, 0);
      }

      // Heading: character by character reveal
      if (headingRef.current) {
        const chars = headingRef.current.querySelectorAll('.about-char');
        tl.from(chars, {
          yPercent: 120,
          duration: 1.4,
          stagger: 0.05,
          ease: "power4.out",
        }, 0.1);
      }

      // Vertical divider line draws
      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });
        tl.to(lineRef.current, {
          scaleY: 1,
          duration: 1.2,
          ease: "expo.out",
        }, 0.6);
      }

      // Description fade up
      if (descRef.current) {
        tl.from(descRef.current, {
          y: 40,
          opacity: 0,
          duration: 1.2,
        }, 0.8);
      }

      // Button fade up
      if (btnRef.current) {
        tl.from(btnRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
        }, 1.0);
      }

      // Image: curtain reveal with scale
      if (imageWrapRef.current) {
        gsap.set(imageWrapRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
        });

        tl.to(imageWrapRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.out",
        }, 0.4);
      }

      if (imageRef.current) {
        tl.from(imageRef.current, {
          scale: 1.3,
          duration: 2,
          ease: "power3.out",
        }, 0.4);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-screen p-6 sm:p-10 md:p-14 lg:p-16 flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #778065 0%, #496449 100%)' }}
    >
      <div className="w-full max-w-[92%] sm:max-w-[90%] md:max-w-[60%] mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 py-12">
        
        {/* Left Content Side */}
        <div className="w-full sm:w-[54%] flex flex-col items-start relative z-10">
          
          {/* Rotated Vertical Label */}
          <div className="h-28 sm:h-36 flex items-end justify-start select-none mb-6 relative pl-[1px]">
            <span ref={labelRef} className="font-ivymode text-xs sm:text-sm tracking-[0.35em] text-[#E5D9C4]/70 uppercase rotate-[-90deg] origin-bottom-left translate-x-[4px] -translate-y-[10px] whitespace-nowrap block">
              {sectionName}
            </span>
          </div>

          {/* SAMA Heading - overlaps the right image with z-20 */}
          <h2 ref={headingRef} className="font-ivymode font-normal text-[5.5rem] sm:text-[7.5rem] md:text-[9rem] lg:text-[10.5rem] xl:text-[12.5rem] text-[#E5D9C4] leading-[0.8] select-none z-20 whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)] mb-6 sm:mb-8">
            {title.split("").map((char, i) => (
              <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
                <span className="about-char" style={{ display: "inline-block", willChange: "transform" }}>
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </h2>

          {/* Left Vertical Divider Line */}
          <div ref={lineRef} className="w-[1px] h-20 sm:h-28 bg-white/20 mb-8 sm:mb-10 ml-2" />

          {/* Paragraph block */}
          <p ref={descRef} className="font-ivymode text-sm sm:text-base text-[#F3F3F3] leading-relaxed tracking-wide max-w-md sm:max-w-lg mb-8 sm:mb-10">
            {description}
          </p>

          {/* Know More Button */}
          {!hideKnowMore && (
            <div ref={btnRef}>
              <TransitionLink 
                href="/about-us"
                className="group/btn inline-flex items-center gap-3 border border-[#E5D9C4]/40 hover:border-white px-6 py-2.5 rounded-full font-ivymode text-xs sm:text-sm text-[#E5D9C4] hover:text-white uppercase tracking-widest transition-all duration-300 bg-transparent hover:bg-white/5 no-underline"
              >
                <span>Know More</span>
                <span className="inline-flex items-center justify-center border border-[#E5D9C4]/40 group-hover/btn:border-white rounded-full w-5 h-5 transition-all duration-300">
                  <svg 
                    width="8" 
                    height="8" 
                    viewBox="0 0 8 8" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300"
                  >
                    <path 
                      d="M1 7L7 1M7 1H2.5M7 1V5.5" 
                      stroke="currentColor" 
                      strokeWidth="1.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </TransitionLink>
            </div>
          )}
          
        </div>

        {/* Right Image Side */}
        <div className="w-full sm:w-[50%] flex justify-center z-0 relative">
          <div ref={imageWrapRef} className="relative w-full aspect-[2/3] sm:aspect-[2/3] max-w-sm sm:max-w-none overflow-hidden rounded-[2.5rem] sm:rounded-[4.5rem] bg-[#2b2a22] isolate transform translate-z-0">
            <div ref={imageRef} className="absolute inset-0">
              <Image
                src={image}
                alt="SAMA Production Design Concept"
                fill
                priority
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
