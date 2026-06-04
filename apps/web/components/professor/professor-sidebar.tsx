"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BookOpen, LogOut, Map, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/professor/trilhas", label: "Trilhas", icon: Map },
  { href: "/professor/usuarios", label: "Usuários", icon: Users },
];

export function ProfessorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-surface-container-low border-r-4 border-surface-variant py-10 px-6 z-40">
      <div className="mb-10 px-2">
        <Link
          href="/professor"
          className="text-2xl font-black text-primary tracking-tight font-display"
        >
          Aprenda Aqui!
        </Link>
        <p className="text-xs font-bold text-secondary uppercase tracking-wide mt-1 flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" />
          Painel do Professor
        </p>
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

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide text-secondary hover:bg-surface-variant/50 transition-all w-full"
      >
        <LogOut className="h-5 w-5" />
        Sair
      </button>
    </aside>
  );
}
