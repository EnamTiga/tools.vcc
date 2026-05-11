"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "motion/react";
import {
  PlayIcon,
  StopCircleIcon,
  RotateCcwIcon,
  CalendarIcon,
  KeyIcon,
  HashIcon,
  Loader2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent, 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { CheckerStatus, FormValues } from "@/lib/types";
import { cn } from "@/lib/utils";
import { fadeInUp, stagger, easeOutExpo } from "@/lib/motion";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const schema = z
  .object({
    bin: z
      .string()
      .min(1, "Card number is required")
      .refine(
        (val) => /^[0-9xX\s-]+$/.test(val),
        "Only digits and the 'x' wildcard are allowed",
      )
      .refine(
        (val) => val.replace(/[^0-9xX]/g, "").length >= 4,
        "At least 4 BIN digits",
      ),
    count: z.coerce.number().int().min(1, "Minimum 1").max(1000, "Maximum 1000"),
    month: z
      .string()
      .optional()
      .refine((v) => !v || /^\d{1,2}$/.test(v), "Month must be digits only")
      .refine(
        (v) => {
          if (!v) return true;
          const n = parseInt(v, 10);
          return n >= 1 && n <= 12;
        },
        "Month must be between 1-12",
      ),
    year: z
      .string()
      .optional()
      .refine((v) => !v || /^\d{2}$|^\d{4}$/.test(v), "Year must be 2 or 4 digits")
      .refine(
        (v) => {
          if (!v) return true;
          const fullYear = v.length === 2 ? 2000 + parseInt(v, 10) : parseInt(v, 10);
          return fullYear >= currentYear && fullYear <= currentYear + 10;
        },
        `Year must be between ${currentYear} and ${currentYear + 10}`,
      ),
    cvv: z
      .string()
      .optional()
      .refine((v) => !v || /^\d+$/.test(v), "CVV must be digits only")
      .refine(
        (v) => {
          if (!v) return true;
          return v.length >= 3 && v.length <= 4;
        },
        "CVV must be 3 or 4 digits",
      ),
  })
  .superRefine((data, ctx) => {
    // Cross-field: if both month and year are provided, check not expired
    if (data.month && data.year) {
      const mm = parseInt(data.month, 10);
      const fullYear =
        data.year.length === 2
          ? 2000 + parseInt(data.year, 10)
          : parseInt(data.year, 10);

      if (fullYear === currentYear && mm < currentMonth) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card expiry date is in the past",
          path: ["month"],
        });
      }
    }
  });

type Schema = z.infer<typeof schema>;

interface BinFormProps {
  status: CheckerStatus;
  maxCards: number;
  progress: number; // 0-100
  onStart: (values: FormValues) => void;
  onStop: () => void;
  onReset: () => void;
}

