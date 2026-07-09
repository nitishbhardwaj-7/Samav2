"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectItem {
  number: string;
  title: string;
  image: string;
  link: string;
}

interface ProjectsSectionProps {
  data?: {
    title: string;
    subtitle: string;
    description: string;
    items: ProjectItem[];
  };
}

export default function ProjectsSection({ data }: ProjectsSectionProps) {
  const pathname = usePathname();
  const title = data?.title || "Projects";
  const subtitle = data?.subtitle || "Spaces Brought to Life";
  const description = data?.description || "A curated selection of interiors that reflect our design philosophy, attention to detail, and regional expertise.";
  const items = data?.items || [
    { number: "01", title: "Interior", image: "/uploads/2026/06/interior-1-1.png", link: "/interior" },
    { number: "02", title: "Exhibition Design & Build", image: "/uploads/2026/06/Exhibition-1-1.png", link: "/exhibition" },
    { number: "03", title: "Events", image: "/uploads/2026/06/events-1-1.png", link: "/events" },
    { number: "04", title: "Mall Activation & Travel Retail", image: "/uploads/2026/06/Mall-Activation-1-1-2.png", link: "/mall-activation-travel-retail" },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header animation
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Title: character reveal
      if (titleRef.current) {
        const text = titleRef.current.textContent || "";
        titleRef.current.innerHTML = "";

        const chars = text.split("").map((char) => {
          const wrapper = document.createElement("span");
          wrapper.style.display = "inline-block";
          wrapper.style.overflow = "hidden";
          wrapper.style.verticalAlign = "bottom";
          wrapper.style.paddingBottom = "0.2em"; // Prevent descender clipping
          wrapper.style.marginBottom = "-0.2em";

          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.style.willChange = "transform";
          inner.textContent = char === " " ? "\u00A0" : char;
          wrapper.appendChild(inner);
          titleRef.current!.appendChild(wrapper);
          return inner;
        });

        headerTl.from(chars, {
          yPercent: 120,
          duration: 1.4,
          stagger: 0.04,
          ease: "power4.out",
          onComplete: () => {
            if (titleRef.current) {
              titleRef.current.innerHTML = title; // Restore plain text to fully unclip any descenders
            }
          }
        }, 0);
      }

      // Subtitle and description
      if (subtitleRef.current) {
        headerTl.from(subtitleRef.current, {
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
        }, 0.5);
      }

      if (descRef.current) {
        headerTl.from(descRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        }, 0.7);
      }

      // Each project row: staggered curtain reveal
      projectRefs.current.forEach((projectEl, index) => {
        if (!projectEl) return;

        const imageContainer = projectEl.querySelector("[data-image-wrap]") as HTMLElement;
        const imageInner = projectEl.querySelector("[data-image-inner]") as HTMLElement;
        const infoElements = projectEl.querySelectorAll("[data-info-item]");

        const projectTl = gsap.timeline({
          scrollTrigger: {
            trigger: projectEl,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });

        // Image curtain reveal
        if (imageContainer) {
          const direction = index % 2 === 0 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
          gsap.set(imageContainer, { clipPath: direction });

          projectTl.to(imageContainer, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.out",
          }, 0);
        }

        // Image scale down
        if (imageInner) {
          projectTl.from(imageInner, {
            scale: 1.25,
            duration: 2,
            ease: "power3.out",
          }, 0);
        }

        // Info items stagger
        if (infoElements.length) {
          projectTl.from(infoElements, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out",
          }, 0.4);
        }
      });

      // CTA fade up
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full pt-16 pb-16 sm:pt-24 sm:pb-24 flex flex-col items-center justify-center overflow-hidden"
      style={{ 
        background: pathname === '/projects' 
          ? 'linear-gradient(180deg, #778065 0%, #778065 10%, #496449 47.5%, #496449 52.5%, #DAC6AE 100%)'
          : 'linear-gradient(180deg, #496449 0%, #714230 50%, #8B6759 80%, #DAC6AE 100%)' 
      }}
    >
      <div className="w-full flex flex-col gap-20 sm:gap-28 z-10">
        
        {/* Header Block */}
        <div ref={headerRef} className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 sm:pb-12">
          {/* Main Title */}
          <h2 ref={titleRef} className="font-ivymode font-normal text-[5.5rem] sm:text-[7.5rem] md:text-[9rem] lg:text-[10.5rem] xl:text-[12.5rem] text-[#E5D9C4] leading-[0.8] select-none whitespace-nowrap">
            {title}
          </h2>
          
          {/* Subtext info */}
          <div className="max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-start gap-3">
            <h3 ref={subtitleRef} className="font-ivymode text-lg sm:text-xl md:text-2xl text-[#E5D9C4] font-normal leading-tight">
              {subtitle}
            </h3>
            <p ref={descRef} className="font-ivymode text-xs sm:text-sm text-[#E5D9C4]/80 leading-relaxed tracking-wide">
              {description}
            </p>
          </div>
        </div>

        {/* Dynamic Projects Grid */}
        <div className="w-full flex flex-col gap-0">
          {items.map((item, index) => {
            const isReverse = index % 2 === 1;
            const isLastItem = index === items.length - 1;
            
            // Apply dark brown text styling for the last project item that sits on the light background
            const textThemeClass = isLastItem ? "text-[#563320]" : "text-[#E5D9C4]";
            const borderThemeClass = isLastItem 
              ? "border-[#563320]/60 text-[#563320]" 
              : "border-[#E5D9C4]/40 text-[#E5D9C4]";
            const lineThemeClass = isLastItem ? "bg-[#563320]/30" : "bg-white/20";
            const alignmentClass = isReverse ? "items-start md:items-end text-left md:text-right" : "items-start text-left";

            return (
              <div 
                key={index}
                ref={(el) => { projectRefs.current[index] = el; }}
                className={`w-full flex flex-col group items-stretch gap-0 px-4 sm:px-6 md:px-0 ${
                  isReverse ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Image Column */}
                <div
                  data-image-wrap
                  className="w-full md:w-[60%] group-hover:md:w-[66%] relative h-[50vh] md:h-[65vh] min-h-[350px] overflow-hidden shadow-xl rounded-2xl md:rounded-none"
                  style={{ transition: "width 2.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
                >
                  <TransitionLink 
                    href={item.link} 
                    className="block w-full h-full relative outline-none focus:outline-none cursor-pointer"
                  >
                    <div data-image-inner className="absolute inset-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 70vw"
                        className="object-cover object-center group-hover:scale-[1.05] transition-transform duration-[2200ms] ease-out"
                      />
                    </div>
                    
                    {/* Know More button */}
                    <div className={`absolute bottom-6 sm:bottom-10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-20 ${isReverse ? "left-6 sm:left-10" : "right-6 sm:right-10"}`}>
                      <span className="inline-flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/40 text-white hover:bg-white hover:text-[#563320] font-ivymode px-6 py-2 sm:px-8 sm:py-3 text-sm tracking-widest uppercase transition-colors duration-300">
                        Know More
                      </span>
                    </div>
                  </TransitionLink>
                </div>

                {/* Info Column */}
                <div className={`w-full flex-1 flex flex-col justify-center py-6 md:py-0 ${
                  isReverse 
                    ? "pl-2 sm:pl-4 md:pl-[7.5vw] pr-2 sm:pr-4 md:pr-16" 
                    : "pr-2 sm:pr-4 md:pr-[7.5vw] pl-2 sm:pl-4 md:pl-16"
                } ${alignmentClass}`}>
                  {/* Number Box */}
                  <div data-info-item className={`border px-3 py-1.5 font-ivymode text-sm tracking-wider select-none ${
                    isReverse ? "self-start md:self-end" : "self-start"
                  } ${borderThemeClass}`}>
                    {item.number}
                  </div>
                  {/* Divider Line */}
                  <div data-info-item className={`w-[1px] h-20 my-4 ${
                    isReverse ? "ml-3 md:ml-0 md:mr-3" : "ml-3"
                  } ${lineThemeClass}`} />
                  {/* Title */}
                  <h4 data-info-item className={`font-ivymode text-2xl sm:text-3xl md:text-4xl font-normal leading-snug max-w-xs ${textThemeClass}`}>
                    {item.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call To Action Block */}
        <div ref={ctaRef} className="w-full flex flex-col items-center justify-center gap-6 mt-8 pb-8 text-center px-4">
          <p className="font-ivymode text-base sm:text-lg md:text-xl text-[#563320] tracking-wide max-w-none whitespace-nowrap">
            Take a closer look at our projects and capabilities.
          </p>
          <a
            href="/portfolio.pdf"
            download
            className="inline-flex items-center gap-2 bg-[#563320] hover:bg-[#402213] text-[#E5D9C4] font-ivymode text-xs sm:text-sm tracking-widest uppercase px-8 py-3.5 rounded-full shadow-[0_10px_30px_rgba(86,51,32,0.3)] transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            <span>Download Portfolio</span>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
