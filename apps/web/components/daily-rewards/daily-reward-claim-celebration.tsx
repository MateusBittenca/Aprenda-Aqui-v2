"use client";

import { useEffect, useState } from "react";
import { Gem, Sparkles, Zap } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { TreasureChestIcon } from "@/components/icons/treasure-chest-icon";
import { useCountUp } from "@/components/daily-rewards/use-count-up";

export interface DailyRewardCelebrationPayload {
  day: number;
  gems: number;
  xp: number;
}

interface DailyRewardClaimCelebrationProps {
  payload: DailyRewardCelebrationPayload;
  onComplete: () => void;
}

function CelebrationConfetti() {
  const pieces = Array.from({ length: 32 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((i) => (
        <span
          key={i}
          className="level-confetti-piece absolute block rounded-sm"
          style={{
            left: `${(i * 13) % 100}%`,
            width: i % 3 === 0 ? 10 : 6,
            height: i % 3 === 0 ? 6 : 10,
            animationDelay: `${(i % 10) * 0.06}s`,
            animationDuration: `${2.2 + (i % 5) * 0.2}s`,
            backgroundColor:
              i % 4 === 0
                ? "rgb(var(--color-primary-container))"
                : i % 4 === 1
                  ? "rgb(var(--color-secondary))"
                  : i % 4 === 2
                    ? "rgb(var(--color-tertiary))"
                    : "rgb(var(--color-primary-fixed))",
          }}
        />
      ))}
    </div>
  );
}

function BurstRings() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="daily-reward-shine-ring absolute h-32 w-32 rounded-full border-4 border-primary/40"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function DailyRewardClaimCelebration({
  payload,
  onComplete,
}: DailyRewardClaimCelebrationProps) {
  const [showRewards, setShowRewards] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const isFinalDay = payload.day === 7;

  const gemsDisplay = useCountUp(payload.gems, showRewards, 1000);
  const xpDisplay = useCountUp(payload.xp, showRewards, 1000);

  useEffect(() => {
    const t1 = window.setTimeout(() => setShowRewards(true), 400);
    const t2 = window.setTimeout(() => setShowCta(true), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden px-6 py-10 text-center"
      role="status"
      aria-live="polite"
      aria-label={`Recompensa do dia ${payload.day} resgatada`}
    >
      <CelebrationConfetti />
      <BurstRings />

      <div className="relative z-10 daily-reward-celebrate-pop mb-4">
        <div
          className={cn(
            "relative mx-auto flex items-center justify-center rounded-3xl border-b-4 shadow-2xl daily-reward-gift-bounce",
            isFinalDay
              ? "h-28 w-32 border-primary bg-gradient-to-b from-primary-container to-primary text-on-primary"
              : "h-24 w-24 border-primary bg-primary-container text-primary"
          )}
        >
          {isFinalDay ? (
            <TreasureChestIcon variant="open" className="h-20 w-20 drop-shadow-md" />
          ) : (
            <Sparkles className="h-14 w-14" strokeWidth={2} />
          )}
          <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-on-secondary text-sm font-black border-2 border-surface shadow-lg">
            {payload.day}
          </span>
        </div>
      </div>

      <h3 className="relative z-10 text-2xl font-black font-display text-on-background daily-reward-celebrate-pop daily-reward-celebrate-pop-delay-1">
        {isFinalDay ? "Dia 7 — Grande prêmio!" : `Dia ${payload.day} resgatado!`}
      </h3>
      <p className="relative z-10 mt-1 text-sm font-bold text-on-surface-variant daily-reward-celebrate-pop daily-reward-celebrate-pop-delay-2">
        Volte amanhã para não perder a sequência
      </p>

      <div
        className={cn(
          "relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3 transition-all duration-500",
          showRewards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        {payload.gems > 0 && (
          <div className="daily-reward-celebrate-pop daily-reward-celebrate-pop-delay-3 flex items-center gap-2 rounded-2xl border-2 border-secondary bg-secondary-container/40 px-5 py-3 shadow-lg">
            <Gem className="h-8 w-8 fill-secondary text-secondary daily-reward-icon-pulse" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-wide text-secondary">
                Gemas
              </p>
              <p className="text-2xl font-black text-on-background tabular-nums">
                +{formatNumber(gemsDisplay)}
              </p>
            </div>
          </div>
        )}
        {payload.xp > 0 && (
          <div className="daily-reward-celebrate-pop daily-reward-celebrate-pop-delay-4 flex items-center gap-2 rounded-2xl border-2 border-primary bg-primary-container/30 px-5 py-3 shadow-lg">
            <Zap className="h-8 w-8 text-primary daily-reward-icon-pulse" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-wide text-primary">XP</p>
              <p className="text-2xl font-black text-on-background tabular-nums">
                +{formatNumber(xpDisplay)}
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onComplete}
        className={cn(
          "relative z-10 mt-10 w-full max-w-xs rounded-2xl bg-primary text-on-primary font-black py-4 block-shadow-primary bouncy-transition transition-all duration-500",
          showCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        Incrível!
      </button>
    </div>
  );
}
