"use client";

import Image from "next/image";
import { Gem, Sparkles, Verified } from "lucide-react";
import { ModalPortal } from "@/components/ui/modal-portal";
import { formatNumber } from "@/lib/utils";
import { MASCOT } from "@/lib/mascot";

const MASCOT_SRC = MASCOT.default;
import type { LevelUpPayload } from "@/lib/level-rewards";

interface LevelUpCelebrationProps {
  open: boolean;
  levelUp: LevelUpPayload;
  onContinue: () => void;
  onViewTrail?: () => void;
}

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((i) => (
        <span
          key={i}
          className="level-confetti-piece absolute block h-2 w-2 rounded-sm"
          style={{
            left: `${(i * 17) % 100}%`,
            animationDelay: `${(i % 8) * 0.08}s`,
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

export function LevelUpCelebration({
  open,
  levelUp,
  onContinue,
  onViewTrail,
}: LevelUpCelebrationProps) {
  if (!open) return null;

  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-on-background/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-title"
      onClick={onContinue}
    >
      <Confetti />
      <div
        className="card-elevation relative z-[211] w-full max-w-md rounded-4xl border-2 border-primary-container bg-surface p-8 text-center pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 relative w-24 h-24">
          <Image src={MASCOT_SRC} alt="" fill className="object-contain drop-shadow-lg" />
        </div>

        <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-primary-container/20 text-primary font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          Level up!
        </div>

        <h2 id="level-up-title" className="text-3xl font-black font-display text-on-background mb-1">
          Nível {levelUp.newLevel}!
        </h2>
        {levelUp.levelsGained > 1 && (
          <p className="text-sm text-on-surface-variant mb-4">
            Você subiu {levelUp.levelsGained} níveis de uma vez!
          </p>
        )}

        <div className="my-6 p-4 rounded-2xl bg-secondary-container/30 border-2 border-secondary">
          <p className="text-xs font-bold uppercase tracking-wide text-secondary mb-1">
            Novo título desbloqueado
          </p>
          <p className="flex items-center justify-center gap-2 text-xl font-black text-on-background">
            <Verified className="h-6 w-6 text-secondary" />
            {levelUp.titleLabel}
          </p>
        </div>

        {levelUp.gemsGranted > 0 && (
          <p className="flex items-center justify-center gap-2 text-lg font-extrabold text-secondary mb-6">
            <Gem className="h-6 w-6 fill-secondary" />
            +{formatNumber(levelUp.gemsGranted)} gemas
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-2xl bg-primary-container text-on-primary-container font-black py-4 block-shadow-primary bouncy-transition"
          >
            Continuar
          </button>
          {onViewTrail && (
            <button
              type="button"
              onClick={onViewTrail}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface-container-low text-on-background font-bold py-3 bouncy-transition hover:bg-surface-container"
            >
              Ver trilha de níveis
            </button>
          )}
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
