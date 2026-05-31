"use client";

import { useEffect, useRef } from "react";
import { X, Verified } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import {
  buildLevelTrail,
  calculateLevel,
  getTitleLabel,
  xpInCurrentLevel,
  XP_PER_LEVEL,
} from "@/lib/level-system";
import { LevelTrailPath } from "@/components/levels/level-trail-path";

export interface UnlockedTitleItem {
  titleKey: string;
  unlockedAt: string;
}

interface LevelTrailModalProps {
  open: boolean;
  onClose: () => void;
  xpTotal: number;
  activeTitleKey: string;
  unlockedTitles: UnlockedTitleItem[];
}

export function LevelTrailModal({
  open,
  onClose,
  xpTotal,
  activeTitleKey,
  unlockedTitles,
}: LevelTrailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const level = calculateLevel(xpTotal);
  const titleLabel = getTitleLabel(activeTitleKey);
  const xpCurrent = xpInCurrentLevel(xpTotal);
  const trailNodes = buildLevelTrail(level);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-on-background/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-trail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="card-elevation w-full sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-4xl sm:rounded-4xl border-2 border-surface-container-highest bg-surface overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b-2 border-surface-variant shrink-0">
          <div>
            <h2 id="level-trail-title" className="text-xl font-black font-display text-on-background">
              Trilha de níveis
            </h2>
            <p className="text-sm text-on-surface-variant">
              Nível {level} · {titleLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 bg-primary-container/10 border-b border-surface-variant shrink-0">
          <p className="text-sm font-bold text-on-surface-variant mb-2">Progresso no nível atual</p>
          <div className="h-3 rounded-full bg-surface-container-high border border-surface-variant overflow-hidden">
            <div
              className="h-full bg-primary-container rounded-full progress-glow"
              style={{ width: `${(xpCurrent / XP_PER_LEVEL) * 100}%` }}
            />
          </div>
          <p className="text-xs font-bold text-primary mt-1">
            {formatNumber(xpCurrent)} / {formatNumber(XP_PER_LEVEL)} XP para o nível {level + 1}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <LevelTrailPath nodes={trailNodes} xpInLevel={xpCurrent} />

          {unlockedTitles.length > 0 && (
            <section className="mt-8 pt-6 border-t-2 border-surface-variant">
              <h3 className="text-lg font-extrabold font-display text-on-background mb-4">
                Seus títulos
              </h3>
              <div className="flex flex-wrap gap-2">
                {unlockedTitles.map(({ titleKey }) => {
                  const label = getTitleLabel(titleKey);
                  const isActive = titleKey === activeTitleKey;
                  return (
                    <span
                      key={titleKey}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2",
                        isActive
                          ? "bg-secondary-container text-on-secondary-container border-secondary"
                          : "bg-surface-container text-on-surface-variant border-surface-variant"
                      )}
                    >
                      <Verified className="h-3.5 w-3.5 shrink-0" />
                      {label}
                    </span>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
