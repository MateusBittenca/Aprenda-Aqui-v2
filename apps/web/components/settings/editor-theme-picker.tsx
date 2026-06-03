"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Check, Code2, Store } from "lucide-react";
import { DEFAULT_EDITOR_THEME_KEY } from "database";
import { EditorThemePreview } from "@/components/editor/editor-theme-preview";
import { listEditorThemes } from "@/lib/editor-themes";
import { cn } from "@/lib/utils";

interface EditorThemePickerProps {
  activeThemeKey?: string;
  ownedThemeKeys?: string[];
}

export function EditorThemePicker({
  activeThemeKey: initialActiveKey,
  ownedThemeKeys: initialOwnedKeys,
}: EditorThemePickerProps = {}) {
  const router = useRouter();
  const [activeThemeKey, setActiveThemeKey] = useState(
    initialActiveKey ?? DEFAULT_EDITOR_THEME_KEY
  );
  const [ownedThemeKeys, setOwnedThemeKeys] = useState<string[]>(initialOwnedKeys ?? []);
  const [loading, setLoading] = useState(initialActiveKey === undefined);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    async function loadThemes() {
      try {
        const res = await fetch("/api/store/editor-themes");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (cancelled) return;
        if (data.activeThemeKey) setActiveThemeKey(data.activeThemeKey);
        if (Array.isArray(data.ownedThemeKeys)) setOwnedThemeKeys(data.ownedThemeKeys);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadThemes();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (initialActiveKey !== undefined) setActiveThemeKey(initialActiveKey);
  }, [initialActiveKey]);

  useEffect(() => {
    if (initialOwnedKeys !== undefined) setOwnedThemeKeys(initialOwnedKeys);
  }, [initialOwnedKeys]);

  const ownedSet = useMemo(() => new Set(ownedThemeKeys), [ownedThemeKeys]);
  const themes = listEditorThemes();

  function isThemeAvailable(key: string) {
    return key === DEFAULT_EDITOR_THEME_KEY || ownedSet.has(key);
  }

  async function handleEquip(themeKey: string) {
    if (themeKey === activeThemeKey || !isThemeAvailable(themeKey)) return;

    setBusyKey(themeKey);
    setMessage(null);

    const res = await fetch("/api/store/equip-theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeKey }),
    });
    const data = await res.json().catch(() => ({}));
    setBusyKey(null);

    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? "Não foi possível aplicar o tema." });
      return;
    }

    setActiveThemeKey(data.activeEditorThemeKey ?? themeKey);
    setMessage({ type: "success", text: "Tema do editor atualizado!" });
    router.refresh();
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-secondary-container/30 p-2.5">
            <Code2 className="h-6 w-6 text-secondary" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display text-lg font-black text-on-background">
              Tema do editor de código
            </h3>
            <p className="mt-1 text-sm text-on-surface-variant">Carregando temas...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-3xl border-2 border-surface-variant bg-surface-container-high"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-secondary-container/30 p-2.5">
          <Code2 className="h-6 w-6 text-secondary" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-display text-lg font-black text-on-background">
            Tema do editor de código
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            Personalize as cores do editor nas lições de programação. Temas extras podem ser
            comprados na{" "}
            <Link href="/loja" className="font-bold text-primary hover:underline">
              Loja
            </Link>
            .
          </p>
        </div>
      </div>

      {message && (
        <p
          className={cn(
            "rounded-xl border-2 px-4 py-2 text-center text-sm font-bold",
            message.type === "success"
              ? "border-primary/30 bg-primary-container/20 text-primary"
              : "border-error/30 bg-error-container/30 text-error"
          )}
        >
          {message.text}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => {
          const available = isThemeAvailable(theme.key);
          const active = activeThemeKey === theme.key;
          const busy = busyKey === theme.key;

          return (
            <div
              key={theme.key}
              className={cn(
                "flex flex-col rounded-3xl border-2 p-3 transition-all",
                active
                  ? "border-primary bg-primary-container/10 ring-2 ring-primary/30"
                  : "border-surface-variant bg-surface-container-lowest",
                available && !active && "hover:border-secondary/50"
              )}
            >
              <EditorThemePreview themeKey={theme.key} className="mb-3" />

              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="font-display font-black text-on-background">{theme.name}</span>
                {theme.key === DEFAULT_EDITOR_THEME_KEY && (
                  <span className="shrink-0 rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-black uppercase text-secondary">
                    Grátis
                  </span>
                )}
              </div>

              {active ? (
                <span className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-container/30 py-2.5 text-sm font-black text-primary">
                  <Check className="h-4 w-4" strokeWidth={3} />
                  Em uso
                </span>
              ) : available ? (
                <button
                  type="button"
                  onClick={() => handleEquip(theme.key)}
                  disabled={busy}
                  className="rounded-xl border-b-4 border-primary bg-primary-container py-2.5 text-sm font-black text-on-primary-container block-shadow-primary bouncy-transition hover:brightness-110 active:translate-y-0.5 active:border-b-0 disabled:opacity-60"
                >
                  {busy ? "Aplicando..." : "Usar este tema"}
                </button>
              ) : (
                <Link
                  href="/loja"
                  className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-surface-variant bg-surface-container-high py-2.5 text-sm font-bold text-secondary bouncy-transition hover:bg-surface-variant"
                >
                  <Store className="h-4 w-4" />
                  Ver na Loja
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
