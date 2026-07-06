"use client";

import React from "react";

export default function GalleryScrollButton() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Find the closest scrollable gallery container by its class or attributes
    const container = e.currentTarget.closest('.gallery-container');
    if (container) {
      container.scrollBy({ top: container.clientHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky bottom-4 left-0 right-0 flex justify-center z-10 pb-2 pointer-events-none">
      <button 
        onClick={handleClick}
        className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur flex items-center justify-center text-white shadow-xl animate-bounce transition-colors pointer-events-auto"
        aria-label="Scroll down gallery"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
