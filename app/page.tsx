"use client";

import { useBinChecker } from "@/hooks/use-bin-checker";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/hero-section";
import { BinForm } from "@/components/bin-form";
import { FeaturesGrid } from "@/components/features-grid";
import { StatsDashboard } from "@/components/stats-dashboard";
import { ProgressSection } from "@/components/progress-section";
import { LiveCardsTable } from "@/components/live-cards-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function Page() {
  const checker = useBinChecker();

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />

        <div className="container mx-auto px-4 md:px-6 pb-16">
          {/* Two-column: form + features */}
          <section className="grid gap-6 lg:grid-cols-5 lg:gap-8">
            <div className="lg:col-span-2">
              <BinForm
                status={checker.status}
                maxCards={checker.maxCardsTotal}
                onStart={checker.start}
                onStop={checker.stop}
                onReset={checker.reset}
              />
            </div>
            <div className="lg:col-span-3">
              <FeaturesGrid />
            </div>
          </section>

          {/* Error alert */}
          {checker.error && (
            <Alert
              variant="destructive"
              className="mt-6 border-rose-500/30 bg-rose-500/5 backdrop-blur"
            >
              <AlertCircleIcon className="size-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{checker.error}</AlertDescription>
            </Alert>
          )}

          {/* Dashboard: stats + progress */}
          <section className="mt-10 space-y-4">
            <StatsDashboard stats={checker.stats} />
            <ProgressSection
              stats={checker.stats}
              status={checker.status}
              elapsedMs={checker.elapsedMs}
              batchSize={checker.batchSize}
            />
          </section>

          {/* Live cards table */}
          <section className="mt-6">
            <LiveCardsTable liveResults={checker.liveResults} />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
