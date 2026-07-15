"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TransitionLink from "./TransitionLink";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [socialLinks, setSocialLinks] = useState({
    linkedin: "https://ae.linkedin.com/company/samaproductiondxb",
    whatsapp: "https://wa.me/971561189670",
    facebook: "https://www.facebook.com/share/1CkesXNZ5H/?mibextid=wwXIfr"
  });

  useEffect(() => {
    fetch("/api/social-links")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSocialLinks(data);
        }
      })
      .catch((err) => console.error("Failed to load footer social links dynamically:", err));
  }, []);

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
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>

            <p className="font-ivymode text-[10px] sm:text-xs text-white mt-auto pt-8">
              © 2026 Sama Interior design. All Rights Reserved.
            </p>
          </div>


          {/* Right Column: Address / Location */}
          <div className="flex flex-col w-full lg:w-[30%] h-full lg:items-end">
            <div className="flex flex-col gap-6 w-fit h-full font-ivymode text-[10px] sm:text-xs text-white leading-relaxed">
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
                <div>
                  <p>UAE</p>
                  <p className="opacity-90">77 St. Dubai Investment Park2, P.O.Box 449020, Dubai</p>
                </div>
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
                  <p>Kingdom of Saudi Arabia (KSA)</p>
                  <p className="opacity-90">7412 Aljawz, Ar Robie District, Riyadh 13316</p>
                </div>
              </div>

              {/* Privacy Policies */}
              <div className="flex flex-wrap items-center gap-4 mt-auto pt-8 font-ivymode text-[10px] sm:text-xs text-white ml-[28px]">
                <TransitionLink href="/privacy-policy" className="hover:text-white/80 transition-colors duration-300">Privacy Policy</TransitionLink>
                <span>|</span>
                <TransitionLink href="/terms-and-conditions" className="hover:text-white/80 transition-colors duration-300">Terms & Conditions</TransitionLink>
                <span>|</span>
                <Link
                  href="/#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    const hash = "contact";
                    sessionStorage.setItem('scrollToHash', hash);
                    const targetPath = '/';
                    if (pathname === targetPath) {
                      const el = document.getElementById(hash);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      sessionStorage.removeItem('scrollToHash');
                    } else {
                      router.push(targetPath);
                    }
                  }}
                  className="hover:text-white/80 transition-colors duration-300"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
