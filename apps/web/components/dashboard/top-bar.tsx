"use client";

import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { Flame, Gem, Zap } from "lucide-react";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { DailyRewardNavButton } from "@/components/daily-rewards/daily-reward-nav-button";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TopBarProps {
  xpTotal?: number;
  gems?: number;
  streak?: number;
  level?: number;
  titleLabel?: string;
  unreadNotifications?: number;
}

function StatPill({
  icon,
  value,
  suffix,
  className,
  compact = false,
}: {
  icon: ReactNode;
  value: string | number;
  suffix?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center rounded-full font-bold shrink-0 tabular-nums",
        compact ? "gap-1 px-2 py-1 text-xs" : "gap-1.5 px-3 py-1.5 text-sm",
        className
      )}
    >
      {icon}
      <span>
        {value}
        {suffix ? ` ${suffix}` : ""}
      </span>
    </div>
  );
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
    <header className="sticky top-0 z-30 bg-surface border-b-4 border-surface-variant shadow-sm lg:ml-64">
      <div className="flex h-14 lg:h-16 items-center justify-between gap-2 px-4 sm:px-5 lg:px-6 min-w-0">
        <div className="min-w-0 flex-1 lg:flex-none">
          <span className="lg:hidden block truncate text-base sm:text-lg font-black text-primary font-display whitespace-nowrap">
            Aprenda Aqui!
          </span>

          <div className="hidden lg:block">
            <p className="text-sm text-on-surface-variant font-medium">
              Continue sua jornada de aprendizado
            </p>
            <p className="text-xs font-bold text-secondary">
              Nível {level} · {titleLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <StatPill
            icon={<Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-error shrink-0" />}
            value={streak}
            className="bg-error-container text-error"
            compact
          />

          <StatPill
            icon={<Gem className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-secondary shrink-0" />}
            value={formatNumber(gems)}
            className="bg-secondary-container/30 text-secondary"
            compact
          />

          <StatPill
            icon={<Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />}
            value={formatNumber(xpTotal)}
            suffix="XP"
            className="hidden sm:flex bg-primary-container/10 text-primary"
            compact
          />

          <div className="flex items-center gap-0.5 sm:gap-1 [&_button]:!h-9 [&_button]:!w-9 sm:[&_button]:!h-10 sm:[&_button]:!w-10">
            <DailyRewardNavButton />
            <NotificationBell initialUnreadCount={unreadNotifications} />
          </div>

          <div className="hidden lg:block h-8 w-px bg-surface-variant" />

          <div className="w-9 h-9 shrink-0 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary-container text-sm">
            {session?.user?.name?.charAt(0) ?? "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
