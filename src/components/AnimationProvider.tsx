"use client";

import SmoothScroll from "./SmoothScroll";
import PageTransition from "./PageTransition";

/**
 * AnimationProvider
 * 
 * Orchestrates the page reveal sequence.
 * Wraps children in Lenis smooth scrolling and GSAP page transitions.
 */
export default function AnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <PageTransition>
        {children}
      </PageTransition>
    </SmoothScroll>
  );
}


