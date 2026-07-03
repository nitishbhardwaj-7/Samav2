"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Projects", href: "/projects" },
    { name: "Our Clients", href: "/partners" },
    { name: "Contact Us", href: "#contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[9999] bg-transparent transition-all duration-300 pointer-events-none">
        <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[80%] mx-auto py-6 sm:py-8 flex items-center justify-between pointer-events-auto">
          
          {/* Logo */}
          <Link href="/" className="relative w-28 h-10 sm:w-32 sm:h-12 select-none">
            <Image
              src="/uploads/2026/02/sama-logo.png"
              alt="SAMA Production"
              fill
              priority
              className="object-contain object-left"
            />
          </Link>

          {/* Right Area: Tagline & Hamburger */}
          <div className="flex items-center gap-6 sm:gap-8">
            <span className="hidden md:inline-block font-ivymode text-sm sm:text-base text-white tracking-wider select-none">
              Interior Design & Implementation
            </span>

            {/* Hamburger Icon */}
            <button 
              onClick={() => setIsOpen(true)}
              className="relative z-[99999] flex flex-col justify-between w-6 h-4 group cursor-pointer focus:outline-none"
              aria-label="Open Menu"
            >
              <span className="w-full h-[2px] bg-white transition-all duration-300 group-hover:bg-[#E5D9C4]" />
              <span className="w-full h-[2px] bg-white transition-all duration-300 group-hover:bg-[#E5D9C4]" />
              <span className="w-full h-[2px] bg-white transition-all duration-300 group-hover:bg-[#E5D9C4]" />
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
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-[55%] md:w-[40%] max-w-md bg-[#7C8C70]/40 backdrop-blur-md z-[99999] border-l border-white/10 transition-transform duration-500 ease-out shadow-2xl flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
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
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.name} className="w-full flex flex-col items-end">
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-5 font-ivymode text-3xl sm:text-4xl text-right transition-colors duration-300 tracking-wide ${
                    isActive ? "text-[#E5D9C4]" : "text-white hover:text-white/70"
                  }`}
                >
                  {link.name}
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
