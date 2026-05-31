"use client";

import { Check, Gem, Lock, Star, Verified } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import type { LevelTrailNode } from "@/lib/level-system";
import { XP_PER_LEVEL } from "@/lib/level-system";

interface LevelTrailPathProps {
  nodes: LevelTrailNode[];
  xpInLevel: number;
}

export function LevelTrailPath({ nodes, xpInLevel }: LevelTrailPathProps) {
  const pathHeight = Math.max(nodes.length * 130, 320);

  return (
    <div className="relative w-full max-w-sm flex flex-col items-center gap-12 py-4 mx-auto">
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full -z-10 opacity-15 pointer-events-none"
        fill="none"
        viewBox="0 0 200 800"
        style={{ height: pathHeight }}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M100 0 C150 100, 50 150, 100 250 C150 350, 50 400, 100 500 C150 600, 50 650, 100 750"
          stroke="rgb(var(--color-primary-container))"
          strokeDasharray="12 12"
          strokeWidth="6"
        />
      </svg>

      {nodes.map(({ milestone, status, showChapter }) => (
        <div key={milestone.level} className="w-full flex flex-col items-center">
          {showChapter && (
            <div className="mb-4 px-4 py-2 bg-secondary-container/30 border-2 border-secondary-container rounded-xl font-black text-[10px] uppercase tracking-widest text-on-secondary-container text-center max-w-[280px]">
              {milestone.chapterLabel}
            </div>
          )}

          <div
            className={cn(
              "relative z-10 w-full max-w-[300px] rounded-3xl border-2 p-4 transition-all",
              status === "completed" &&
                "bg-primary-container/15 border-primary-container/50",
              status === "current" &&
                "bg-surface border-primary-container shadow-lg ring-2 ring-primary-container/30 scale-[1.02]",
              status === "locked" &&
                "bg-surface-container border-surface-variant opacity-60"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "grid w-14 h-14 shrink-0 place-items-center rounded-full border-b-4",
                  status === "completed" && "bg-primary-container border-primary text-on-primary",
                  status === "current" && "bg-primary-container border-primary text-on-primary pulse-highlight",
                  status === "locked" && "bg-surface-container-highest border-surface-variant text-secondary"
                )}
              >
                {status === "completed" ? (
                  <Check className="h-7 w-7" strokeWidth={3} />
                ) : status === "locked" ? (
                  <Lock className="h-6 w-6" />
                ) : (
                  <Star className="h-7 w-7 fill-current" />
                )}
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold uppercase tracking-wide text-secondary">
                  Nível {milestone.level}
                </p>
                <p className="font-black text-on-background font-display truncate">
                  {milestone.titleLabel}
                </p>

                {status === "current" && (
                  <div className="mt-2 space-y-1">
                    <div className="h-2 rounded-full bg-surface-container-high border border-surface-variant overflow-hidden">
                      <div
                        className="h-full bg-primary-container rounded-full progress-glow transition-all"
                        style={{ width: `${Math.min((xpInLevel / XP_PER_LEVEL) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-on-surface-variant">
                      {formatNumber(xpInLevel)} / {formatNumber(XP_PER_LEVEL)} XP
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold",
                      status === "locked"
                        ? "bg-surface-container text-outline"
                        : "bg-secondary-container/40 text-on-secondary-container"
                    )}
                  >
                    <Gem className="h-3 w-3" />
                    +{milestone.gemsReward}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold",
                      status === "locked"
                        ? "bg-surface-container text-outline"
                        : "bg-primary-container/20 text-primary"
                    )}
                  >
                    <Verified className="h-3 w-3" />
                    Título
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
