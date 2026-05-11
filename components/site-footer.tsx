"use client";

import { motion } from "motion/react";
import { HeartIcon } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

export function SiteFooter() {
  return (
    <motion.footer
      className="border-t border-border/40 bg-background/50 backdrop-blur-xl"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-8 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left md:px-6">
        <p className="flex items-center gap-1.5">
          Built with{" "}
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <HeartIcon className="size-3 fill-rose-500 text-rose-500" />
          </motion.span>{" "}
          using Next.js, shadcn/ui & Tailwind CSS
        </p>
        <p>
          © {new Date().getFullYear()} BIN Tools - For educational & testing use only
        </p>
      </div>
    </motion.footer>
  );
}
