"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Gem, Snowflake, Store, Zap } from "lucide-react";
import type { StoreItem, StoreItemCategory } from "database";
import type { StoreState } from "@/lib/store";
import { cn, formatNumber } from "@/lib/utils";
import { StoreItemCard } from "@/components/store/store-item-card";

type TabId = "destaques" | "powerup" | "theme";

const TABS: { id: TabId; label: string }[] = [
  { id: "destaques", label: "Destaques" },
  { id: "powerup", label: "Power-ups" },
  { id: "theme", label: "Temas" },
];

interface StorePanelProps {
  items: StoreItem[];
  state: StoreState;
}

function useBoostCountdown(expiresAt: string | null): string | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (!expiresAt) return null;
  const remaining = new Date(expiresAt).getTime() - now;
  if (remaining <= 0) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function StorePanel({ items, state }: StorePanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("destaques");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const boostLabel = useBoostCountdown(state.xpBoostExpiresAt);
  const ownedSet = useMemo(() => new Set(state.ownedItemKeys), [state.ownedItemKeys]);

  const visibleItems = useMemo(() => {
    if (activeTab === "destaques") return items.filter((i) => i.featured);
    return items.filter((i) => i.category === (activeTab as StoreItemCategory));
  }, [activeTab, items]);

  const handleBuy = useCallback(
    async (item: StoreItem) => {
      setBusyKey(item.key);
      setMessage(null);

      const res = await fetch("/api/store/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemKey: item.key }),
      });
      const data = await res.json().catch(() => ({}));
      setBusyKey(null);

      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Não foi possível concluir a compra." });
        return;
      }

      setMessage({ type: "success", text: `${item.name} adquirido!` });
      router.refresh();
    },
    [router]
  );

  const handleEquip = useCallback(
    async (item: StoreItem) => {
      setBusyKey(item.key);
      setMessage(null);

      const res = await fetch("/api/store/equip-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeKey: item.key }),
      });
      const data = await res.json().catch(() => ({}));
      setBusyKey(null);

      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Não foi possível equipar o tema." });
        return;
      }

      setMessage({ type: "success", text: `${item.name} equipado!` });
      router.refresh();
    },
    [router]
  );

  return (
    <div className="mx-auto w-full max-w-container-max">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3">
          <Store className="h-8 w-8 text-primary" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-on-background">
            Loja de Itens
          </h1>
          <p className="text-on-surface-variant">Troque suas gemas por power-ups e temas!</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-3xl border-2 border-surface-variant bg-surface-container-lowest p-4 block-shadow-card">
          <Gem className="h-7 w-7 fill-secondary text-secondary" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">
              Suas gemas
            </p>
            <p className="font-display text-xl font-black text-on-background">
              {formatNumber(state.gems)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl border-2 border-surface-variant bg-surface-container-lowest p-4 block-shadow-card">
          <Snowflake className="h-7 w-7 text-secondary" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">
              Protetores
            </p>
            <p className="font-display text-xl font-black text-on-background">
              {state.streakFreezes}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-3 rounded-3xl border-2 p-4 block-shadow-card",
            boostLabel
              ? "border-primary bg-primary-container/15"
              : "border-surface-variant bg-surface-container-lowest"
          )}
        >
          <Zap
            className={cn("h-7 w-7", boostLabel ? "text-primary" : "text-on-surface-variant")}
            fill={boostLabel ? "currentColor" : "none"}
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">
              Bônus de XP
            </p>
            <p className="font-display text-xl font-black text-on-background tabular-nums">
              {boostLabel ?? "Inativo"}
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={cn(
            "mb-6 rounded-2xl border-2 px-4 py-3 text-center font-bold",
            message.type === "success"
              ? "border-primary/30 bg-primary-container/20 text-primary"
              : "border-error/30 bg-error-container/30 text-error"
          )}
        >
          {message.text}
        </div>
      )}

      <div className="mb-8 flex gap-3 overflow-x-auto whitespace-nowrap pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full px-6 py-2.5 font-bold transition-all",
              activeTab === tab.id
                ? "bg-primary text-white block-shadow-primary active:translate-y-1 active:shadow-none"
                : "bg-surface-container-high text-secondary hover:bg-surface-variant"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleItems.map((item) => (
          <StoreItemCard
            key={item.key}
            item={item}
            gems={state.gems}
            owned={ownedSet.has(item.key)}
            active={item.effect === "editor_theme" && state.activeEditorThemeKey === item.key}
            busy={busyKey === item.key}
            onBuy={handleBuy}
            onEquip={handleEquip}
          />
        ))}
      </div>
    </div>
  );
}
