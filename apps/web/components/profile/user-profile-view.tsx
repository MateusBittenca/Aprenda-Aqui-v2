import Image from "next/image";
import Link from "next/link";
import { LEAGUE_LABELS } from "@/lib/leaderboard";
import { formatNumber, cn } from "@/lib/utils";
import { FriendActionButtonProfile } from "@/components/community/friend-action-button";
import { ProfileBadges } from "@/components/profile/profile-badges";
import { ProfileWeeklyProgress } from "@/components/profile/profile-weekly-progress";
import type { FriendshipView } from "@/lib/community";
import type { PublicUserProfile } from "@/lib/public-profile";
import {
  ArrowLeft,
  BookOpen,
  Flame,
  Pencil,
  Settings,
  Star,
  Verified,
} from "lucide-react";

interface UserProfileViewProps {
  profile: PublicUserProfile;
  isOwnProfile: boolean;
  email?: string;
  friendshipStatus?: FriendshipView;
  friendshipId?: string | null;
}

function getLevelTitle(level: number): string {
  if (level >= 20) return "Lenda do código";
  if (level >= 15) return "Mestre";
  if (level >= 10) return "Especialista";
  if (level >= 5) return "Explorador";
  return "Iniciante";
}

export function UserProfileView({
  profile,
  isOwnProfile,
  email,
  friendshipStatus = "none",
  friendshipId = null,
}: UserProfileViewProps) {
  const xpInLevel = 1000 - profile.xpToNextLevel;
  const xpProgress = Math.min((xpInLevel / 1000) * 100, 100);
  const levelTitle = getLevelTitle(profile.level);
  const leagueLabel = LEAGUE_LABELS[profile.league];

  return (
    <div className="max-w-[1200px] mx-auto">
      {!isOwnProfile && (
        <div className="flex flex-wrap gap-4 mb-6">
          <Link
            href="/comunidade"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à comunidade
          </Link>
          <Link
            href="/ranking"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
          >
            Ver ranking
          </Link>
        </div>
      )}

      {/* Header: avatar + identidade + progresso de nível */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mb-10">
        <div className="md:col-span-4 flex justify-center">
          <div className="relative inline-flex">
            {profile.image ? (
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary-container ring-4 ring-surface block-shadow-card bg-white">
                <Image src={profile.image} alt={profile.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="grid w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 place-items-center rounded-full border-4 border-primary-container ring-4 ring-surface block-shadow-card bg-gradient-to-br from-primary-container to-primary shadow-inner">
                <span className="font-display text-4xl sm:text-5xl font-black leading-none text-on-primary-container">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {isOwnProfile && (
              <Link
                href="/configuracoes"
                className="absolute bottom-0 right-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-primary text-on-primary block-shadow-primary bouncy-transition hover:brightness-110 active:translate-y-0.5"
                aria-label="Editar perfil"
              >
                <Pencil className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              </Link>
            )}
          </div>
        </div>

        <div className="md:col-span-8 text-center md:text-left space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-on-background font-display tracking-tight">
              {profile.name}
            </h1>
            {isOwnProfile && email && (
              <p className="text-on-surface-variant text-sm">{email}</p>
            )}
          </div>

          {isOwnProfile && (
            <Link
              href="/configuracoes"
              className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface px-5 py-2 rounded-full border-2 border-surface-variant font-bold text-sm bouncy-transition hover:bg-surface-container"
            >
              <Settings className="h-4 w-4 text-secondary" />
              Editar perfil
            </Link>
          )}

          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-bold border-b-2 border-secondary">
              <Verified className="h-4 w-4 shrink-0" />
              Nível {profile.level} · {levelTitle}
            </div>

            {profile.weeklyRank !== null && (
              <p className="text-sm font-bold text-on-surface-variant">
                #{profile.weeklyRank} no ranking semanal · {leagueLabel}
              </p>
            )}
          </div>

          <div className="w-full max-w-md mx-auto md:mx-0 space-y-2 pt-1">
            <div className="bg-surface-container-high h-5 sm:h-6 rounded-full overflow-hidden border-2 border-surface-variant">
              <div
                className="bg-primary-container h-full rounded-full progress-glow transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-sm font-bold text-on-surface-variant">
              {formatNumber(xpInLevel)} / 1.000 XP para o Nível {profile.level + 1}
            </p>
          </div>
        </div>
      </section>

      {!isOwnProfile && (
        <div className="mb-8 max-w-md mx-auto md:mx-0">
          <FriendActionButtonProfile
            targetUserId={profile.id}
            friendshipStatus={friendshipStatus}
            friendshipId={friendshipId}
          />
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {[
          {
            icon: Star,
            label: "XP total",
            value: formatNumber(profile.xpTotal),
            iconWrap: "bg-primary-container/20",
            iconColor: "text-primary fill-primary",
          },
          {
            icon: Flame,
            label: "Ofensiva atual",
            value: `${profile.streakAtual} ${profile.streakAtual === 1 ? "dia" : "dias"}`,
            iconWrap: "bg-orange-100 dark:bg-orange-950/40",
            iconColor: "text-orange-500 fill-orange-500",
          },
          {
            icon: BookOpen,
            label: "Lições concluídas",
            value: String(profile.lessonsCompleted),
            iconWrap: "bg-secondary-container/30",
            iconColor: "text-secondary",
          },
        ].map(({ icon: Icon, label, value, iconWrap, iconColor }) => (
          <div
            key={label}
            className="bg-white dark:bg-surface-container-low p-4 md:p-5 rounded-3xl border-2 border-surface-variant block-shadow-card flex items-center gap-4 bouncy-transition hover:border-primary-container/40"
          >
            <div
              className={cn(
                "grid w-14 h-14 md:w-16 md:h-16 shrink-0 place-items-center rounded-full",
                iconWrap
              )}
            >
              <Icon className={cn("h-7 w-7 md:h-8 md:w-8 shrink-0", iconColor)} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-secondary">{label}</p>
              <p className="text-2xl font-black text-on-background font-display">{value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Emblemas + progresso semanal */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <ProfileBadges
            lessonsCompleted={profile.lessonsCompleted}
            streakAtual={profile.streakAtual}
            level={profile.level}
            gems={profile.gems}
            league={profile.league}
          />
        </div>
        <div className="xl:col-span-5 min-w-0">
          <ProfileWeeklyProgress days={profile.weeklyXpDays} />
        </div>
      </div>
    </div>
  );
}
