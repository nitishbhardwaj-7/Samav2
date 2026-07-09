"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ReachOutSectionProps {
  data?: {
    title: string;
    image: string;
    phone: string;
    phoneRaw: string;
  };
}

export default function ReachOutSection({ data }: ReachOutSectionProps) {
  const title = data?.title || "Reach Out";
  const image = data?.image || "/uploads/2026/05/vertical-shot-dining-set-featuring-modern-chairs-a-2026-01-22-02-31-15-utc_1-1.png";
  const phone = data?.phone || "+971 4 320 0416";
  const phoneRaw = data?.phoneRaw || "+97143200416";

  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // Image: curtain reveal from bottom
      if (imageWrapRef.current) {
        gsap.set(imageWrapRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
        });

        tl.to(imageWrapRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.out",
        }, 0);
      }

      if (imageInnerRef.current) {
        tl.from(imageInnerRef.current, {
          scale: 1.3,
          duration: 2,
          ease: "power3.out",
        }, 0);
      }

      // Title: word reveal
      if (titleRef.current) {
        const text = titleRef.current.textContent || "";
        titleRef.current.innerHTML = "";

        const words = text.split(/\s+/).map((word, i, arr) => {
          const wrapper = document.createElement("span");
          wrapper.style.display = "inline-block";
          wrapper.style.overflow = "hidden";
          wrapper.style.verticalAlign = "bottom";

          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.style.willChange = "transform";
          inner.textContent = word;
          wrapper.appendChild(inner);
          titleRef.current!.appendChild(wrapper);

          if (i < arr.length - 1) {
            titleRef.current!.appendChild(document.createTextNode("\u00A0"));
          }
          return inner;
        });

        tl.from(words, {
          yPercent: 120,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
        }, 0.3);
      }

      // Form fields stagger
      if (formRef.current) {
        const formChildren = formRef.current.children;
        tl.from(formChildren, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power4.out",
        }, 0.6);
      }

      // Divider
      if (dividerRef.current) {
        tl.from(dividerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
        }, 1.0);
      }

      // Phone
      if (phoneRef.current) {
        tl.from(phoneRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
        }, 1.2);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative w-full py-16 sm:py-24 px-6 sm:px-10 md:px-14 lg:px-16 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[75%] mx-auto flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-20 z-10">
        
        {/* Left Column: Image */}
        <div className="hidden md:flex w-full md:w-[35%] justify-center">
          <div ref={imageWrapRef} className="relative w-full max-w-[280px] aspect-[1/2] overflow-hidden rounded-2xl bg-[#2b2a22] isolate transform translate-z-0">
            <div ref={imageInnerRef} className="absolute inset-0">
              <Image
                src={image}
                alt="Reach Out Corridor"
                fill
                priority
                sizes="(max-w-768px) 100vw, 35vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Contact Details & Form */}
        <div className="w-full md:w-[65%] flex flex-col items-start gap-8">
          {/* Headline */}
          <h2 ref={titleRef} className="font-ivymode font-normal text-4xl sm:text-5xl md:text-6xl text-[#563320] leading-tight select-none">
            {title}
          </h2>

          {/* Form */}
          <form ref={formRef} className="w-full flex flex-col items-start gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="w-full flex flex-col sm:flex-row gap-6">
              {/* Name */}
              <div className="flex-1 flex flex-col gap-1">
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="w-full bg-transparent border-b border-[#563320]/30 focus:border-[#563320] outline-none pb-2 font-ivymode text-sm text-[#563320] placeholder-[#563320]/50 transition-colors duration-300"
                />
              </div>
              {/* Email */}
              <div className="flex-1 flex flex-col gap-1">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full bg-transparent border-b border-[#563320]/30 focus:border-[#563320] outline-none pb-2 font-ivymode text-sm text-[#563320] placeholder-[#563320]/50 transition-colors duration-300"
                />
              </div>
            </div>
            {/* Message */}
            <div className="w-full flex flex-col gap-1">
              <textarea 
                placeholder="Message" 
                rows={3}
                className="w-full bg-transparent border-b border-[#563320]/30 focus:border-[#563320] outline-none pb-2 font-ivymode text-sm text-[#563320] placeholder-[#563320]/50 transition-colors duration-300 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="bg-[#856555] hover:bg-[#563320] text-white font-ivymode text-sm tracking-widest uppercase px-12 py-3 transition-colors duration-300 select-none cursor-pointer"
            >
              submit
            </button>
          </form>

          {/* Divider & Phone Number */}
          <div ref={dividerRef} className="w-full flex flex-col items-start gap-2">
            {/* Vertical Line with "or" */}
            <div className="flex flex-col items-start pl-3">
              <div className="w-[1px] h-10 bg-[#563320]/25" />
              <span className="font-ivymode text-base text-[#563320]/70 my-1 select-none">
                or
              </span>
              <div className="w-[1px] h-10 bg-[#563320]/25" />
            </div>

            {/* Phone */}
            <a 
              ref={phoneRef}
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-3 font-ivymode text-lg sm:text-xl text-[#563320] hover:text-[#856555] transition-colors duration-300 mt-2"
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-[#563320]"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{phone}</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
