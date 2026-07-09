"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { splitTextIntoSpans } from "../lib/animations";

interface InteriorHeaderProps {
  title: string;
  description: string;
  breadcrumbLabel?: string;
}

export default function InteriorHeader({ title, description, breadcrumbLabel }: InteriorHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Logo fade out (delay a bit so it's visible on load)
      tl.to(logoRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: "power2.inOut",
        delay: 0.5,
      });

      // Show content container
      tl.set(contentRef.current, { autoAlpha: 1 });

      // Animate title line by line
      if (titleRef.current) {
        const spans = splitTextIntoSpans(titleRef.current, "words");
        tl.fromTo(spans, 
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: "power4.out" }
        );
      }

      // Fade up description and breadcrumbs
      tl.fromTo(".fade-up-item", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
        "-=0.8"
      );

    }, containerRef);
    return () => ctx.revert();
  }, [title]);

  const renderTitle = (text: string) => {
    if (text.includes("&")) {
      const parts = text.split("&");
      return (
        <>
          {parts[0]} <span className="italic font-light">&</span> {parts[1]}
        </>
      );
    }
    return text;
  };

  const titleSizeClass = title.length > 20
    ? "text-[2.25rem] xs:text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5rem] whitespace-normal md:whitespace-nowrap"
    : "text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem]";

  return (
    <div ref={containerRef} className="w-full pt-32 sm:pt-40 pb-8 px-4 flex flex-col items-center text-center max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto relative min-h-[250px] sm:min-h-[300px] justify-center">
      
      {/* SAMA Logo */}
      <div
        ref={logoRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="relative w-48 h-16 sm:w-64 sm:h-24">
          <Image
            src="/uploads/2026/02/sama-logo.png"
            alt="SAMA Production Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Header Text Content */}
      <div
        ref={contentRef}
        className="w-full flex flex-col items-center opacity-0 invisible"
      >
        <h1 ref={titleRef} className={`font-ivymode font-normal text-white leading-[1.1] select-none ${titleSizeClass}`}>
          {renderTitle(title)}
        </h1>

        <p className="fade-up-item font-ivymode text-sm sm:text-base md:text-lg text-white mt-4 sm:mt-6 leading-relaxed tracking-wide max-w-4xl mx-auto">
          {description}
        </p>

        <div className="fade-up-item mt-8 flex items-center justify-center gap-2 font-ivymode text-sm sm:text-base text-white select-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <Link href="/" className="hover:text-white/80 transition-colors no-underline">Home</Link>
          <span className="mx-1 opacity-70">/</span>
          <span className="underline decoration-white/60 underline-offset-4">
            {breadcrumbLabel || title}
          </span>
        </div>
      </div>
    </div>
  );
}
