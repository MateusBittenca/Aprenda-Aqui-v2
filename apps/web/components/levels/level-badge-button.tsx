"use client";

import { useState } from "react";
import { ChevronRight, Verified } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTitleLabel } from "@/lib/level-system";
import { LevelTrailModal, type UnlockedTitleItem } from "@/components/levels/level-trail-modal";

interface LevelBadgeButtonProps {
  level: number;
  activeTitleKey: string;
  xpTotal: number;
  unlockedTitles: UnlockedTitleItem[];
  interactive?: boolean;
  className?: string;
}

export function LevelBadgeButton({
  level,
  activeTitleKey,
  xpTotal,
  unlockedTitles,
  interactive = true,
  className,
}: LevelBadgeButtonProps) {
  const [open, setOpen] = useState(false);
  const titleLabel = getTitleLabel(activeTitleKey);

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-bold border-b-2 border-secondary",
        interactive && "bouncy-transition hover:brightness-105 active:translate-y-0.5",
        className
      )}
    >
      <Verified className="h-4 w-4 shrink-0" />
      Nível {level} · {titleLabel}
      {interactive && <ChevronRight className="h-4 w-4 opacity-70" />}
    </span>
  );

  if (!interactive) {
    return badge;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
        aria-label="Ver trilha de níveis e recompensas"
      >
        {badge}
      </button>
      <LevelTrailModal
        open={open}
        onClose={() => setOpen(false)}
        xpTotal={xpTotal}
        activeTitleKey={activeTitleKey}
        unlockedTitles={unlockedTitles}
      />
    </>
  );
}
