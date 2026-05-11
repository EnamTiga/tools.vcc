"use client";

/**
 * Main hook that orchestrates:
 *  1. BIN card generation (pure client)
 *  2. Batched checking via /api/check
 *  3. Live state updates for UI
 *
 * Composed from smaller hooks for separation of concerns.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import { generateUniqueCards, parseBinTemplate } from "@/lib/card";
import { runBatchedCheck } from "@/lib/api-client";
import { BATCH_SIZE, BATCH_DELAY_MS, MAX_CARDS_TOTAL } from "@/lib/env";
import type {
  CardResult,
  CheckerStats,
  CheckerStatus,
  FormValues,
} from "@/lib/types";
import { useTimer } from "./use-timer";

const EMPTY_STATS: CheckerStats = {
  total: 0,
  done: 0,
  live: 0,
  die: 0,
  unknown: 0,
};

export interface UseBinCheckerReturn {
  status: CheckerStatus;
  stats: CheckerStats;
  results: CardResult[];
  liveResults: CardResult[];
  error: string | null;
  elapsedMs: number;
  batchSize: number;
  batchDelayMs: number;
  maxCardsTotal: number;
  start: (values: FormValues) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export function useBinChecker(): UseBinCheckerReturn {
  const [status, setStatus] = useState<CheckerStatus>("idle");
  const [stats, setStats] = useState<CheckerStats>(EMPTY_STATS);
  const [results, setResults] = useState<CardResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const timer = useTimer();
  const abortRef = useRef<AbortController | null>(null);

  const liveResults = useMemo(
    () => results.filter((r) => r.status === "Live"),
    [results],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    timer.reset();
    setStatus("idle");
    setStats(EMPTY_STATS);
    setResults([]);
    setError(null);
  }, [timer]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStatus("stopped");
    timer.stop();
  }, [timer]);

  const start = useCallback(
    async (values: FormValues) => {
      // ── Validate & clamp input ──────────────────────────────────────────
      const binTemplate = parseBinTemplate(values.bin);
      if (!binTemplate) {
        setError("BIN number is required");
        setStatus("error");
        return;
      }

      const count = Math.max(
        1,
        Math.min(MAX_CARDS_TOTAL, values.count || 100),
      );

      // ── Reset state & start ─────────────────────────────────────────────
      setError(null);
      setResults([]);
      setStats({ ...EMPTY_STATS });
      setStatus("generating");
      timer.start();

      // ── Generate cards (pure, fast) ────────────────────────────────────
      let cards: string[] = [];
      try {
        cards = generateUniqueCards(binTemplate, count, {
          month: values.month,
          year: values.year,
          cvv: values.cvv,
        });
      } catch (err) {
        timer.stop();
        setError((err as Error).message);
        setStatus("error");
        return;
      }

      if (cards.length === 0) {
        timer.stop();
        setError("Failed to generate cards");
        setStatus("error");
        return;
      }

      setStats({ ...EMPTY_STATS, total: cards.length });
      setStatus("running");

      // ── Run batched checks ──────────────────────────────────────────────
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await runBatchedCheck({
          cards,
          batchSize: BATCH_SIZE,
          delayMs: BATCH_DELAY_MS,
          signal: controller.signal,
          onBatchDone: (batch) => {
            setResults((prev) => [...prev, ...batch]);
            setStats((prev) => {
              const next = { ...prev };
              for (const r of batch) {
                next.done += 1;
                if (r.status === "Live") next.live += 1;
                else if (r.status === "Die") next.die += 1;
                else next.unknown += 1;
              }
              return next;
            });
          },
        });

        // Distinguish natural completion from user stop
        if (!controller.signal.aborted) {
          setStatus("done");
        }
      } catch (err) {
        const e = err as Error;
        if (e.name !== "AbortError") {
          setError(e.message);
          setStatus("error");
        }
      } finally {
        abortRef.current = null;
        timer.stop();
      }
    },
    [timer],
  );

  return {
    status,
    stats,
    results,
    liveResults,
    error,
    elapsedMs: timer.elapsedMs,
    batchSize: BATCH_SIZE,
    batchDelayMs: BATCH_DELAY_MS,
    maxCardsTotal: MAX_CARDS_TOTAL,
    start,
    stop,
    reset,
  };
}
