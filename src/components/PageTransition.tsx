"use client";

import { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Transition Context ──────────────────────────────────────────────
interface TransitionContextType {
  navigateTo: (href: string, sharedElement?: any) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

// ─── Provider (Restored to Native Routing) ───────────────────────────
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const navigateTo = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return (
    <TransitionContext.Provider value={{ navigateTo, isTransitioning: false }}>
      {children}
    </TransitionContext.Provider>
  );
}
