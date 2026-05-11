"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Theme toggle with motion icon swap animation.
 * We render a generic button during SSR (`mounted === false`) and swap in the
 * real icon animation after hydration.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85, rotate: 15 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label="Toggle theme"
        className="relative overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <MoonIcon className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <SunIcon className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}

/**
 * Returns `true` once the component has mounted on the client.
 * Uses `useSyncExternalStore` so the client snapshot differs from the server
 * snapshot without calling `setState` inside an effect.
 */
function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

function subscribeNoop() {
  return () => {};
}