export function BinForm({
  status,
  maxCards,
  progress,
  onStart,
  onStop,
  onReset,
}: BinFormProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      bin: "",
      count: 100,
      month: "",
      year: "",
      cvv: "",
    },
  });

  const isRunning = status === "running" || status === "generating";
  const hasRun = status !== "idle";

  const submit = form.handleSubmit((values) => {
    onStart({
      bin: values.bin,
      count: Math.min(values.count ?? 100, maxCards),
      month: values.month || undefined,
      year: values.year || undefined,
      cvv: values.cvv || undefined,
    });
  });

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <Card className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur-xl shadow-xl">
        {/* Accent border glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"
        />

        {/* <CardHeader>
          <div className="flex items-center gap-2">
            <motion.div
              className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20"
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
            >
              <CreditCardIcon className="size-4" />
            </motion.div>
            <div className="flex-1">
              <CardTitle className="text-lg">Generate & Check</CardTitle>
              <CardDescription className="text-xs">
                Enter a BIN and optional fields
              </CardDescription>
            </div>
          </div>
        </CardHeader> */}

        <CardContent>
          <motion.form
            onSubmit={submit}
            className="space-y-5"
            variants={stagger(0.05, 0.06)}
            initial="hidden"
            animate="visible"
          >
            {/* BIN Input - full width & prominent */}
            <motion.div className="space-y-2" variants={fadeInUp}>
              <div className="flex items-center justify-between">
                <Label htmlFor="bin" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Card Number (BIN)
                  <span className="ml-1 text-rose-500">*</span>
                </Label>
                <Tooltip> 
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      Example: <code className="font-mono">625817</code> or{" "}
                      <code className="font-mono">625817xxxxxxxxxx</code>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <HashIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="bin"
                  placeholder="xxxxxx"
                  className="pl-9 font-mono tracking-wider h-11"
                  disabled={isRunning}
                  {...form.register("bin")}
                />
              </div>
              {form.formState.errors.bin && (
                <p className="text-xs text-rose-500">
                  {form.formState.errors.bin.message}
                </p>
              )}
            </motion.div>

            {/* Count */}
            <motion.div className="space-y-2" variants={fadeInUp}>
              <Label
                htmlFor="count"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Card Count 
                  <span className="ml-1 text-rose-500">*</span>
              </Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={maxCards}
                placeholder="100"
                className="h-11"
                disabled={isRunning}
                {...form.register("count")}
              />
              {form.formState.errors.count && (
                <p className="text-xs text-rose-500">
                  {form.formState.errors.count.message}
                </p>
              )}
            </motion.div>

            <Separator />

            {/* Optional fields */}
            <motion.div className="space-y-3" variants={fadeInUp}> 

              <div className="grid grid-cols-3 gap-3">
                {/* Month */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="month"
                    className="text-[10px] text-muted-foreground flex items-center gap-1"
                  >
                    <CalendarIcon className="size-3" />
                    MONTH
                  </Label>
                  <Input
                    id="month"
                    placeholder="MM"
                    maxLength={2}
                    className="h-11 text-center font-mono"
                    disabled={isRunning}
                    {...form.register("month")}
                  />
                </div>

                {/* Year */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="year"
                    className="text-[10px] text-muted-foreground flex items-center gap-1"
                  >
                    <CalendarIcon className="size-3" />
                    YEAR
                  </Label>
                  <Input
                    id="year"
                    placeholder="YY / YYYY"
                    maxLength={4}
                    className="h-11 text-center font-mono"
                    disabled={isRunning}
                    {...form.register("year")}
                  />
                </div>

                {/* CVV */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="cvv"
                    className="text-[10px] text-muted-foreground flex items-center gap-1"
                  >
                    <KeyIcon className="size-3" />
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    maxLength={4}
                    className="h-11 text-center font-mono"
                    disabled={isRunning}
                    {...form.register("cvv")}
                  />
                </div>
              </div>

              {(form.formState.errors.month ||
                form.formState.errors.year ||
                form.formState.errors.cvv) && (
                <p className="text-xs text-rose-500">
                  {form.formState.errors.month?.message ||
                    form.formState.errors.year?.message ||
                    form.formState.errors.cvv?.message}
                </p>
              )}
            </motion.div>

            <Separator />

            {/* Actions */}
            <motion.div className="flex gap-2" variants={fadeInUp}>
              {isRunning ? (
                <>
                  {/* Progress button */}
                  <div className="relative flex-1 h-11 rounded-lg overflow-hidden">
                    {/* Background track */}
                    <div className="absolute inset-0 bg-primary/10 rounded-lg" />
                    {/* Animated fill */}
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-linear-to-r from-primary via-chart-3 to-chart-4 rounded-lg"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: easeOutExpo }}
                    />
                    {/* Shimmer overlay */}
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-white/10 rounded-lg"
                      animate={{ width: `${progress}%`, opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Text */}
                    <div className="relative flex items-center justify-center h-full text-sm font-semibold text-foreground">
                      <Loader2Icon className="size-3.5 animate-spin mr-2" />
                      {status === "generating" ? "Generating..." : `${progress.toFixed(0)}%`}
                    </div>
                  </div>
                  {/* Stop button - small */}
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onStop();
                      }}
                      className="h-11 w-11 p-0"
                      size="icon"
                      aria-label="Stop"
                    >
                      <StopCircleIcon className="size-4" />
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Start button */}
                  <motion.div className="flex-1" whileTap={{ scale: 0.96 }}>
                    <Button
                      type="submit"
                      className={cn(
                        "w-full h-11 text-sm font-semibold",
                        "bg-linear-to-br from-primary via-primary to-chart-4",
                        "hover:shadow-lg hover:shadow-primary/20 transition-all",
                      )}
                      size="lg"
                    >
                      <PlayIcon className="size-4" />
                      {hasRun ? "Run Again" : "Start Check"}
                    </Button>
                  </motion.div>
                  {/* Reset button */}
                  {hasRun && (
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onReset}
                        className="h-11 w-11 p-0"
                        size="icon"
                        aria-label="Reset"
                      >
                        <RotateCcwIcon className="size-4" />
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
