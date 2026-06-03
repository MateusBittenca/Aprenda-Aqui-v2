"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PathChestNode } from "@/lib/track-path";
import type { LevelUpPayload } from "@/lib/level-rewards";
import { acknowledgeLevelCelebration } from "@/lib/lesson-completion";
import { LevelUpCelebration } from "@/components/levels/level-up-celebration";
import { RewardCelebrationModal } from "@/components/celebration/reward-celebration-modal";
import { TreasureChestIcon } from "@/components/icons/treasure-chest-icon";

interface TrackChestNodeProps {
  node: PathChestNode;
  trackSlug: string;
}

interface ClaimResult {
  ok: boolean;
  xpEarned?: number;
  gemsEarned?: number;
  levelUp?: LevelUpPayload | null;
  error?: string;
}

async function claimChest(chestId: string): Promise<ClaimResult> {
  const res = await fetch(`/api/chests/${chestId}/claim`, { method: "POST" });
  const data = await res.json().catch(() => ({}));

  if (!res.ok && !data.alreadyClaimed) {
    return { ok: false, error: data.error ?? "Não foi possível abrir o baú." };
  }

  return {
    ok: true,
    xpEarned: data.xpEarned ?? 0,
    gemsEarned: data.gemsEarned ?? 0,
    levelUp: data.levelUp ?? null,
  };
}

function ChestVisual({ status }: { status: PathChestNode["status"] }) {
  const variant =
    status === "claimed" ? "claimed" : status === "available" ? "closed" : "closed";

  return (
    <div className="relative flex items-center justify-center">
      <TreasureChestIcon
        variant={variant}
        className={cn(
          "h-16 w-16 drop-shadow-lg",
          status === "locked" && "opacity-80"
        )}
      />
      {status === "locked" && (
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          <div className="rounded-full bg-surface/90 p-1.5 border-2 border-surface-variant shadow-sm">
            <Lock className="h-6 w-6 text-secondary" strokeWidth={2.5} />
          </div>
        </div>
      )}
    </div>
  );
}

export function TrackChestNode({ node, trackSlug }: TrackChestNodeProps) {
  const router = useRouter();
  const pendingLevelUpRef = useRef<LevelUpPayload | null>(null);
  const claimedRewardsRef = useRef<{ xp: number; gems: number } | null>(null);

  const [status, setStatus] = useState(node.status);
  const [claiming, setClaiming] = useState(false);
  const [celebration, setCelebration] = useState<{ xp: number; gems: number } | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const finishClaim = useCallback(() => {
    setCelebration(null);
    pendingLevelUpRef.current = null;
    const rewards = claimedRewardsRef.current;
    claimedRewardsRef.current = null;
    const params = new URLSearchParams({ chest: node.id });
    if (rewards) {
      params.set("chestXp", String(rewards.xp));
      params.set("chestGems", String(rewards.gems));
    }
    router.push(`/trilhas/${trackSlug}?${params.toString()}`);
    router.refresh();
  }, [node.id, router, trackSlug]);

  const handleCelebrationComplete = useCallback(() => {
    const pending = pendingLevelUpRef.current;
    setCelebration(null);

    if (pending) {
      setLevelUp(pending);
      pendingLevelUpRef.current = null;
      return;
    }

    finishClaim();
  }, [finishClaim]);

  const handleOpen = useCallback(async () => {
    if (status !== "available" || claiming) return;

    setClaiming(true);
    setError(null);

    const result = await claimChest(node.id);
    setClaiming(false);

    if (!result.ok) {
      setError(result.error ?? "Erro ao abrir o baú.");
      return;
    }

    setStatus("claimed");

    const rewardData = {
      xp: result.xpEarned ?? node.xpReward,
      gems: result.gemsEarned ?? node.gemsReward,
    };

    if (result.levelUp) {
      pendingLevelUpRef.current = result.levelUp;
    }

    claimedRewardsRef.current = rewardData;
    setCelebration(rewardData);
    router.refresh();
  }, [status, claiming, node.id, node.xpReward, node.gemsReward, router]);

  const isInteractive = status === "available";

  return (
    <>
      <button
        type="button"
        disabled={!isInteractive || claiming}
        onClick={handleOpen}
        aria-label={
          status === "available"
            ? `Abrir ${node.title}`
            : status === "claimed"
              ? `${node.title} — já resgatado`
              : `${node.title} — bloqueado`
        }
        className={cn(
          "path-node relative z-10 group flex flex-col items-center",
          !isInteractive && "pointer-events-none",
          isInteractive && "cursor-pointer"
        )}
      >
        <div
          className={cn(
            "track-chest-node flex items-center justify-center transition-transform bouncy-transition px-3 py-2",
            status === "available" &&
              "track-chest-available w-[7.5rem] h-[6.5rem] shadow-2xl pulse-highlight chest-wiggle hover:scale-105",
            status === "claimed" &&
              "track-chest-claimed w-24 h-20 border-b-8 opacity-75",
            status === "locked" &&
              "w-24 h-20 border-b-8 opacity-50 grayscale bg-surface-container-highest border-surface-dim text-secondary",
            claiming && status === "available" && "daily-reward-claim-shake"
          )}
        >
          <ChestVisual status={status} />
        </div>

        <div
          className={cn(
            "absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap max-w-[200px] truncate",
            status === "available"
              ? "track-chest-label font-black text-sm shadow-lg -bottom-4"
              : "bg-surface border-2 border-surface-variant text-on-background"
          )}
        >
          {status === "available" ? (claiming ? "Abrindo..." : "ABRIR BAÚ") : node.title}
        </div>

        {error && (
          <p className="mt-8 text-xs font-bold text-error max-w-[200px] text-center">{error}</p>
        )}
      </button>

      <RewardCelebrationModal
        open={celebration !== null}
        variant="chest"
        title="Baú aberto!"
        subtitle={node.title}
        gems={celebration?.gems ?? 0}
        xp={celebration?.xp ?? 0}
        onComplete={handleCelebrationComplete}
        zIndex={200}
      />

      {levelUp && (
        <LevelUpCelebration
          open
          levelUp={levelUp}
          onContinue={async () => {
            await acknowledgeLevelCelebration();
            setLevelUp(null);
            finishClaim();
          }}
        />
      )}
    </>
  );
}
