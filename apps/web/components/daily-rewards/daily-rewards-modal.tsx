"use client";

import { useEffect, useRef } from "react";
import { Check, Gem, Gift, Sparkles, X, Zap } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { ModalPortal } from "@/components/ui/modal-portal";
import { TreasureChestIcon } from "@/components/icons/treasure-chest-icon";
import type { DailyRewardState } from "@/lib/daily-reward-data";
import {
  DailyRewardClaimCelebration,
  type DailyRewardCelebrationPayload,
} from "@/components/daily-rewards/daily-reward-claim-celebration";

interface DailyRewardsModalProps {
  open: boolean;
  onClose: () => void;
  state: DailyRewardState;
  claiming: boolean;
  claimError: string | null;
  celebration: DailyRewardCelebrationPayload | null;
  recentlyClaimedDay: number | null;
  onCelebrationComplete: () => void;
  onClaim: () => void;
}

function RewardDayCard({
  day,
  gems,
  xp,
  status,
  isFinal,
  isClaiming,
  justClaimed,
}: DailyRewardState["days"][number] & {
  isFinal?: boolean;
  isClaiming?: boolean;
  justClaimed?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 p-2 min-h-[5.5rem] transition-all duration-300",
        isFinal && "min-h-[6rem]",
        status === "claimed" &&
          "border-primary/40 bg-primary-container/15 text-on-background",
        status === "available" &&
          "border-primary bg-primary-container/30 shadow-lg ring-2 ring-primary/40 scale-[1.03] z-10",
        status === "locked" &&
          "border-surface-variant bg-surface-container-low opacity-60",
        isClaiming && status === "available" && "daily-reward-claim-shake",
        justClaimed && "daily-reward-card-claimed-flash"
      )}
    >
      <span
        className={cn(
          "text-[10px] font-black uppercase tracking-wide mb-1",
          status === "available" ? "text-primary" : "text-on-surface-variant"
        )}
      >
        Dia {day}
      </span>

      {status === "claimed" ? (
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary",
            justClaimed && "daily-reward-celebrate-pop"
          )}
        >
          <Check className="h-5 w-5" strokeWidth={3} />
        </div>
      ) : isFinal ? (
        <TreasureChestIcon variant="closed" className="h-10 w-10 text-primary" />
      ) : (
        <Gift
          className={cn(
            "h-8 w-8",
            status === "available" ? "text-primary" : "text-on-surface-variant"
          )}
        />
      )}

      <div className="mt-1.5 flex flex-col items-center gap-0.5 text-center">
        {gems > 0 && (
          <span className="flex items-center gap-0.5 text-[11px] font-extrabold text-secondary">
            <Gem className="h-3 w-3 fill-secondary shrink-0" />
            {formatNumber(gems)}
          </span>
        )}
        {xp > 0 && (
          <span className="flex items-center gap-0.5 text-[11px] font-extrabold text-primary">
            <Zap className="h-3 w-3 shrink-0" />
            {formatNumber(xp)}
          </span>
        )}
      </div>
    </div>
  );
}

export function DailyRewardsModal({
  open,
  onClose,
  state,
  claiming,
  claimError,
  celebration,
  recentlyClaimedDay,
  onCelebrationComplete,
  onClaim,
}: DailyRewardsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const inCelebration = celebration !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !claiming && !inCelebration) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, claiming, inCelebration]);

  if (!open) return null;

  const currentTier = state.days.find((d) => d.day === state.currentDay);
  const justClaimedDay = recentlyClaimedDay;

  return (
    <ModalPortal>
      <div
        className={cn(
          "fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm transition-colors duration-300",
          inCelebration ? "bg-on-background/85" : "bg-on-background/70"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-rewards-title"
        onClick={(e) => {
          if (e.target === e.currentTarget && !claiming && !inCelebration) onClose();
        }}
      >
        <div
          ref={dialogRef}
          className={cn(
            "card-elevation w-full sm:max-w-lg max-h-[92vh] flex flex-col rounded-t-4xl sm:rounded-4xl border-2 border-surface-container-highest bg-surface overflow-hidden pointer-events-auto transition-transform duration-300",
            inCelebration && "scale-[1.02] border-primary/30"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {!inCelebration && (
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b-2 border-surface-variant shrink-0 bg-gradient-to-b from-primary-container/20 to-transparent">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2
                    id="daily-rewards-title"
                    className="text-xl font-black font-display text-on-background"
                  >
                    Recompensas diárias
                  </h2>
                </div>
                <p className="text-sm text-on-surface-variant">
                  Entre por 7 dias seguidos e ganhe prêmios cada vez melhores!
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={claiming}
                className="rounded-xl p-2 text-on-surface-variant hover:bg-surface-variant bouncy-transition disabled:opacity-50"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {inCelebration && celebration ? (
            <DailyRewardClaimCelebration
              payload={celebration}
              onComplete={onCelebrationComplete}
            />
          ) : (
            <>
              <div className="overflow-y-auto px-6 py-5 flex-1">
                {state.streakBroken && state.canClaim && (
                  <p className="mb-4 rounded-2xl border-2 border-error/30 bg-error-container/30 px-4 py-3 text-sm font-bold text-error text-center">
                    Você perdeu a sequência. A contagem recomeça no dia 1 — volte todos os dias!
                  </p>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {state.days.map((day) => (
                    <RewardDayCard
                      key={day.day}
                      {...day}
                      isFinal={day.day === 7}
                      isClaiming={claiming}
                      justClaimed={justClaimedDay === day.day}
                    />
                  ))}
                </div>

                {state.claimedToday && (
                  <p className="mt-4 text-center text-sm font-bold text-on-surface-variant">
                    Você já resgatou hoje. Volte amanhã para o dia {state.nextDay}!
                  </p>
                )}
              </div>

              <div className="px-6 py-4 border-t-2 border-surface-variant shrink-0">
                {claimError && (
                  <p className="mb-3 text-center text-sm font-bold text-error">{claimError}</p>
                )}
                {state.canClaim ? (
                  <button
                    type="button"
                    onClick={onClaim}
                    disabled={claiming}
                    className={cn(
                      "w-full rounded-2xl bg-primary text-on-primary font-black py-4 block-shadow-primary bouncy-transition disabled:opacity-60",
                      claiming && "animate-pulse"
                    )}
                  >
                    {claiming
                      ? "Abrindo recompensa..."
                      : `Resgatar dia ${state.currentDay}${
                          currentTier
                            ? ` · ${[
                                currentTier.gems > 0
                                  ? `${formatNumber(currentTier.gems)} gemas`
                                  : "",
                                currentTier.xp > 0 ? `${formatNumber(currentTier.xp)} XP` : "",
                              ]
                                .filter(Boolean)
                                .join(" + ")}`
                            : ""
                        }`}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-2xl bg-surface-container-highest text-on-background font-black py-4 border-2 border-surface-variant bouncy-transition"
                  >
                    Continuar aprendendo
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
