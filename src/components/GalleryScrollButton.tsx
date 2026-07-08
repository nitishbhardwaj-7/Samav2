"use client";

import React, { useState, useEffect, useRef } from "react";

export default function GalleryScrollButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const container = button.closest('.gallery-container') as HTMLElement | null;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // If we are near the bottom (within 50px), toggle to Up arrow
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setIsAtBottom(true);
      } else if (scrollTop < 50) {
        setIsAtBottom(false);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const container = e.currentTarget.closest('.gallery-container');
    if (container) {
      if (isAtBottom) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ top: container.clientHeight * 0.8, behavior: 'smooth' });
      }
    }
  };

  return (
    <div ref={buttonRef} className="sticky bottom-4 left-0 right-0 flex justify-center z-10 pb-2 pointer-events-none">
      <button 
        onClick={handleClick}
        className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur flex items-center justify-center text-white shadow-xl animate-bounce transition-colors pointer-events-auto cursor-pointer"
        aria-label={isAtBottom ? "Scroll up gallery" : "Scroll down gallery"}
      >
        {isAtBottom ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  );
}
