"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface InteriorHeaderProps {
  title: string;
  description: string;
  breadcrumbLabel?: string;
}

export default function InteriorHeader({ title, description, breadcrumbLabel }: InteriorHeaderProps) {
  const [showLogo, setShowLogo] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 1. After 3 seconds, fade out the SAMA logo
    const logoOutTimer = setTimeout(() => {
      setShowLogo(false);
    }, 3000);

    // 2. After 3.4 seconds, fade in the page header text and breadcrumbs
    const contentInTimer = setTimeout(() => {
      setShowContent(true);
    }, 3400);

    return () => {
      clearTimeout(logoOutTimer);
      clearTimeout(contentInTimer);
    };
  }, []);

  // Helper function to render italicized '&' inside titles
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

  // Determine title text size class depending on length to prevent layout breakage
  const titleSizeClass = title.length > 20
    ? "text-[2.25rem] xs:text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5rem] whitespace-normal md:whitespace-nowrap"
    : "text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem]";

  return (
    <div className="w-full pt-32 sm:pt-40 pb-8 px-4 flex flex-col items-center text-center max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto relative min-h-[250px] sm:min-h-[300px] justify-center">
      
      {/* SAMA Logo (In-Place Absolute Centered Overlay) */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 ease-in-out transform ${
          showLogo ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
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

      {/* Main Header Text Content (Fades & Slides Up in-place) */}
      <div
        className={`w-full flex flex-col items-center transition-all duration-1000 ease-out transform ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <h1 className={`font-ivymode font-normal text-white leading-[1.1] select-none ${titleSizeClass}`}>
          {renderTitle(title)}
        </h1>

        <p className="font-ivymode text-sm sm:text-base md:text-lg text-white mt-4 sm:mt-6 leading-relaxed tracking-wide max-w-4xl mx-auto">
          {description}
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 font-ivymode text-sm sm:text-base text-white select-none">
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
