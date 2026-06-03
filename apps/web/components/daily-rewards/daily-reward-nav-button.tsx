"use client";

import { CalendarHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDailyRewardsOptional } from "@/components/daily-rewards/daily-rewards-provider";

export function DailyRewardNavButton() {
  const ctx = useDailyRewardsOptional();
  if (!ctx) return null;

  const { openDailyRewards, canClaimDaily } = ctx;

  return (
    <button
      type="button"
      onClick={openDailyRewards}
      aria-label={
        canClaimDaily
          ? "Abrir recompensas diárias — recompensa disponível"
          : "Abrir recompensas diárias"
      }
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-surface-variant bg-surface-container-low text-primary bouncy-transition hover:bg-primary-container/30",
        canClaimDaily && "border-primary bg-primary-container/20 animate-pulse"
      )}
    >
      <CalendarHeart className="h-5 w-5" />
      {canClaimDaily && (
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-error border-2 border-surface" />
      )}
    </button>
  );
}
