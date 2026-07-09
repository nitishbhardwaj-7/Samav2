"use client";

import { type AnchorHTMLAttributes, useRef } from "react";
import Link from "next/link";
import { usePageTransition } from "./PageTransition";

interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: React.ReactNode;
  sharedImageSrc?: string;
  sharedImageBorderRadius?: string;
}

export default function TransitionLink({
  href,
  children,
  sharedImageSrc,
  sharedImageBorderRadius,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const { navigateToProject } = usePageTransition();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) onClick(e);
    
    // Handle same-page hash navigation smoothly
    if (href.includes('#')) {
      const parts = href.split('#');
      const targetPath = parts[0];
      const targetId = parts[1];
      const isCurrentPage = window.location.pathname === targetPath || (!targetPath && href.startsWith('#'));
      
      if (isCurrentPage && targetId) {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (targetId) {
        // Cross-page hash navigation: use native browser routing to ensure GSAP ScrollTrigger 
        // properly calculates layout before scrolling to the hash.
        e.preventDefault();
        window.location.href = href;
      }
      return; // Prevent standard Next.js Link behavior for hash links
    }

    if (sharedImageSrc && linkRef.current) {
      e.preventDefault();
      let imgElement = linkRef.current.querySelector('img');
      
      // Fallback: If the link is a button/text, find the image in the parent card container
      if (!imgElement) {
        const container = linkRef.current.closest('article') || linkRef.current.closest('.group');
        if (container) {
          imgElement = container.querySelector('img');
        }
      }

      if (imgElement) {
        navigateToProject(href, imgElement, sharedImageSrc);
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <Link ref={linkRef} href={href} onClick={handleClick} scroll={href.includes('#')} {...rest}>
      {children}
    </Link>
  );
}
