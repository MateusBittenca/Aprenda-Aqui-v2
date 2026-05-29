import Image from "next/image";
import Link from "next/link";
import { LEAGUE_COLORS, LEAGUE_LABELS } from "@/lib/leaderboard";
import { formatNumber, cn } from "@/lib/utils";
import { MASCOT } from "@/lib/mascot";
import { FriendActionButtonProfile } from "@/components/community/friend-action-button";
import type { FriendshipView } from "@/lib/community";
import type { PublicUserProfile } from "@/lib/public-profile";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Flame,
  Map,
  Settings,
  Shield,
  Trophy,
  Zap,
} from "lucide-react";

interface UserProfileViewProps {
  profile: PublicUserProfile;
  isOwnProfile: boolean;
  email?: string;
  friendshipStatus?: FriendshipView;
  friendshipId?: string | null;
}

export function UserProfileView({
  profile,
  isOwnProfile,
  email,
  friendshipStatus = "none",
  friendshipId = null,
}: UserProfileViewProps) {
  const xpProgress = Math.min(((1000 - profile.xpToNextLevel) / 1000) * 100, 100);
  const leagueLabel = LEAGUE_LABELS[profile.league];
  const leagueColor = LEAGUE_COLORS[profile.league];

  const memberSince = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(profile.createdAt));

  return (
    <div className="max-w-[800px] mx-auto">
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

      <div className="card-elevation rounded-4xl p-8 border-2 border-surface-container-highest mb-6 flex flex-col sm:flex-row items-center gap-6">
        {profile.image ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-primary-container">
            <Image src={profile.image} alt={profile.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-4xl font-black text-on-primary-container shrink-0">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-on-background font-display">
            {profile.name}
          </h1>
          {isOwnProfile && email && (
            <p className="text-on-surface-variant mt-1">{email}</p>
          )}
          <p className="text-xs text-outline mt-1">Membro desde {memberSince}</p>

          <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
            <span className="px-3 py-1 bg-primary-container/20 text-primary text-sm font-bold rounded-full">
              Nível {profile.level}
            </span>
            <span className="px-3 py-1 bg-error-container text-error text-sm font-bold rounded-full flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-error" />
              {profile.streakAtual} dias de ofensiva
            </span>
            <span
              className={cn(
                "px-3 py-1 bg-surface-container-high text-sm font-bold rounded-full flex items-center gap-1",
                leagueColor
              )}
            >
              <Shield className="h-3.5 w-3.5" />
              {leagueLabel}
            </span>
            {profile.weeklyRank !== null && (
              <span className="px-3 py-1 bg-tertiary-container/30 text-tertiary text-sm font-bold rounded-full flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" />
                #{profile.weeklyRank} no ranking semanal
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card-elevation rounded-4xl p-6 border-2 border-surface-container-highest mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-on-background">
            Progresso para o Nível {profile.level + 1}
          </span>
          <span className="text-sm text-on-surface-variant font-bold">
            {formatNumber(profile.xpToNextLevel)} XP restantes
          </span>
        </div>
        <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
          <div
            className="bg-primary-container h-full rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <p className="text-xs text-on-surface-variant mt-2">
          {formatNumber(profile.xpTotal)} XP acumulados no total
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: Zap,
            label: "XP Total",
            value: formatNumber(profile.xpTotal),
            color: "text-primary",
          },
          {
            icon: Flame,
            label: "Ofensiva",
            value: `${profile.streakAtual} dias`,
            color: "text-error",
          },
          {
            icon: BookOpen,
            label: "Lições",
            value: String(profile.lessonsCompleted),
            color: "text-secondary",
          },
          {
            icon: Trophy,
            label: "XP Semanal",
            value: formatNumber(profile.xpWeekly),
            color: "text-tertiary",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="card-elevation rounded-3xl p-4 border-2 border-surface-container-highest text-center"
          >
            <Icon className={cn("h-6 w-6 mx-auto mb-2", color)} />
            <p className="text-xl font-extrabold text-on-background font-display">{value}</p>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wide mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {isOwnProfile ? (
        <div className="space-y-3 mb-6">
          <Link
            href="/trilhas"
            className="flex items-center justify-between p-4 card-elevation rounded-3xl border-2 border-surface-container-highest hover:border-primary-container hover:bg-primary-container/5 bouncy-transition"
          >
            <div className="flex items-center gap-3">
              <Map className="h-5 w-5 text-primary" />
              <span className="font-bold text-on-background">Continuar aprendendo</span>
            </div>
            <ChevronRight className="h-5 w-5 text-outline" />
          </Link>

          <Link
            href="/ranking"
            className="flex items-center justify-between p-4 card-elevation rounded-3xl border-2 border-surface-container-highest hover:border-primary-container hover:bg-primary-container/5 bouncy-transition"
          >
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-tertiary" />
              <span className="font-bold text-on-background">Ver ranking semanal</span>
            </div>
            <ChevronRight className="h-5 w-5 text-outline" />
          </Link>

          <Link
            href="/configuracoes"
            className="flex items-center justify-between p-4 card-elevation rounded-3xl border-2 border-surface-container-highest hover:border-primary-container hover:bg-primary-container/5 bouncy-transition"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-secondary" />
              <span className="font-bold text-on-background">Configurações da conta</span>
            </div>
            <ChevronRight className="h-5 w-5 text-outline" />
          </Link>
        </div>
      ) : (
        <div className="mb-6 space-y-4">
          <FriendActionButtonProfile
            targetUserId={profile.id}
            friendshipStatus={friendshipStatus}
            friendshipId={friendshipId}
          />
          <div className="p-5 rounded-3xl border-2 border-surface-container-highest bg-surface-container-low text-center">
            <p className="text-sm text-on-surface-variant">
              Este é o perfil público de{" "}
              <strong className="text-on-background">{profile.name}</strong>. Adicione como amigo
              para ver as atividades no feed da comunidade!
            </p>
          </div>
        </div>
      )}

      {isOwnProfile && (
        <div className="flex gap-4 items-center bg-tertiary-container/20 p-5 rounded-3xl border-2 border-dashed border-tertiary-fixed">
          <div className="relative w-16 h-16 shrink-0">
            <Image src={MASCOT.default} alt="Mascote" fill className="object-contain" />
          </div>
          <div>
            <p className="font-bold text-tertiary mb-1">Dica do Robô</p>
            <p className="text-sm text-on-surface-variant">
              Pratique todos os dias para manter sua ofensiva e subir no ranking!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
