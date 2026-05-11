"use client";

import { motion } from "motion/react";
import { ZapIcon, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CountUp } from "@/components/count-up";
import type { CheckerStats, CheckerStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { fadeInUp, easeOutExpo } from "@/lib/motion";

interface ProgressSectionProps {
  stats: CheckerStats;
  status: CheckerStatus;
  elapsedMs: number;
  batchSize: number;
}

export function ProgressSection({
  stats,
  status,
  elapsedMs, 
}: ProgressSectionProps) {
  if (status === "idle" && stats.total === 0) {
    return null;
  }

  const pct = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;
  const seconds = Math.round(elapsedMs / 100) / 10;
  const rate = elapsedMs > 0 && stats.done > 0
    ? Math.round((stats.done / (elapsedMs / 1000)) * 10) / 10
    : 0;

  const statusMeta: Record<
    CheckerStatus,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon?: LucideIcon }
  > = {
    idle: { label: "Idle", variant: "secondary" },
    generating: { label: "Generating", variant: "outline" },
    running: { label: "Running", variant: "default" },
    stopped: { label: "Stopped", variant: "destructive" },
    done: { label: "Completed", variant: "default" },
    error: { label: "Error", variant: "destructive" },
  };

  const meta = statusMeta[status];

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <Card className="border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden py-0">
        <div
          aria-hidden="true"
          className="h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent"
        />
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <motion.div
                className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary"
                animate={status === "running" ? { scale: [1, 1.2, 1] } : undefined}
                transition={status === "running" ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : undefined}
              >
                <ZapIcon className={cn("size-4")} />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold">Progress</h3>
                <p className="text-[11px] text-muted-foreground">
                  <CountUp value={stats.done} className="tabular-nums" /> / {stats.total} cards processed
                </p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              key={meta.label}
            >
              <Badge variant={meta.variant} className="font-mono text-[10px]">
                {meta.label}
              </Badge>
            </motion.div>
          </div>

          {/* Animated progress bar */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-primary/10">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary via-chart-3 to-chart-4"
              initial={{ width: "0%" }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
            />
            {status === "running" && (
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-white/20"
                animate={{ width: `${pct}%`, opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Stat label="Progress" value={pct} suffix="%" />
            <Stat label="Elapsed" value={seconds} suffix="s" />
            <Stat label="Rate" value={rate} suffix="/s" />
          </div> 
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <motion.div
      className="rounded-md border border-border/50 bg-background/40 px-2 py-2"
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ duration: 0.2, ease: easeOutExpo }}
    >
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums">
        <CountUp value={Math.round(value * 10) / 10} />
        {suffix}
      </div>
    </motion.div>
  );
}
