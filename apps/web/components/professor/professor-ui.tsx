"use client";

import { cn } from "@/lib/utils";

interface StatusBannerProps {
  message: string;
  variant: "success" | "error";
  onDismiss?: () => void;
}

export function StatusBanner({ message, variant, onDismiss }: StatusBannerProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 px-4 py-3 text-sm font-bold mb-4",
        variant === "success"
          ? "border-primary bg-primary-container text-on-primary-container"
          : "border-error bg-error-container text-on-error-container"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span>{message}</span>
        {onDismiss && (
          <button type="button" onClick={onDismiss} className="opacity-70 hover:opacity-100">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

interface PublishedBadgeProps {
  published: boolean;
}

export function PublishedBadge({ published }: PublishedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
        published
          ? "bg-primary-container text-on-primary-container"
          : "bg-surface-variant text-secondary"
      )}
    >
      {published ? "Publicado" : "Rascunho"}
    </span>
  );
}
