import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bin-tools.example.com"),
  title: {
    default: "BIN Tools - Generate & Validate Cards",
    template: "%s | BIN Tools",
  },
  description:
    "Modern BIN generator powered by the Luhn algorithm with real-time validation. Generate hundreds of cards at once, check statuses in parallel, and export results in seconds.",
  keywords: [
    "BIN",
    "generator",
    "luhn algorithm",
    "card validator",
    "tools",
  ],
  authors: [{ name: "BIN Tools" }],
  openGraph: {
    title: "BIN Tools - Generate & Validate Cards",
    description:
      "Modern BIN generator with Luhn algorithm & real-time card validation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIN Tools",
    description: "Modern BIN generator & validator.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="relative min-h-svh overflow-x-hidden bg-background font-sans">
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            {/* Ambient background orbs */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            >
              <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[800px] rounded-full bg-linear-to-br from-primary/5 via-chart-4/5 to-chart-2/5 blur-3xl" />
            </div>

            <ErrorBoundary>
              {children}
            </ErrorBoundary>

            <Toaster position="top-right" richColors closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
