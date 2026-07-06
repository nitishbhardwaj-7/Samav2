"use client";

import SmoothScroll from "./SmoothScroll";

/**
 * AnimationProvider
 * 
 * Orchestrates the page reveal sequence.
 * Wraps children in Lenis smooth scrolling.
 */
export default function AnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      {children}
    </SmoothScroll>
  );
}
