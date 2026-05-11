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
      pulse: false,
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
      pulse: false,
    },
    {
      label: "Unknown",
      value: stats.unknown,
      icon: HelpCircleIcon,
      iconClass: "text-amber-500",
      bgClass: "from-amber-500/10 to-yellow-500/5",
      ringClass: "ring-amber-500/20",
      glow: "shadow-amber-500/10",
      pulse: false,
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
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
              "relative overflow-hidden bg-card/60 backdrop-blur-xl ring-1 transition-shadow hover:shadow-lg py-0",
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
            <CardContent className="relative p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
                <motion.div
                  className="flex size-6 items-center justify-center rounded-md bg-background/60"
                  animate={item.pulse ? { scale: [1, 1.15, 1] } : undefined}
                  transition={
                    item.pulse
                      ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                      : undefined
                  }
                >
                  <item.icon className={cn("size-3.5", item.iconClass)} />
                </motion.div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tabular-nums tracking-tight">
                  <CountUp value={item.value} />
                </span>
                {stats.total > 0 && (
                  <span className="text-[11px] text-muted-foreground">
                    / {stats.total}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
