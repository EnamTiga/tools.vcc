"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CopyIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  CheckIcon,
  CreditCardIcon,
  InboxIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CardResult } from "@/lib/types";
import {
  copyToClipboard,
  downloadTextFile,
  resultsToCSV,
  resultsToTSV,
} from "@/lib/exporters";
import { cn } from "@/lib/utils";
import { fadeInUp, easeOutExpo, slideInFromRight } from "@/lib/motion";

interface LiveCardsTableProps {
  liveResults: CardResult[];
}

export function LiveCardsTable({ liveResults }: LiveCardsTableProps) {
  const [copied, setCopied] = useState(false);
  const empty = liveResults.length === 0;

  const handleCopy = async () => {
    const tsv = resultsToTSV(liveResults);
    const ok = await copyToClipboard(tsv);
    if (ok) {
      toast.success(`Copied ${liveResults.length} cards to clipboard`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy - try export instead");
    }
  };

  const handleExportTSV = () => {
    downloadTextFile(
      resultsToTSV(liveResults),
      `live-cards-${timestamp()}.tsv`,
      "text/tab-separated-values",
    );
    toast.success(`Exported ${liveResults.length} cards as TSV`);
  };

  const handleExportCSV = () => {
    downloadTextFile(
      resultsToCSV(liveResults),
      `live-cards-${timestamp()}.csv`,
      "text/csv",
    );
    toast.success(`Exported ${liveResults.length} cards as CSV`);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <Card className="border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-md bg-emerald-500/30 blur-md" />
              <div className="relative flex size-9 items-center justify-center rounded-md bg-linear-to-br from-emerald-500 to-green-600 text-white shadow-md">
                <CreditCardIcon className="size-4" />
              </div>
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Live Cards
                {liveResults.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                      {liveResults.length}
                    </Badge>
                  </motion.div>
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                Only successfully validated cards appear here
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileTap={{ scale: 0.92 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    disabled={empty}
                    className="gap-1.5"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="size-3.5 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <CopyIcon className="size-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Copy as TSV (Tab-Separated)</p>
              </TooltipContent>
            </Tooltip>

            <motion.div whileTap={{ scale: 0.92 }}>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportTSV}
                disabled={empty}
                className="gap-1.5"
              >
                <FileTextIcon className="size-3.5" />
                TSV
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.92 }}>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportCSV}
                disabled={empty}
                className="gap-1.5"
              >
                <FileSpreadsheetIcon className="size-3.5" />
                CSV
              </Button>
            </motion.div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-0">
          {empty ? (
            <EmptyState />
          ) : (
            <div className="max-h-[480px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card/80 backdrop-blur">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[60px] text-[10px] font-semibold uppercase tracking-wider">
                      #
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase tracking-wider">
                      Card
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase tracking-wider">
                      Bank
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase tracking-wider">
                      Brand
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase tracking-wider hidden md:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase tracking-wider hidden lg:table-cell">
                      Country
                    </TableHead>
                    <TableHead className="text-[10px] font-semibold uppercase tracking-wider">
                      Message
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence initial={false}>
                    {liveResults.map((r, i) => (
                      <CardRow key={`${r.card}-${i}`} index={i + 1} result={r} custom={i} />
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CardRow({ index, result, custom }: { index: number; result: CardResult; custom: number }) {
  const parts = result.card.split("|");
  const [num, mm, yyyy, cvv] = parts;
  const yy = yyyy?.slice(-2) ?? "";

  return (
    <motion.tr
      className={cn("font-mono text-xs border-b border-border/50 transition-colors hover:bg-muted/50")}
      variants={slideInFromRight}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      custom={custom}
      layout
    >
      <TableCell className="text-muted-foreground tabular-nums">
        {index}
      </TableCell>
      <TableCell className="font-mono whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="tabular-nums">{num}</span>
          <span className="text-muted-foreground text-[10px]">
            {mm}/{yy}
          </span>
          <Badge variant="outline" className="text-[9px] h-4 font-mono">
            CVV {cvv}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="text-xs">
        <span className="text-foreground truncate block max-w-[180px]">
          {result.bank}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-[10px] font-mono uppercase">
          {result.brand}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground text-xs capitalize">
        {result.category}
      </TableCell>
      <TableCell className="hidden lg:table-cell text-lg">
        {result.country || "-"}
      </TableCell>
      <TableCell>
        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] truncate block max-w-[220px]">
          {result.message}
        </span>
      </TableCell>
    </motion.tr>
  );
}

function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-14 px-4 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted/50">
        <InboxIcon className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-3 text-sm font-medium">No live cards yet</p>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm">
        Live cards will appear here in real-time as they are validated. Start by
        filling out the form and hitting{" "}
        <span className="font-semibold">Start Check</span>.
      </p>
    </motion.div>
  );
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours(),
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
