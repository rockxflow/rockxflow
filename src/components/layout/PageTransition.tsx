"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Route-level transition. Remount-per-navigation is handled by app/template,
 * so this only owns the entrance: 0.4s fade + 8px rise, no exit animation
 * (avoids the double-paint feel of full AnimatePresence route swaps).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!reduce) window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, reduce]);

  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 0.61, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}
