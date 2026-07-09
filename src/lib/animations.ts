/**
 * SAMA Production — Luxury Animation Utilities
 * 
 * Core GSAP animation primitives for a premium editorial experience.
 * Inspired by Simone Katherine Interiors, Awwwards-level motion design.
 * 
 * Easing palette:
 *   "power4.out"  — elegant entrances
 *   "expo.out"    — dramatic reveals
 *   "circ.out"    — smooth, natural deceleration
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Text Splitting Utility ─────────────────────────────────── */

/**
 * Splits text content into individually animated spans.
 * Returns the created span elements for GSAP targeting.
 */
export function splitTextIntoSpans(
  element: HTMLElement,
  type: "words" | "chars" | "lines" = "words"
): HTMLElement[] {
  const text = element.textContent || "";
  element.innerHTML = "";

  if (type === "chars") {
    const chars = text.split("");
    return chars.map((char) => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      span.textContent = char === " " ? "\u00A0" : char;
      element.appendChild(span);
      return span;
    });
  }

  if (type === "words") {
    const words = text.split(/\s+/);
    return words.map((word, i) => {
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";
      wrapper.style.verticalAlign = "bottom";

      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.style.willChange = "transform, opacity";
      inner.textContent = word;
      wrapper.appendChild(inner);

      element.appendChild(wrapper);
      // Add space between words (not after last)
      if (i < words.length - 1) {
        const space = document.createTextNode("\u00A0");
        element.appendChild(space);
      }
      return inner;
    });
  }

  // lines — wrap entire content in one overflow-hidden block
  const wrapper = document.createElement("span");
  wrapper.style.display = "inline-block";
  wrapper.style.overflow = "hidden";
  wrapper.style.verticalAlign = "bottom";
  const inner = document.createElement("span");
  inner.style.display = "inline-block";
  inner.style.willChange = "transform, opacity";
  inner.textContent = text;
  wrapper.appendChild(inner);
  element.appendChild(wrapper);
  return [inner];
}

/* ─── Luxury Text Reveal ─────────────────────────────────────── */

export function createTextReveal(
  element: HTMLElement,
  options: {
    type?: "words" | "chars" | "lines";
    duration?: number;
    stagger?: number;
    delay?: number;
    ease?: string;
    y?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
): gsap.core.Timeline {
  const {
    type = "words",
    duration = 1.2,
    stagger = 0.04,
    delay = 0,
    ease = "power4.out",
    y = 100,
    scrollTrigger,
  } = options;

  const spans = splitTextIntoSpans(element, type);

  const tl = gsap.timeline({
    scrollTrigger: scrollTrigger
      ? {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none none",
          ...scrollTrigger,
        }
      : undefined,
  });

  tl.fromTo(spans,
    {
      yPercent: y,
      opacity: 0,
    },
    {
      yPercent: 0,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease,
    }
  );

  return tl;
}

/* ─── Luxury Image Reveal (Curtain Effect) ───────────────────── */

export function createImageReveal(
  container: HTMLElement,
  options: {
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
    delay?: number;
    ease?: string;
    imageScale?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
): gsap.core.Timeline {
  const {
    direction = "up",
    duration = 1.6,
    delay = 0,
    ease = "expo.out",
    imageScale = 1.3,
    scrollTrigger,
  } = options;

  const image = container.querySelector("img") as HTMLElement;
  const tl = gsap.timeline({
    scrollTrigger: scrollTrigger
      ? {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none none",
          ...scrollTrigger,
        }
      : undefined,
  });

  // Determine clip-path based on direction
  const clipFrom: Record<string, string> = {
    up: "inset(100% 0% 0% 0%)",
    down: "inset(0% 0% 100% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  };

  // Container: reveal via clip-path
  tl.fromTo(
    container,
    { clipPath: clipFrom[direction], visibility: "visible" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration,
      delay,
      ease,
    }
  );

  // Image: scale down as curtain opens
  if (image) {
    tl.fromTo(
      image,
      { scale: imageScale },
      {
        scale: 1,
        duration: duration * 1.2,
        ease: "power3.out",
      },
      0 // start at same time
    );
  }

  return tl;
}

/* ─── Parallax Effect ────────────────────────────────────────── */

export function createParallax(
  element: HTMLElement,
  options: {
    speed?: number;
    direction?: "vertical" | "horizontal";
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
): gsap.core.Tween {
  const { speed = 30, direction = "vertical" } = options;

  const props =
    direction === "vertical"
      ? { yPercent: -speed }
      : { xPercent: -speed };

  return gsap.to(element, {
    ...props,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      ...options.scrollTrigger,
    },
  });
}

/* ─── Fade Up Animation ──────────────────────────────────────── */

export function createFadeUp(
  element: HTMLElement | HTMLElement[],
  options: {
    y?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
    ease?: string;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
): gsap.core.Tween {
  const {
    y = 60,
    duration = 1.2,
    delay = 0,
    stagger = 0.1,
    ease = "power4.out",
    scrollTrigger,
  } = options;

  return gsap.fromTo(
    element,
    {
      y,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: scrollTrigger
        ? {
            trigger: Array.isArray(element) ? element[0] : element,
            start: "top 85%",
            toggleActions: "play none none none",
            ...scrollTrigger,
          }
        : undefined,
    }
  );
}

/* ─── Stagger Reveal for Cards / Grid Items ──────────────────── */

export function createStaggerReveal(
  elements: HTMLElement[],
  options: {
    y?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
): gsap.core.Tween {
  const {
    y = 80,
    duration = 1,
    stagger = 0.15,
    ease = "power4.out",
    scrollTrigger,
  } = options;

  return gsap.fromTo(
    elements,
    {
      y,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease,
      scrollTrigger: scrollTrigger
        ? {
            trigger: elements[0]?.parentElement || elements[0],
            start: "top 80%",
            toggleActions: "play none none none",
            ...scrollTrigger,
          }
        : undefined,
    }
  );
}

/* ─── Line Draw Animation ────────────────────────────────────── */

export function createLineDraw(
  element: HTMLElement,
  options: {
    direction?: "horizontal" | "vertical";
    duration?: number;
    delay?: number;
    ease?: string;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
): gsap.core.Tween {
  const {
    direction = "horizontal",
    duration = 1.4,
    delay = 0,
    ease = "expo.out",
  } = options;

  const prop = direction === "horizontal" ? "scaleX" : "scaleY";
  const origin = direction === "horizontal" ? "left center" : "center top";

  gsap.set(element, { [prop]: 0, transformOrigin: origin });

  return gsap.to(element, {
    [prop]: 1,
    duration,
    delay,
    ease,
    scrollTrigger: options.scrollTrigger
      ? {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none none",
          ...options.scrollTrigger,
        }
      : undefined,
  });
}

/* ─── Magnetic Hover Effect ──────────────────────────────────── */

export function createMagneticEffect(
  element: HTMLElement,
  strength: number = 0.3
): () => void {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.4)",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
}
