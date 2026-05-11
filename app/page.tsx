"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useBinChecker } from "@/hooks/use-bin-checker";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BinForm } from "@/components/bin-form";
import { StatsDashboard } from "@/components/stats-dashboard";
import { LiveCardsTable } from "@/components/live-cards-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, ZapIcon, ShieldCheckIcon, DownloadIcon } from "lucide-react";
import { fadeInUp, stagger, easeOutExpo } from "@/lib/motion";
import type { CardResult } from "@/lib/types";

export default function Page() {
  const checker = useBinChecker();
  const [activeTab, setActiveTab] = useState<"live" | "die" | "unknown">("live");

  const filteredResults: CardResult[] = checker.results.filter((r) => {
    if (activeTab === "live") return r.status === "Live";
    if (activeTab === "die") return r.status === "Die";
    return r.status === "Unknown";
  });

  const hasResults = checker.results.length > 0;

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Hero text - compact */}
          <motion.div
            className="mx-auto max-w-2xl text-center mb-10"
            variants={stagger(0.08, 0.12)}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              <span className="bg-linear-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Generate & Validate
              </span>{" "}
              <span className="bg-linear-to-br from-primary via-chart-3 to-chart-4 bg-clip-text text-transparent">
                Card Numbers
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-3 text-sm text-muted-foreground leading-relaxed sm:text-base"
            >
              BIN generator powered by the Luhn algorithm with real-time parallel validation.
              Generate, check, and export results in seconds.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
            >
              {[
                { icon: ZapIcon, label: "Parallel Processing", color: "text-amber-500" },
                { icon: ShieldCheckIcon, label: "Client-side Generate", color: "text-emerald-500" },
                { icon: DownloadIcon, label: "Instant Export", color: "text-sky-500" },
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

          {/* Stats - only visible during/after check */}
          <AnimatePresence>
            {checker.status !== "idle" && (
              <motion.section
                className="mx-auto max-w-xl mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <StatsDashboard stats={checker.stats} />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Form - centered */}
          <section className="mx-auto max-w-xl mt-4">
            <BinForm
              status={checker.status}
              maxCards={checker.maxCardsTotal}
              progress={checker.stats.total > 0 ? (checker.stats.done / checker.stats.total) * 100 : 0}
              onStart={checker.start}
              onStop={checker.stop}
              onReset={checker.reset}
            />
          </section>

          {/* Error alert */}
          {checker.error && (
            <Alert
              variant="destructive"
              className="mx-auto mt-6 max-w-xl border-rose-500/30 bg-rose-500/5 backdrop-blur"
            >
              <AlertCircleIcon className="size-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{checker.error}</AlertDescription>
            </Alert>
          )}

          {/* Results with tabs - only show when there are results */}
          <AnimatePresence>
            {hasResults && (
              <motion.section
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
              >
                {/* Tabs */}
                <div className="mx-auto max-w-xl mb-4 flex items-center gap-1 rounded-lg border border-border/60 bg-card/60 backdrop-blur p-1">
                  <TabButton
                    active={activeTab === "live"}
                    onClick={() => setActiveTab("live")}
                    label="Live"
                    count={checker.stats.live}
                    color="text-emerald-500"
                  />
                  <TabButton
                    active={activeTab === "die"}
                    onClick={() => setActiveTab("die")}
                    label="Die"
                    count={checker.stats.die}
                    color="text-rose-500"
                  />
                  <TabButton
                    active={activeTab === "unknown"}
                    onClick={() => setActiveTab("unknown")}
                    label="Unknown"
                    count={checker.stats.unknown}
                    color="text-amber-500"
                  />
                </div>

                <LiveCardsTable liveResults={filteredResults} />
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all ${
        active
          ? "bg-background shadow-sm text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className={active ? color : ""}>{label}</span>
      {count > 0 && (
        <span className={`ml-1.5 tabular-nums text-[10px] ${active ? color : "text-muted-foreground"}`}>
          {count}
        </span>
      )}
    </button>
  );
}
