"use client";

import { RewardClaimCelebration } from "@/components/celebration/reward-claim-celebration";

export interface DailyRewardCelebrationPayload {
  day: number;
  gems: number;
  xp: number;
}

interface DailyRewardClaimCelebrationProps {
  payload: DailyRewardCelebrationPayload;
  onComplete: () => void;
}

export function DailyRewardClaimCelebration({
  payload,
  onComplete,
}: DailyRewardClaimCelebrationProps) {
  const isFinalDay = payload.day === 7;

  return (
    <RewardClaimCelebration
      variant="daily"
      badge={payload.day}
      isDailyGrandPrize={isFinalDay}
      title={isFinalDay ? "Dia 7 — Grande prêmio!" : `Dia ${payload.day} resgatado!`}
      subtitle="Volte amanhã para não perder a sequência"
      gems={payload.gems}
      xp={payload.xp}
      onComplete={onComplete}
    />
  );
}
