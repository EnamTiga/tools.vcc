"use client";

import React from "react";
import { AlertCircleIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global error boundary that catches unhandled runtime errors
 * and displays a user-friendly fallback UI.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircleIcon className="size-7 text-destructive" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              An unexpected error occurred. Please try again or refresh the page.
            </p>
            {this.state.error && (
              <p className="mt-2 max-w-md rounded-md bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
                {this.state.error.message}
              </p>
            )}
          </div>
          <Button onClick={this.handleReset} variant="outline" className="gap-2">
            <RotateCcwIcon className="size-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
