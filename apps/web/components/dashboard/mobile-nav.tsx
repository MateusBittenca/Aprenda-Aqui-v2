"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Map,
  Settings,
  Store,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Aprender", icon: BookOpen },
  { href: "/trilhas", label: "Trilhas", icon: Map },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/comunidade", label: "Comunidade", shortLabel: "Comunid.", icon: Users },
  { href: "/loja", label: "Loja", icon: Store },
  { href: "/perfil", label: "Perfil", icon: User },
  {
    href: "/configuracoes",
    label: "Configurações",
    shortLabel: "Config",
    icon: Settings,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-outline-variant/40 bg-surface shadow-[0_-4px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.35)] safe-area-bottom"
      aria-label="Navegação principal"
    >
      <div className="flex items-stretch justify-between gap-0 px-0.5 pt-1.5 pb-1.5 min-h-[3.5rem]">
        {navItems.map(({ href, label, shortLabel, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);
          const displayLabel = shortLabel ?? label;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1 min-h-[44px] transition-colors",
                isActive
                  ? "text-primary font-bold"
                  : "text-on-surface-variant font-medium"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span className="w-full truncate text-center text-[10px] leading-tight sm:text-[11px]">
                <span className="sm:hidden">{displayLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
