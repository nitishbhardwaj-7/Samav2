"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!contentRef.current) return;

      const children = contentRef.current.children;

      gsap.from(children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative w-full bg-[#7C8C70] pt-16 pb-8 px-6 sm:px-10 md:px-14 lg:px-16 flex flex-col items-center overflow-hidden">
      <div ref={contentRef} className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto flex flex-col gap-12 sm:gap-16 z-10">

        {/* Main Content Row */}
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-10 lg:gap-6">

          {/* Left Column: Logo & Socials */}
          <div className="flex flex-col items-center gap-6 w-full lg:w-[30%]">
            <div className="relative w-56 h-20 select-none">
              <Image
                src="/uploads/2026/02/footer-logo-sama.png"
                alt="SAMA Production Logo"
                fill
                priority
                sizes="224px"
                className="object-contain object-center"
              />
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-white">
              {/* LinkedIn */}
              <a href="#" className="hover:text-white/80 transition-colors duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" className="hover:text-white/80 transition-colors duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="hover:text-white/80 transition-colors duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>

            <p className="font-ivymode text-[10px] sm:text-xs text-white mt-auto pt-8">
              © 2026 Sama Interior design. All Rights Reserved.
            </p>
          </div>

          {/* Middle Column: Nav Links */}
          <div className="flex items-start justify-start w-full lg:w-[40%] pt-8 lg:pt-2">
            <nav className="flex flex-wrap items-center justify-start gap-6 sm:gap-8 font-ivymode text-sm sm:text-base text-white">
              <Link href="/" className="hover:text-white/80 transition-colors duration-300">Home</Link>
              <Link href="/about-us" className="hover:text-white/80 transition-colors duration-300">About Us</Link>
              <Link href="/projects" className="hover:text-white/80 transition-colors duration-300">Projects</Link>
              <Link href="/partners" className="hover:text-white/80 transition-colors duration-300">Our Clients</Link>
              <Link href="/#contact" className="hover:text-white/80 transition-colors duration-300">Contact Us</Link>
            </nav>
          </div>

          {/* Right Column: Address / Location */}
          <div className="flex flex-col w-full lg:w-[30%] h-full lg:items-end">
            <div className="flex flex-col gap-6 w-fit h-full font-ivymode text-xs sm:text-sm text-white leading-relaxed">
              {/* Location 1 */}
              <div className="flex items-start gap-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 flex-shrink-0 text-white"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>77 St. Dubai Investment Park2, P.O.Box 449020, Dubai, UAE</span>
              </div>

              {/* Location 2 */}
              <div className="flex items-start gap-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 flex-shrink-0 text-white"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <p>7412 Aljawz, Ar Robie District</p>
                  <p className="opacity-90">Riyadh 13316, Kingdom of Saudi Arabia (KSA)</p>
                </div>
              </div>

              {/* Privacy Policies */}
              <div className="flex flex-wrap items-center gap-4 mt-auto pt-8 font-ivymode text-[10px] sm:text-xs text-white ml-[28px]">
                <a href="#" className="hover:text-white/80 transition-colors duration-300">Privacy Policy</a>
                <span>|</span>
                <a href="#" className="hover:text-white/80 transition-colors duration-300">Terms & Conditions</a>
                <span>|</span>
                <Link href="/#contact" className="hover:text-white/80 transition-colors duration-300">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
