"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { LevelUpPayload } from "@/lib/level-rewards";
import type { DailyRewardState } from "@/lib/daily-reward-data";
import { DailyRewardsModal } from "@/components/daily-rewards/daily-rewards-modal";
import type { DailyRewardCelebrationPayload } from "@/components/daily-rewards/daily-reward-claim-celebration";
import { useLevelUpOptional } from "@/components/levels/level-up-provider";

interface DailyRewardsContextValue {
  openDailyRewards: () => void;
  canClaimDaily: boolean;
}

const DailyRewardsContext = createContext<DailyRewardsContextValue | null>(null);

export function useDailyRewards() {
  const ctx = useContext(DailyRewardsContext);
  if (!ctx) {
    throw new Error("useDailyRewards must be used within DailyRewardsProvider");
  }
  return ctx;
}

export function useDailyRewardsOptional() {
  return useContext(DailyRewardsContext);
}

function todayStorageKey() {
  const d = new Date();
  return `daily-rewards-prompt-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

interface DailyRewardsProviderProps {
  children: ReactNode;
  initialState: DailyRewardState;
}

export function DailyRewardsProvider({ children, initialState }: DailyRewardsProviderProps) {
  const router = useRouter();
  const levelUp = useLevelUpOptional();
  const pendingLevelUpRef = useRef<LevelUpPayload | null>(null);

  const [state, setState] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<DailyRewardCelebrationPayload | null>(null);
  const [recentlyClaimedDay, setRecentlyClaimedDay] = useState<number | null>(null);

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  useEffect(() => {
    if (!state.canClaim) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(todayStorageKey()) === "1") return;
    setOpen(true);
    sessionStorage.setItem(todayStorageKey(), "1");
  }, [state.canClaim]);

  const openDailyRewards = useCallback(() => {
    setClaimError(null);
    setCelebration(null);
    setRecentlyClaimedDay(null);
    pendingLevelUpRef.current = null;
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    if (claiming || celebration) return;
    setOpen(false);
    setCelebration(null);
    setRecentlyClaimedDay(null);
    setClaimError(null);
    pendingLevelUpRef.current = null;
  }, [claiming, celebration]);

  const handleCelebrationComplete = useCallback(() => {
    const claimedDay = celebration?.day ?? null;
    setCelebration(null);
    if (claimedDay) {
      setRecentlyClaimedDay(claimedDay);
    }

    const levelUpPayload = pendingLevelUpRef.current;
    pendingLevelUpRef.current = null;

    if (levelUpPayload && levelUp) {
      setOpen(false);
      levelUp.showLevelUp(levelUpPayload);
      return;
    }
  }, [celebration, levelUp]);

  const handleClaim = useCallback(async () => {
    if (!state.canClaim || claiming || celebration) return;

    setClaiming(true);
    setClaimError(null);

    const res = await fetch("/api/daily-rewards/claim", { method: "POST" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setClaiming(false);
      setClaimError(data.error ?? "Não foi possível resgatar a recompensa.");
      return;
    }

    if (data.state) {
      setState(data.state);
    }

    if (data.levelUp) {
      pendingLevelUpRef.current = data.levelUp as LevelUpPayload;
    }

    setClaiming(false);
    const claimed = {
      day: data.dayClaimed as number,
      gems: data.gemsEarned ?? 0,
      xp: data.xpEarned ?? 0,
    };
    setCelebration(claimed);
    setRecentlyClaimedDay(claimed.day);

    router.refresh();
  }, [state.canClaim, claiming, celebration, router]);

  const value = useMemo(
    () => ({
      openDailyRewards,
      canClaimDaily: state.canClaim,
    }),
    [openDailyRewards, state.canClaim]
  );

  return (
    <DailyRewardsContext.Provider value={value}>
      {children}
      <DailyRewardsModal
        open={open}
        onClose={handleClose}
        state={state}
        claiming={claiming}
        claimError={claimError}
        celebration={celebration}
        recentlyClaimedDay={recentlyClaimedDay}
        onCelebrationComplete={handleCelebrationComplete}
        onClaim={handleClaim}
      />
    </DailyRewardsContext.Provider>
  );
}
