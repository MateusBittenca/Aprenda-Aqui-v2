import {
  BookOpen,
  Code2,
  Flame,
  Gem,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LeagueTier } from "@/lib/league-tier";

interface ProfileBadgesProps {
  lessonsCompleted: number;
  streakAtual: number;
  level: number;
  gems: number;
  league: LeagueTier;
}

interface BadgeDef {
  title: string;
  icon: LucideIcon;
  unlocked: boolean;
  circleClass: string;
  borderClass: string;
}

export function ProfileBadges({
  lessonsCompleted,
  streakAtual,
  level,
  gems,
  league,
}: ProfileBadgesProps) {
  const badges: BadgeDef[] = [
    {
      title: "Primeira lição",
      icon: Code2,
      unlocked: lessonsCompleted >= 1,
      circleClass: "bg-primary-container",
      borderClass: "border-b-4 border-primary",
    },
    {
      title: "Ofensiva 7 dias",
      icon: Flame,
      unlocked: streakAtual >= 7,
      circleClass: "bg-orange-500",
      borderClass: "border-b-4 border-orange-700",
    },
    {
      title: "Colecionador",
      icon: Gem,
      unlocked: gems >= 50,
      circleClass: "bg-tertiary-container",
      borderClass: "border-b-4 border-[#a68200]",
    },
    {
      title: "Herói da comunidade",
      icon: Users,
      unlocked: league !== LeagueTier.BRONZE || level >= 5,
      circleClass: "bg-secondary",
      borderClass: "border-b-4 border-[#141742]",
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <section className="bg-white dark:bg-surface-container-low rounded-4xl border-2 border-surface-variant block-shadow-card p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold text-on-background font-display">
          Emblemas
        </h3>
        <span className="text-sm font-bold text-secondary tabular-nums">
          {unlockedCount}/{badges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
        {badges.map(({ title, icon: Icon, unlocked, circleClass, borderClass }) => (
          <div key={title} className="flex flex-col items-center text-center gap-3 min-w-0">
            <div
              className={cn(
                "grid w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 shrink-0 place-items-center rounded-full transition-transform",
                borderClass,
                unlocked
                  ? cn(circleClass, "hover:scale-105")
                  : "bg-surface-container-high border-b-4 border-surface-variant"
              )}
            >
              <Icon
                className={cn(
                  "h-8 w-8 sm:h-9 sm:w-9 shrink-0",
                  unlocked ? "text-white" : "text-outline/60"
                )}
              />
            </div>
            <p
              className={cn(
                "text-xs font-bold leading-tight px-1",
                unlocked ? "text-on-background" : "text-outline"
              )}
            >
              {title}
            </p>
          </div>
        ))}
      </div>

      {unlockedCount === 0 && (
        <p className="mt-6 text-sm text-on-surface-variant text-center flex items-center justify-center gap-2">
          <BookOpen className="h-4 w-4 shrink-0" />
          Complete lições e mantenha a ofensiva para desbloquear emblemas!
        </p>
      )}
    </section>
  );
}
