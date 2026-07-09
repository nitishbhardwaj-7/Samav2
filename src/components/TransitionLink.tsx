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
    <Link ref={linkRef} href={href} onClick={handleClick} scroll={false} {...rest}>
      {children}
    </Link>
  );
}
