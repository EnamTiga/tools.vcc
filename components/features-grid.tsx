"use client";

import { motion } from "motion/react";
import {
  ZapIcon,
  LockIcon,
  GaugeIcon,
  DownloadIcon,
  LayersIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { easeOutExpo, fadeInUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  iconBg: string;
}

const features: Feature[] = [
  {
    icon: ZapIcon,
    title: "Parallel Processing",
    description:
      "Cards are checked in parallel per batch. Hundreds of cards can be validated in a matter of seconds.",
    accent: "from-amber-500/20 to-orange-500/5",
    iconBg: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: GaugeIcon,
    title: "Real-time Progress",
    description:
      "Live progress bar, stats dashboard, and live cards table that update instantly as each batch completes.",
    accent: "from-sky-500/20 to-blue-500/5",
    iconBg: "bg-sky-500/10 text-sky-500",
  },
  {
    icon: LockIcon,
    title: "Client-side Generate",
    description:
      "Card generation uses the Luhn algorithm in the browser. Card numbers never leave your device during the generation phase.",
    accent: "from-emerald-500/20 to-green-500/5",
    iconBg: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: LayersIcon,
    title: "Batch Configurable",
    description:
      "Batch size and delay between batches are configured via environment variables. Not exposed in the UI for stability.",
    accent: "from-violet-500/20 to-purple-500/5",
    iconBg: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: DownloadIcon,
    title: "Instant Export",
    description:
      "Export results to TSV or CSV with a single click, or copy straight to the clipboard in tab-separated format.",
    accent: "from-rose-500/20 to-pink-500/5",
    iconBg: "bg-rose-500/10 text-rose-500",
  },
  {
    icon: SparklesIcon,
    title: "Modern UI",
    description:
      "Built with Next.js 16, shadcn/ui, and Tailwind 4. Dark mode first, responsive, and smooth animations.",
    accent: "from-indigo-500/20 to-blue-500/5",
    iconBg: "bg-indigo-500/10 text-indigo-500",
  },
];

export function FeaturesGrid() {
  return (
    <motion.section
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={stagger(0.1, 0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {features.map((f) => (
        <motion.div
          key={f.title}
          variants={fadeInUp}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.3, ease: easeOutExpo }}
        >
          <Card className="group relative h-full overflow-hidden border-border/60 bg-card/40 backdrop-blur-sm transition-colors hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 bg-linear-to-br opacity-40 transition-opacity group-hover:opacity-70",
                f.accent,
              )}
            />
            <CardContent className="relative p-5">
              <motion.div
                className={cn(
                  "mb-3 flex size-10 items-center justify-center rounded-lg ring-1 ring-inset ring-border/50",
                  f.iconBg,
                )}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5, ease: easeOutExpo }}
              >
                <f.icon className="size-5" />
              </motion.div>
              <h3 className="text-sm font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.section>
  );
}
