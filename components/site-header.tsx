"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { easeOutExpo } from "@/lib/motion";

export function SiteHeader() {
  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
          >
            <div className="absolute inset-0 rounded-lg bg-linear-to-br from-primary to-chart-4 opacity-50 blur-md transition-opacity group-hover:opacity-80" />
            <div className="relative flex size-9 items-center justify-center rounded-lg shadow-md overflow-hidden">
              <img src="/logo.svg" alt="BIN Tools" className="size-9" />
            </div>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-none tracking-tight">
              BIN Tools
            </span>
            <span className="text-[10px] text-muted-foreground leading-none mt-1">
              Generator & Checker
            </span>
          </div>
          <Badge
            variant="secondary"
            className="ml-2 hidden sm:inline-flex text-[10px] h-5"
          >
            v2.0
          </Badge>
        </Link>

        <div className="flex items-center gap-1">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-lg"
              asChild
              aria-label="Join WhatsApp Channel"
            >
              <a
                href="https://whatsapp.com/channel/0029Vb87FE4IiRorN9kW6b3Z"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircleIcon className="size-[18px]" />
              </a>
            </Button>
          </motion.div>
          <div className="mx-1 h-5 w-px bg-border/60" />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
