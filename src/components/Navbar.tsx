"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

export default function Navbar({ tagline = "Interior Design & Implementation" }: { tagline?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLDivElement | null)[]>([]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Projects", href: "/projects" },
    { name: "Our Clients", href: "/partners" },
    { name: "Contact Us", href: "/#contact" },
  ];

  // Navbar entrance animation (delayed to play after preloader)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 }); // Minimal delay for smooth mounting

      if (logoRef.current) {
        gsap.set(logoRef.current, { opacity: 0, y: -15 });
        tl.to(logoRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
        }, 0);
      }

      if (taglineRef.current) {
        gsap.set(taglineRef.current, { opacity: 0, y: -10 });
        tl.to(taglineRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
        }, 0.15);
      }

      if (hamburgerRef.current) {
        gsap.set(hamburgerRef.current, { opacity: 0, y: -10 });
        tl.to(hamburgerRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
        }, 0.25);
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // Drawer open/close GSAP animation
  useEffect(() => {
    if (!drawerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    if (isOpen) {
      // Open animation
      const tl = gsap.timeline();

      tl.to(drawerRef.current, {
        x: 0,
        duration: 0.8,
        ease: "expo.out",
      });

      // Stagger nav link reveals
      const validLinks = linkRefs.current.filter(Boolean);
      tl.from(validLinks, {
        x: 60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power4.out",
      }, 0.3);
    } else {
      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <>
      <header ref={headerRef} className="absolute top-0 left-0 w-full z-[9999] bg-transparent transition-all duration-300 pointer-events-none">
        <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto py-6 sm:py-8 flex items-center justify-between pointer-events-auto">
          
          {/* Logo */}
          <Link ref={logoRef} href="/" onClick={(e) => { e.preventDefault(); router.push("/"); }} className="relative w-28 h-10 sm:w-32 sm:h-12 select-none">
            <Image
              src="/uploads/2026/02/sama-logo.png"
              alt="SAMA Production"
              fill
              priority
              sizes="(max-width: 640px) 112px, 128px"
              className="object-contain object-left"
            />
          </Link>

          {/* Right Area: Tagline & Hamburger */}
          <div className="flex items-center gap-6 sm:gap-8">
            <span ref={taglineRef} className="hidden md:inline-block font-ivymode text-sm sm:text-base text-white tracking-wider select-none">
              {tagline}
            </span>

            {/* Hamburger Icon */}
            <button 
              ref={hamburgerRef}
              onClick={() => setIsOpen(true)}
              className="relative z-[99999] flex flex-col justify-between w-6 h-4 group cursor-pointer focus:outline-none"
              aria-label="Open Menu"
            >
              <span className="w-full h-[2px] bg-white transition-all duration-300 group-hover:bg-[#E5D9C4] group-hover:w-[80%]" />
              <span className="w-full h-[2px] bg-white transition-all duration-300 group-hover:bg-[#E5D9C4]" />
              <span className="w-full h-[2px] bg-white transition-all duration-300 group-hover:bg-[#E5D9C4] group-hover:w-[60%]" />
            </button>
          </div>

        </div>
      </header>

      {/* Background Overlay */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998] transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-out Menu Drawer from Right */}
      <div 
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-[85%] sm:w-[55%] md:w-[40%] max-w-md bg-[#7C8C70]/40 backdrop-blur-md z-[99999] border-l border-white/10 shadow-2xl flex flex-col"
        style={{ transform: "translateX(100%)" }}
      >
        {/* Drawer Header with close button X on the left and line */}
        <div className="w-full mt-10 flex items-center px-6 sm:px-10 py-4 gap-6">
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-white/80 transition-colors duration-300 focus:outline-none flex-shrink-0"
            aria-label="Close Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="flex-grow h-[1px] bg-white/40" />
        </div>

        {/* Links aligned right */}
        <nav className="flex flex-col select-none pr-6 sm:pr-10 pb-10">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <div
                key={link.name}
                ref={(el) => { linkRefs.current[index] = el; }}
                className="w-full flex flex-col items-end"
              >
                <Link
                  href={link.href}
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setIsOpen(false); 
                    setTimeout(() => {
                      if (link.href.includes('#')) {
                        const [path, hash] = link.href.split('#');
                        // Store the scroll target so SmoothScroll can animate to it after page load
                        sessionStorage.setItem('scrollToHash', hash);
                        const targetPath = path || '/';
                        if (pathname === targetPath) {
                          // Already on the right page, just smooth scroll
                          const el = document.getElementById(hash);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                          sessionStorage.removeItem('scrollToHash');
                        } else {
                          router.push(targetPath);
                        }
                      } else {
                        router.push(link.href);
                      }
                    }, 400); 
                  }}
                  className={`block py-5 font-ivymode text-3xl sm:text-4xl text-right transition-colors duration-300 tracking-wide group/link relative ${
                    isActive ? "text-[#E5D9C4]" : "text-white hover:text-white/70"
                  }`}
                >
                  <span className="relative inline-block">
                    {link.name}
                    {/* Elegant underline on hover */}
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current transform scale-x-0 origin-right group-hover/link:scale-x-100 group-hover/link:origin-left transition-transform duration-500 ease-out" />
                  </span>
                </Link>
                <div className="w-[60%] sm:w-[55%] h-[1px] bg-white/30" />
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
