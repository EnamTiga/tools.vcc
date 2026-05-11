"use client";

import { motion } from "motion/react";
import { SparklesIcon, ZapIcon, ShieldCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { easeOutExpo, fadeInUp, stagger } from "@/lib/motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated backdrop glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <motion.div
          className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-linear-to-br from-primary/30 via-chart-4/20 to-chart-2/30 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [0.9, 1.05, 0.9],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[5%] top-[10%] h-[280px] w-[280px] rounded-full bg-rose-400/10 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="container mx-auto px-4 py-16 md:py-24 md:px-6 text-center"
        variants={stagger(0.1, 0.15)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp}>
          <Badge
            variant="outline"
            className="mb-6 gap-1.5 border-primary/30 bg-primary/5 py-1.5 px-4 backdrop-blur"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <SparklesIcon className="size-3 text-primary" />
            </motion.span>
            <span className="text-xs font-medium">
              Powered by Luhn Algorithm & chkr.cc
            </span>
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="bg-linear-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            Generate & Validate
          </span>
          <br />
          <motion.span
            className="bg-linear-to-br from-primary via-chart-3 to-chart-4 bg-clip-text text-transparent inline-block"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Card Numbers
          </motion.span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Modern BIN generator powered by the Luhn algorithm with real-time
          validation. Generate hundreds of cards at once, check their status in
          parallel, and export results in seconds.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground"
        >
          {[
            { icon: ZapIcon, label: "Parallel Processing", color: "text-amber-500" },
            { icon: ShieldCheckIcon, label: "100% Client-side Generate", color: "text-emerald-500" },
            { icon: SparklesIcon, label: "Instant Export", color: "text-sky-500" },
          ].map((item) => (
            <motion.div
              key={item.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 backdrop-blur"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2, ease: easeOutExpo }}
            >
              <item.icon className={`size-3 ${item.color}`} />
              <span>{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
