"use client";

import { useSession } from "next-auth/react";
import { Flame, Gem, Zap } from "lucide-react";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { formatNumber } from "@/lib/utils";

interface TopBarProps {
  xpTotal?: number;
  gems?: number;
  streak?: number;
  level?: number;
  titleLabel?: string;
  unreadNotifications?: number;
}

export function TopBar({
  xpTotal = 0,
  gems = 0,
  streak = 0,
  level = 1,
  titleLabel = "Iniciante",
  unreadNotifications = 0,
}: TopBarProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-surface px-6 lg:ml-64 border-b-4 border-surface-variant shadow-sm">
      <div className="lg:hidden">
        <span className="text-xl font-black text-primary font-display">Aprenda Aqui!</span>
      </div>

      <div className="hidden lg:block">
        <p className="text-sm text-on-surface-variant font-medium">
          Continue sua jornada de aprendizado
        </p>
        <p className="text-xs font-bold text-secondary">
          Nível {level} · {titleLabel}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-error-container text-error rounded-full font-bold text-sm">
          <Flame className="h-4 w-4 fill-error" />
          {streak}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-container/30 text-secondary rounded-full font-bold text-sm">
          <Gem className="h-4 w-4 fill-secondary" />
          {formatNumber(gems)}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/10 text-primary rounded-full font-bold text-sm">
          <Zap className="h-4 w-4" />
          {formatNumber(xpTotal)} XP
        </div>

        <NotificationBell initialUnreadCount={unreadNotifications} />

        <div className="h-8 w-px bg-surface-variant mx-1" />

        <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary-container text-sm">
          {session?.user?.name?.charAt(0) ?? "A"}
        </div>
      </div>
    </header>
  );
}
