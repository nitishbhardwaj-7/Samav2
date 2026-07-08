"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ClientLogo {
  src: string;
  alt: string;
}

interface ClientsSectionProps {
  data?: {
    title: string;
    description: string;
    logos: ClientLogo[];
  };
}

export default function ClientsSection({ data }: ClientsSectionProps) {
  const title = data?.title || "Our Clients";
  const description = data?.description || "Our clients include leading global brands who trust us to deliver refined, high-quality environments that elevate their presence and reflect their identity with excellence.";
  const logos = data?.logos || [
    { src: "/uploads/2026/05/image-21-Vectorized-2.png", alt: "Eucerin Logo" },
    { src: "/uploads/2026/05/image-22-Vectorized-2.png", alt: "AMMT Logo" },
    { src: "/uploads/2026/05/image-23-Vectorized-2.png", alt: "Audi Logo" },
    { src: "/uploads/2026/05/image-24-Vectorized-1.png", alt: "Casio Logo" },
    { src: "/uploads/2026/05/Vector.png", alt: "DHL Logo" },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  const getLogoWidth = (src: string) => {
    if (src.includes("image-21-Vectorized-2") || src.includes("Eucerin")) return "w-28 sm:w-32 md:w-36";
    if (src.includes("image-22-Vectorized-2") || src.includes("AMMT")) return "w-16 sm:w-20 md:w-24";
    if (src.includes("image-23-Vectorized-2") || src.includes("Audi")) return "w-24 sm:w-28 md:w-32";
    if (src.includes("image-24-Vectorized-1") || src.includes("Casio")) return "w-28 sm:w-32 md:w-36";
    if (src.includes("Vector.png") || src.includes("DHL")) return "w-28 sm:w-32 md:w-36";
    return "w-24 sm:w-28 md:w-32";
  };

  // Repeat the logos so they span a large screen width without gaps
  const repeatCount = Math.max(4, Math.ceil(15 / logos.length));
  const marqueeLogos = Array(repeatCount).fill(logos).flat();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // Title: word reveal
      if (titleRef.current) {
        const text = titleRef.current.textContent || "";
        titleRef.current.innerHTML = "";

        const words = text.split(/\s+/).map((word, i, arr) => {
          const wrapper = document.createElement("span");
          wrapper.style.display = "inline-block";
          wrapper.style.overflow = "hidden";
          wrapper.style.verticalAlign = "bottom";

          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.style.willChange = "transform";
          inner.textContent = word;
          wrapper.appendChild(inner);
          titleRef.current!.appendChild(wrapper);

          if (i < arr.length - 1) {
            titleRef.current!.appendChild(document.createTextNode("\u00A0"));
          }
          return inner;
        });

        tl.from(words, {
          yPercent: 120,
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
        }, 0);
      }

      // Description
      if (descRef.current) {
        tl.from(descRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        }, 0.3);
      }

      // Marquee reveal
      if (marqueeRef.current) {
        tl.from(marqueeRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        }, 0.5);
      }

      // Button
      if (btnRef.current) {
        tl.from(btnRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        }, 0.8);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [logos.length]);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full py-16 sm:py-24 px-6 sm:px-10 md:px-14 lg:px-16 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #DAC6AE 0%, #FFFFFF 100%)' }}
    >
      <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto flex flex-col items-center justify-center gap-12 md:gap-16 text-center z-10">
        
        {/* Title & Description */}
        <div className="flex flex-col items-center gap-4 max-w-3xl">
          <h2 ref={titleRef} className="font-ivymode font-normal text-3xl sm:text-4xl md:text-5xl text-[#563320] leading-tight select-none">
            {title}
          </h2>
          <p ref={descRef} className="font-ivymode text-xs sm:text-sm md:text-base text-[#563320]/80 leading-relaxed tracking-wide max-w-2xl">
            {description}
          </p>
        </div>

        {/* Logos Marquee (Constrained width) */}
        <div 
          ref={marqueeRef} 
          className="w-full overflow-hidden relative py-4"
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)'
          }}
        >
          
          <div className="flex w-max animate-marquee">
            {/* First Copy */}
            <div className="flex items-center gap-16 sm:gap-20 md:gap-24 lg:gap-28 px-8 sm:px-10 md:px-12">
              {marqueeLogos.map((logo, index) => (
                <div 
                  key={`first-${index}`}
                  className={`relative h-10 sm:h-12 md:h-14 ${getLogoWidth(logo.src)} flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300`}
                  style={{ filter: 'brightness(0)' }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    priority
                    sizes="(max-w-768px) 150px, 200px"
                    className="object-contain object-center"
                  />
                </div>
              ))}
            </div>
            {/* Second Copy (Identical for seamless looping) */}
            <div className="flex items-center gap-16 sm:gap-20 md:gap-24 lg:gap-28 px-8 sm:px-10 md:px-12" aria-hidden="true">
              {marqueeLogos.map((logo, index) => (
                <div 
                  key={`second-${index}`}
                  className={`relative h-10 sm:h-12 md:h-14 ${getLogoWidth(logo.src)} flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300`}
                  style={{ filter: 'brightness(0)' }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    priority
                    sizes="(max-w-768px) 150px, 200px"
                    className="object-contain object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explore More Button */}
        <div ref={btnRef}>
          <Link 
            href="/partners"
            className="group/btn inline-flex items-center gap-3 border border-[#563320]/40 hover:border-[#563320] px-6 py-2.5 rounded-full font-ivymode text-xs sm:text-sm text-[#563320] uppercase tracking-widest transition-all duration-300 bg-transparent hover:bg-[#563320]/5"
          >
            <span>Explore more</span>
            <span className="inline-flex items-center justify-center border border-[#563320]/40 group-hover/btn:border-[#563320] rounded-full w-5 h-5 transition-all duration-300">
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
          </Link>
        </div>

      </div>
    </section>
  );
}
