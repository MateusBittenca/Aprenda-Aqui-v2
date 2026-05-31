"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { LevelUpPayload } from "@/lib/level-rewards";
import { LevelUpCelebration } from "@/components/levels/level-up-celebration";
import { LevelTrailModal, type UnlockedTitleItem } from "@/components/levels/level-trail-modal";

interface LevelUpContextValue {
  showLevelUp: (payload: LevelUpPayload) => void;
  openLevelTrail: () => void;
}

const LevelUpContext = createContext<LevelUpContextValue | null>(null);

export function useLevelUp() {
  const ctx = useContext(LevelUpContext);
  if (!ctx) {
    throw new Error("useLevelUp must be used within LevelUpProvider");
  }
  return ctx;
}

export function useLevelUpOptional() {
  return useContext(LevelUpContext);
}

interface LevelUpProviderProps {
  children: ReactNode;
  pendingLevelUp: LevelUpPayload | null;
  xpTotal: number;
  activeTitleKey: string;
  unlockedTitles: UnlockedTitleItem[];
}

async function acknowledgeCelebration() {
  await fetch("/api/users/me/celebrate-level", { method: "POST" });
}

export function LevelUpProvider({
  children,
  pendingLevelUp,
  xpTotal,
  activeTitleKey,
  unlockedTitles,
}: LevelUpProviderProps) {
  const router = useRouter();
  const [celebration, setCelebration] = useState<LevelUpPayload | null>(null);
  const [trailOpen, setTrailOpen] = useState(false);

  useEffect(() => {
    if (pendingLevelUp) {
      setCelebration(pendingLevelUp);
    }
  }, [pendingLevelUp]);

  const showLevelUp = useCallback((payload: LevelUpPayload) => {
    setCelebration(payload);
  }, []);

  const openLevelTrail = useCallback(() => {
    setTrailOpen(true);
  }, []);

  const handleContinue = useCallback(async () => {
    setCelebration(null);
    await acknowledgeCelebration();
    router.refresh();
  }, [router]);

  const handleViewTrail = useCallback(() => {
    setCelebration(null);
    setTrailOpen(true);
  }, []);

  const handleTrailClose = useCallback(async () => {
    setTrailOpen(false);
    if (pendingLevelUp) {
      await acknowledgeCelebration();
      router.refresh();
    }
  }, [pendingLevelUp, router]);

  const value = useMemo(
    () => ({ showLevelUp, openLevelTrail }),
    [showLevelUp, openLevelTrail]
  );

  return (
    <LevelUpContext.Provider value={value}>
      {children}
      {celebration && (
        <LevelUpCelebration
          open
          levelUp={celebration}
          onContinue={handleContinue}
          onViewTrail={handleViewTrail}
        />
      )}
      <LevelTrailModal
        open={trailOpen}
        onClose={handleTrailClose}
        xpTotal={xpTotal}
        activeTitleKey={activeTitleKey}
        unlockedTitles={unlockedTitles}
      />
    </LevelUpContext.Provider>
  );
}
