"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

interface TransitionContextType {
  navigateToProject: (href: string, imgElement: HTMLImageElement, imgSrc: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateToProject: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [transitionData, setTransitionData] = useState<{ src: string; rect: DOMRect } | null>(null);
  const cloneRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const navigateToProject = (href: string, imageElement: HTMLImageElement, imgSrc: string) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      router.push(href);
      return;
    }

    const rect = imageElement.getBoundingClientRect();
    setTransitionData({ src: imgSrc, rect });
    
    // Lock scroll during transition
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      if (!cloneRef.current || !overlayRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => {
          router.push(href, { scroll: true });
          // Let the new page load and its entrance animations play
          setTimeout(() => {
             setTransitionData(null);
             document.body.style.overflow = "";
          }, 1000);
        }
      });

      // Hide other elements with the luxury project page background color
      tl.to(overlayRef.current, { opacity: 1, duration: 0.5, ease: "power2.inOut" }, 0.3);

      const isMobile = window.innerWidth < 640;
      const isMd = window.innerWidth >= 768;
      
      let targetWidth = window.innerWidth * 0.92;
      let targetHeight = targetWidth / (21 / 9);
      
      if (!isMobile) {
        targetWidth = window.innerWidth * (isMd ? 0.85 : 0.88);
        targetHeight = targetWidth / (isMd ? 2.4 : 2);
      }

      const targetLeft = (window.innerWidth - targetWidth) / 2;
      const targetTop = isMobile ? 96 : 128; // matches pt-24 / pt-32

      // Slight scale-up bump before settling
      tl.to(cloneRef.current, {
        scale: 1.08,
        duration: 0.5,
        ease: "power2.out",
      }, 0.1);

      tl.to(cloneRef.current, {
        top: targetTop,
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
        scale: 1,
        borderRadius: isMobile ? "16px" : "24px",
        duration: 1.2,
        ease: "expo.inOut",
      }, 0.4);

    }, 10);
  };

  return (
    <TransitionContext.Provider value={{ navigateToProject }}>
      {children}
      
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-[#7C8C70] pointer-events-none z-[9998] opacity-0"
        style={{ display: transitionData ? 'block' : 'none' }}
      />
      
      {transitionData && (
        <img
          ref={cloneRef}
          src={transitionData.src}
          alt=""
          className="fixed z-[9999] object-cover shadow-2xl"
          style={{
            top: transitionData.rect.top,
            left: transitionData.rect.left,
            width: transitionData.rect.width,
            height: transitionData.rect.height,
            borderRadius: "24px",
            margin: 0,
            transformOrigin: "center center",
            willChange: "top, left, width, height, transform, border-radius",
          }}
        />
      )}
    </TransitionContext.Provider>
  );
}
