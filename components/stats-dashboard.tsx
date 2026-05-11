"use client";

import { motion } from "motion/react";
import {
  CreditCardIcon,
  CheckCircle2Icon,
  XCircleIcon,
  HelpCircleIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CountUp } from "@/components/count-up";
import { easeOutExpo, fadeInUp, stagger } from "@/lib/motion";
import type { CheckerStats } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatsDashboardProps {
  stats: CheckerStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const items = [
    {
      label: "Total",
      value: stats.total,
      icon: CreditCardIcon,
      iconClass: "text-sky-500",
      bgClass: "from-sky-500/10 to-blue-500/5",
      ringClass: "ring-sky-500/20",
      glow: "shadow-sky-500/10",
    },
    {
      label: "Live",
      value: stats.live,
      icon: CheckCircle2Icon,
      iconClass: "text-emerald-500",
      bgClass: "from-emerald-500/10 to-green-500/5",
      ringClass: "ring-emerald-500/20",
      glow: "shadow-emerald-500/10",
      pulse: stats.live > 0,
    },
    {
      label: "Die",
      value: stats.die,
      icon: XCircleIcon,
      iconClass: "text-rose-500",
      bgClass: "from-rose-500/10 to-red-500/5",
      ringClass: "ring-rose-500/20",
      glow: "shadow-rose-500/10",
    },
    {
      label: "Unknown",
      value: stats.unknown,
      icon: HelpCircleIcon,
      iconClass: "text-amber-500",
      bgClass: "from-amber-500/10 to-yellow-500/5",
      ringClass: "ring-amber-500/20",
      glow: "shadow-amber-500/10",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4"
      variants={stagger(0.05, 0.08)}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.div
          key={item.label}
          variants={fadeInUp}
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.25, ease: easeOutExpo }}
        >
          <Card
            className={cn(
              "relative overflow-hidden bg-card/60 backdrop-blur-xl ring-1 transition-shadow hover:shadow-lg",
              item.ringClass,
              item.glow,
            )}
          >
            <motion.div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 bg-linear-to-br opacity-60",
                item.bgClass,
              )}
              animate={
                item.pulse
                  ? { opacity: [0.4, 0.8, 0.4] }
                  : undefined
              }
              transition={
                item.pulse
                  ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
            />
            <CardContent className="relative p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
                <motion.div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md bg-background/60",
                  )}
                  animate={item.pulse ? { scale: [1, 1.15, 1] } : undefined}
                  transition={
                    item.pulse
                      ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                      : undefined
                  }
                >
                  <item.icon className={cn("size-4", item.iconClass)} />
                </motion.div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums tracking-tight">
                  <CountUp value={item.value} />
                </span>
                {item.label !== "Total" && stats.total > 0 && (
                  <span className="text-xs text-muted-foreground">
                    / {stats.total}
                  </span>
                )}
              </div>
              {item.label === "Live" && stats.total > 0 && (
                <div className="mt-1.5 text-[10px] text-muted-foreground">
                  {((stats.live / stats.total) * 100).toFixed(1)}% hit rate
                </div>
              )}
              {item.label === "Total" && (
                <div className="mt-1.5 text-[10px] text-muted-foreground">
                  {stats.done > 0 && stats.total > 0
                    ? `${stats.done} processed`
                    : "Ready to start"}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
