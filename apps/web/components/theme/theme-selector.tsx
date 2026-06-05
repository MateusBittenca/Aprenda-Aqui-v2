"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const;

type ThemeValue = (typeof OPTIONS)[number]["value"];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="h-10 w-full rounded-xl bg-surface-container-highest animate-pulse"
        aria-hidden
      />
    );
  }

  const active = (theme ?? "light") as ThemeValue;

  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Tema da interface">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const selected = active === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 font-bold text-xs transition-colors",
              selected
                ? "border-primary-container bg-primary-container/10 text-primary"
                : "border-surface-container-highest text-on-surface-variant hover:border-outline-variant"
            )}
            aria-pressed={selected}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
