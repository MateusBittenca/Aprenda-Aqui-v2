"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Map, Store, Trophy, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Aprender", icon: BookOpen },
  { href: "/trilhas", label: "Trilhas", icon: Map },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/comunidade", label: "Comunidade", icon: Users },
  { href: "/loja", label: "Loja", icon: Store },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface h-16 flex items-center justify-around md:hidden z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.35)] border-t border-outline-variant/40">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5",
              isActive ? "text-primary font-bold" : "text-on-surface-variant"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
