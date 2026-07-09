"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createTextReveal,
  createImageReveal,
  createParallax,
  createFadeUp,
  createStaggerReveal
} from "../../lib/animations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealTextProps {
  children: React.ReactNode;
  type?: "words" | "chars" | "lines";
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  y?: number;
  as?: React.ElementType;
  className?: string;
}

export const RevealText = ({
  children,
  type = "words",
  duration = 1.2,
  stagger = 0.04,
  delay = 0,
  ease = "power4.out",
  y = 100,
  as: Component = "div",
  className = "",
}: RevealTextProps) => {
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (elRef.current) {
        const spans = elRef.current.querySelectorAll('.reveal-inner');
        gsap.fromTo(spans, 
          { yPercent: y, opacity: 0 },
          { 
            yPercent: 0, 
            opacity: 1, 
            duration, 
            stagger, 
            delay, 
            ease,
            scrollTrigger: {
              trigger: elRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    }, elRef);
    return () => ctx.revert();
  }, [y, duration, stagger, delay, ease]);

  const text = typeof children === 'string' ? children : String(children || '');
  
  let content;
  if (type === "words") {
    content = text.split(/\s+/).map((word, i, arr) => (
      <React.Fragment key={i}>
        <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <span className="reveal-inner" style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
            {word}
          </span>
        </span>
        {i < arr.length - 1 ? '\u00A0' : ''}
      </React.Fragment>
    ));
  } else if (type === "chars") {
    content = text.split('').map((char, i) => (
      <span key={i} className="reveal-inner" style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  } else {
    content = (
      <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
        <span className="reveal-inner" style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
          {text}
        </span>
      </span>
    );
  }

  return <Component ref={elRef} className={className}>{content}</Component>;
};

interface RevealImageProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  ease?: string;
  imageScale?: number;
  className?: string;
}

export const RevealImage = ({
  children,
  direction = "up",
  duration = 1.6,
  delay = 0,
  ease = "expo.out",
  imageScale = 1.15, // updated default scale for luxury feel
  className = "",
}: RevealImageProps) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (elRef.current) {
        createImageReveal(elRef.current, { direction, duration, delay, ease, imageScale, scrollTrigger: {} });
      }
    }, elRef);
    return () => ctx.revert();
  }, [direction, duration, delay, ease, imageScale]);

  return (
    <div ref={elRef} className={`invisible ${className}`}>
      {children}
    </div>
  );
};

interface FadeUpProps {
  children?: React.ReactNode;
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  as?: React.ElementType;
  className?: string;
}

export const FadeUp = ({
  children,
  y = 60,
  duration = 1.2,
  delay = 0,
  stagger = 0.1,
  ease = "power4.out",
  as: Component = "div",
  className = "",
}: FadeUpProps) => {
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (elRef.current) {
        createFadeUp(elRef.current, { y, duration, delay, stagger, ease, scrollTrigger: {} });
      }
    }, elRef);
    return () => ctx.revert();
  }, [y, duration, delay, stagger, ease]);

  return <Component ref={elRef} className={className}>{children}</Component>;
};

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "vertical" | "horizontal";
  className?: string;
}

export const ParallaxSection = ({
  children,
  speed = 30,
  direction = "vertical",
  className = "",
}: ParallaxSectionProps) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (elRef.current) {
        createParallax(elRef.current, { speed, direction });
      }
    }, elRef);
    return () => ctx.revert();
  }, [speed, direction]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
};

interface StaggerRevealProps {
  children: React.ReactNode;
  y?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  className?: string;
}

export const StaggerReveal = ({
  children,
  y = 80,
  duration = 1,
  stagger = 0.15,
  ease = "power4.out",
  className = "",
}: StaggerRevealProps) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (elRef.current) {
        const elements = Array.from(elRef.current.children) as HTMLElement[];
        if (elements.length > 0) {
          createStaggerReveal(elements, { y, duration, stagger, ease, scrollTrigger: {} });
        }
      }
    }, elRef);
    return () => ctx.revert();
  }, [y, duration, stagger, ease]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
};
