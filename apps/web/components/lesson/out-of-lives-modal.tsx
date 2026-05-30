"use client";

import Link from "next/link";
import { Gem, Heart } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { MAX_LIVES } from "@/lib/lesson-lives";

interface OutOfLivesModalProps {
  open: boolean;
  gems: number;
  gemCost: number;
  trackSlug: string;
  refilling: boolean;
  error: string | null;
  canAffordRefill: boolean;
  onRefill: () => void;
}

export function OutOfLivesModal({
  open,
  gems,
  gemCost,
  trackSlug,
  refilling,
  error,
  canAffordRefill,
  onRefill,
}: OutOfLivesModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="out-of-lives-title"
    >
      <div className="card-elevation w-full max-w-md rounded-4xl border-2 border-surface-container-highest bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex justify-center gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Heart key={i} className="h-8 w-8 text-surface-container-highest" />
          ))}
        </div>

        <h2
          id="out-of-lives-title"
          className="text-2xl font-black font-display text-on-background mb-2"
        >
          Suas vidas acabaram!
        </h2>
        <p className="text-on-surface-variant text-sm mb-6">
          Use gemas para continuar esta lição com {MAX_LIVES} vidas novas.
        </p>

        <div className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-secondary-container/20 px-4 py-3">
          <Gem className="h-5 w-5 fill-secondary text-secondary" />
          <span className="font-bold text-on-background">
            Você tem {formatNumber(gems)} gemas
          </span>
        </div>

        {error && (
          <p className="mb-4 text-sm font-bold text-error" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onRefill}
            disabled={refilling || !canAffordRefill}
            className={cn(
              "w-full h-14 rounded-2xl font-bold text-lg bouncy-transition",
              canAffordRefill
                ? "bg-secondary text-on-secondary block-shadow-secondary active:translate-y-1"
                : "bg-surface-container-highest text-on-surface/40 cursor-not-allowed"
            )}
          >
            {refilling ? (
              "Recuperando..."
            ) : (
              <>
                Recuperar vidas ({formatNumber(gemCost)} gemas)
              </>
            )}
          </button>

          {!canAffordRefill && !refilling && (
            <p className="text-xs text-on-surface-variant">
              Você precisa de mais {formatNumber(gemCost - gems)} gemas para recuperar.
            </p>
          )}

          <Link
            href={`/trilhas/${trackSlug}`}
            className="w-full h-12 flex items-center justify-center rounded-2xl border-2 border-surface-container-highest font-bold text-on-surface-variant hover:bg-surface-container-low bouncy-transition"
          >
            Sair da lição
          </Link>
        </div>
      </div>
    </div>
  );
}
