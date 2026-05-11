/**
 * POST /api/check
 * Server-side proxy that forwards batches of cards to chkr.cc.
 * Avoids browser CORS issues and hides the upstream endpoint from the UI.
 */

import { NextResponse } from "next/server";
import { MAX_CARDS_PER_BATCH } from "@/lib/env";
import { checkCards } from "@/lib/checker-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── Route handler ──────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let body: { cards?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const cards = body.cards;
  if (!Array.isArray(cards) || cards.length === 0) {
    return NextResponse.json(
      { error: "`cards` must be a non-empty array" },
      { status: 400 },
    );
  }

  if (cards.length > MAX_CARDS_PER_BATCH) {
    return NextResponse.json(
      {
        error: `Batch size exceeds limit of ${MAX_CARDS_PER_BATCH} (got ${cards.length})`,
      },
      { status: 400 },
    );
  }

  // All items must be strings
  for (const c of cards) {
    if (typeof c !== "string") {
      return NextResponse.json(
        { error: "All cards must be strings" },
        { status: 400 },
      );
    }
  }

  try {
    const results = await checkCards(cards as string[]);
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message ?? "Upstream error" },
      { status: 502 },
    );
  }
}
