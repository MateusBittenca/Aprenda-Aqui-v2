"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Check, Gem, Lock, Sparkles } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import type { PathChestNode } from "@/lib/track-path";
import type { LevelUpPayload } from "@/lib/level-rewards";
import { acknowledgeLevelCelebration } from "@/lib/lesson-completion";
import { LevelUpCelebration } from "@/components/levels/level-up-celebration";

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

function ChestIcon({ status }: { status: PathChestNode["status"] }) {
  if (status === "claimed") {
    return <Check className="h-10 w-10" strokeWidth={3} />;
  }
  if (status === "locked") {
    return <Lock className="h-9 w-9" />;
  }
  return <Sparkles className="h-10 w-10" />;
}

export function TrackChestNode({ node, trackSlug }: TrackChestNodeProps) {
  const router = useRouter();
  const [status, setStatus] = useState(node.status);
  const [claiming, setClaiming] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [rewards, setRewards] = useState<{ xp: number; gems: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpPayload | null>(null);

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
    setRewards(rewardData);

    if (result.levelUp) {
      setLevelUp(result.levelUp);
      return;
    }

    setModalOpen(true);
    router.refresh();
  }, [status, claiming, node.id, node.xpReward, node.gemsReward, router]);

  const finishClaim = () => {
    setModalOpen(false);
    setLevelUp(null);
    const params = new URLSearchParams({ chest: node.id });
    if (rewards) {
      params.set("chestXp", String(rewards.xp));
      params.set("chestGems", String(rewards.gems));
    }
    router.push(`/trilhas/${trackSlug}?${params.toString()}`);
    router.refresh();
  };

  const closeModal = () => {
    finishClaim();
  };

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
            "rounded-full flex items-center justify-center transition-transform bouncy-transition",
            status === "available" &&
              "track-chest-available w-28 h-28 shadow-2xl pulse-highlight hover:scale-105",
            status === "claimed" &&
              "track-chest-claimed w-24 h-24 border-b-8 opacity-70",
            status === "locked" &&
              "w-24 h-24 border-b-8 opacity-50 grayscale bg-surface-container-highest border-surface-dim text-secondary"
          )}
        >
          <ChestIcon status={status} />
        </div>

        <div
          className={cn(
            "absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap max-w-[200px] truncate",
            status === "available"
              ? "track-chest-label font-black text-sm shadow-lg -bottom-4"
              : "bg-surface border-2 border-surface-variant text-on-background"
          )}
        >
          {status === "available" ? "ABRIR BAÚ" : node.title}
        </div>

        {error && (
          <p className="mt-8 text-xs font-bold text-error max-w-[200px] text-center">{error}</p>
        )}
      </button>

      {modalOpen && rewards && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chest-reward-title"
        >
          <div className="card-elevation w-full max-w-md rounded-4xl border-2 border-surface-container-highest bg-surface p-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full track-chest-available shadow-xl">
              <Sparkles className="h-10 w-10" />
            </div>
            <h2
              id="chest-reward-title"
              className="text-2xl font-black font-display text-on-background mb-2"
            >
              Baú aberto!
            </h2>
            <p className="text-on-surface-variant text-sm mb-6">{node.title}</p>
            <div className="flex flex-col gap-2 mb-8">
              {rewards.xp > 0 && (
                <p className="text-lg font-extrabold track-banner-text">
                  +{formatNumber(rewards.xp)} XP
                </p>
              )}
              {rewards.gems > 0 && (
                <p className="flex items-center justify-center gap-2 text-lg font-extrabold text-secondary">
                  <Gem className="h-5 w-5 fill-secondary" />+{formatNumber(rewards.gems)} gemas
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="w-full rounded-2xl bg-primary-container text-on-primary-container font-black py-4 block-shadow-primary bouncy-transition"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {levelUp && (
        <LevelUpCelebration
          open
          levelUp={levelUp}
          onContinue={async () => {
            await acknowledgeLevelCelebration();
            if (rewards) {
              setModalOpen(true);
            }
            setLevelUp(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
