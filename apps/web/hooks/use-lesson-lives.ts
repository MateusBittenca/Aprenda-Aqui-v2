"use client";

import { useCallback, useState } from "react";
import { MAX_LIVES, LIVES_REFILL_GEM_COST } from "@/lib/lesson-lives";

interface RefillResult {
  ok: boolean;
  gems?: number;
  error?: string;
}

async function refillLivesWithGems(): Promise<RefillResult> {
  const res = await fetch("/api/lives/refill", { method: "POST" });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      ok: false,
      gems: data.gems,
      error: data.error ?? "Não foi possível recuperar as vidas.",
    };
  }

  return { ok: true, gems: data.gems };
}

export function useLessonLives(initialGems: number) {
  const [lives, setLives] = useState(MAX_LIVES);
  const [gems, setGems] = useState(initialGems);
  const [refilling, setRefilling] = useState(false);
  const [refillError, setRefillError] = useState<string | null>(null);

  const loseLife = useCallback((): boolean => {
    let reachedZero = false;
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        reachedZero = true;
        return 0;
      }
      return next;
    });
    if (reachedZero) {
      setRefillError(null);
    }
    return reachedZero;
  }, []);

  const restoreLives = useCallback(async (): Promise<boolean> => {
    setRefilling(true);
    setRefillError(null);

    const result = await refillLivesWithGems();

    setRefilling(false);

    if (!result.ok) {
      if (result.gems !== undefined) setGems(result.gems);
      setRefillError(result.error ?? "Erro ao recuperar vidas.");
      return false;
    }

    if (result.gems !== undefined) setGems(result.gems);
    setLives(MAX_LIVES);
    setRefillError(null);
    return true;
  }, []);

  const outOfLives = lives <= 0;

  return {
    lives,
    gems,
    gemCost: LIVES_REFILL_GEM_COST,
    outOfLives,
    refilling,
    refillError,
    canAffordRefill: gems >= LIVES_REFILL_GEM_COST,
    loseLife,
    restoreLives,
  };
}
