import type { Metadata } from "next";
import Script from "next/script";
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

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://bin.gopretstudio.com"),
  title: {
    default: "BIN Tools - Generate & Validate Card Numbers Online",
    template: "%s | BIN Tools",
  },
  description:
    "Free online BIN generator and card validator powered by the Luhn algorithm. Generate hundreds of test card numbers, validate in real-time with parallel batch processing, and export results instantly as CSV, TSV, TXT, or Excel.",
  keywords: [
    "BIN generator",
    "BIN checker",
    "card number generator",
    "luhn algorithm",
    "credit card validator",
    "BIN lookup",
    "card testing tool",
    "generate card numbers",
    "validate card numbers",
    "BIN tools online",
  ],
  authors: [{ name: "codeprem", url: "https://whatsapp.com/channel/0029Vb87FE4IiRorN9kW6b3Z" }],
  creator: "codeprem",
  publisher: "gopretstudio",
  alternates: {
    canonical: "https://bin.gopretstudio.com",
  },
  openGraph: {
    title: "BIN Tools - Generate & Validate Card Numbers Online",
    description:
      "Free BIN generator with Luhn algorithm, real-time parallel validation, and instant export. The fastest way to generate and check test card numbers.",
    type: "website",
    url: "https://bin.gopretstudio.com",
    siteName: "BIN Tools",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIN Tools - Generate & Validate Cards",
    description:
      "Free online BIN generator and validator with real-time parallel checking and instant export.",
    creator: "@codeprem",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
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
      <head>
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>
          </>
        )}

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "BIN Tools",
              url: "https://bin.gopretstudio.com",
              description:
                "Free online BIN generator and card validator powered by the Luhn algorithm with real-time parallel validation.",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "codeprem",
                url: "https://whatsapp.com/channel/0029Vb87FE4IiRorN9kW6b3Z",
              },
            }),
          }}
        />
      </head>
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
