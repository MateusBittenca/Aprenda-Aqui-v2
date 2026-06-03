"use client";

import { Check, Gem, Snowflake, Sparkles, Zap } from "lucide-react";
import type { StoreItem } from "database";
import { cn, formatNumber } from "@/lib/utils";
import { EDITOR_THEMES } from "@/lib/editor-themes";

interface StoreItemCardProps {
  item: StoreItem;
  gems: number;
  owned: boolean;
  active: boolean;
  busy: boolean;
  onBuy: (item: StoreItem) => void;
  onEquip: (item: StoreItem) => void;
}

function ThemePreview({ itemKey }: { itemKey: string }) {
  const theme = EDITOR_THEMES[itemKey];
  const background = theme?.preview.background ?? "#1c1f4a";
  const accents = theme?.preview.accents ?? ["#ffffff", "#ffffff", "#ffffff"];

  return (
    <div
      className="relative flex h-full w-full flex-col justify-center gap-2 overflow-hidden rounded-2xl p-4"
      style={{ backgroundColor: background }}
    >
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
      </div>
      <div className="h-2 w-1/2 rounded-full" style={{ backgroundColor: accents[0] }} />
      <div className="h-2 w-3/4 rounded-full" style={{ backgroundColor: accents[1] }} />
      <div className="h-2 w-2/3 rounded-full" style={{ backgroundColor: accents[2] }} />
    </div>
  );
}

function PowerUpIcon({ effect }: { effect: StoreItem["effect"] }) {
  if (effect === "streak_freeze") {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-secondary-container/40">
        <Snowflake className="h-16 w-16 text-secondary" strokeWidth={1.6} />
      </div>
    );
  }
  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-primary-container/20">
      <Zap className="h-16 w-16 text-primary" fill="currentColor" />
      <span className="absolute right-6 top-6 rounded-lg border-2 border-surface bg-primary-fixed px-2 py-0.5 text-xs font-black text-on-primary-fixed shadow-sm">
        2X
      </span>
    </div>
  );
}

export function StoreItemCard({
  item,
  gems,
  owned,
  active,
  busy,
  onBuy,
  onEquip,
}: StoreItemCardProps) {
  const isTheme = item.effect === "editor_theme";
  const canAfford = gems >= item.priceGems;

  return (
    <div className="flex h-full flex-col rounded-3xl border-2 border-surface-variant bg-surface-container-lowest p-4 block-shadow-card bouncy-transition hover:-translate-y-1">
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl">
        {isTheme ? <ThemePreview itemKey={item.key} /> : <PowerUpIcon effect={item.effect} />}
        {item.featured && (
          <span className="absolute right-2 top-2 rounded-full bg-tertiary-fixed px-2 py-1 text-[10px] font-black text-on-tertiary-fixed">
            DESTAQUE
          </span>
        )}
      </div>

      <h3 className="mb-1 font-display text-lg font-black text-on-background">{item.name}</h3>
      <p className="mb-4 flex-grow text-sm text-on-surface-variant">{item.description}</p>

      <div className="mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold text-secondary">
          <Gem className="h-5 w-5 fill-secondary" />
          {formatNumber(item.priceGems)}
        </div>

        {isTheme && active ? (
          <span className="flex items-center gap-1.5 rounded-xl bg-primary-container/30 px-4 py-2 font-black text-primary">
            <Check className="h-5 w-5" strokeWidth={3} />
            Equipado
          </span>
        ) : isTheme && owned ? (
          <button
            type="button"
            onClick={() => onEquip(item)}
            disabled={busy}
            className="rounded-xl border-2 border-primary bg-surface px-5 py-2 font-black text-primary bouncy-transition hover:bg-primary-container/20 disabled:opacity-60"
          >
            {busy ? "..." : "Equipar"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onBuy(item)}
            disabled={busy || !canAfford}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-5 py-2 font-black bouncy-transition",
              canAfford
                ? "bg-primary-container text-on-primary-container border-b-4 border-primary block-shadow-primary hover:brightness-110 active:translate-y-1 active:border-b-0"
                : "bg-surface-container-highest text-on-surface-variant cursor-not-allowed",
              busy && "opacity-60"
            )}
          >
            {busy ? (
              "..."
            ) : canAfford ? (
              "Comprar"
            ) : (
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" /> Gemas
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
