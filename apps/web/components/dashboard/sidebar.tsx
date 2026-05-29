"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Map,
  Settings,
  Trophy,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trilhas", label: "Trilhas", icon: Map },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-surface-container-low border-r-4 border-surface-variant py-10 px-6 z-40">
      <div className="mb-10 px-2">
        <Link href="/dashboard" className="text-2xl font-black text-primary tracking-tight font-display">
          Aprenda Aqui!
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-100 font-bold text-sm uppercase tracking-wide",
                isActive
                  ? "bg-primary-container text-on-primary-container border-b-4 border-primary scale-[0.98]"
                  : "text-secondary hover:bg-surface-variant/50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2">
        <Link
          href="/configuracoes"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-100 text-sm font-bold",
            pathname === "/configuracoes" || pathname.startsWith("/configuracoes/")
              ? "bg-primary-container text-on-primary-container border-b-4 border-primary scale-[0.98]"
              : "text-secondary hover:bg-surface-variant/50"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-secondary hover:bg-surface-variant/50 transition-colors text-sm font-bold"
        >
          <HelpCircle className="h-5 w-5" />
          <span>Ajuda</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-secondary hover:bg-surface-variant/50 transition-colors w-full text-sm font-bold"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
