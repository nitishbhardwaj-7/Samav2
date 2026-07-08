"use client";

import { type AnchorHTMLAttributes } from "react";
import Link from "next/link";

interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: React.ReactNode;
  sharedImageSrc?: string;
  sharedImageBorderRadius?: string;
}

/**
 * TransitionLink
 * 
 * Restored to standard native Next.js Link routing.
 */
export default function TransitionLink({
  href,
  children,
  sharedImageSrc,
  sharedImageBorderRadius,
  onClick,
  ...rest
}: TransitionLinkProps) {
  return (
    <Link href={href} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
