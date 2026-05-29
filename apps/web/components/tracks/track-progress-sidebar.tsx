import Image from "next/image";
import Link from "next/link";
import { Award, Flame } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { LEAGUE_LABELS } from "@/lib/leaderboard";
import { MASCOT, MASCOT_TIPS } from "@/lib/mascot";
import type { LeagueTier } from "database";

interface TrackProgressSidebarProps {
  streak: number;
  xpTotal: number;
  dailyXp: number;
  dailyGoal?: number;
  userLeague: LeagueTier;
  rank?: number;
  lessonsToRanking?: number;
}

export function TrackProgressSidebar({
  streak,
  xpTotal,
  dailyXp,
  dailyGoal = 50,
  userLeague,
  rank,
  lessonsToRanking = 2,
}: TrackProgressSidebarProps) {
  const dailyProgress = Math.min((dailyXp / dailyGoal) * 100, 100);
  const leagueLabel = LEAGUE_LABELS[userLeague];
  const tip =
    lessonsToRanking > 0
      ? `Complete mais ${lessonsToRanking} ${lessonsToRanking === 1 ? "lição" : "lições"} para subir no ranking e ganhar um baú de XP!`
      : MASCOT_TIPS[0];

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-6 lg:sticky lg:top-6 h-fit shrink-0">
      <div className="bg-surface border-4 border-surface-variant rounded-3xl p-6 shadow-sm">
        <h3 className="text-xl font-extrabold text-on-background mb-4 font-display">
          Seu Progresso
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border-b-4 border-surface-variant">
            <span className="text-3xl" aria-hidden>
              🔥
            </span>
            <div>
              <p className="text-xs text-secondary font-bold uppercase tracking-wide">
                Ofensiva
              </p>
              <p className="font-black text-on-background">
                {streak} {streak === 1 ? "dia" : "dias"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border-b-4 border-surface-variant">
            <span className="text-3xl" aria-hidden>
              💎
            </span>
            <div>
              <p className="text-xs text-secondary font-bold uppercase tracking-wide">
                Total XP
              </p>
              <p className="font-black text-on-background">{formatNumber(xpTotal)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-end mb-2">
            <p className="font-bold text-on-background">Meta Diária</p>
            <p className="text-sm font-black text-primary">
              {dailyXp}/{dailyGoal} XP
            </p>
          </div>
          <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container rounded-full progress-glow transition-all duration-500"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-secondary-container border-4 border-secondary/30 rounded-3xl p-6 overflow-hidden relative">
        <p className="text-xs font-black text-on-secondary-container/60 mb-1 uppercase tracking-widest">
          Liga Atual
        </p>
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-10 w-10 text-on-secondary-container fill-on-secondary-container/20" />
          <h3 className="text-2xl font-extrabold text-on-secondary-container font-display">
            {leagueLabel}
          </h3>
        </div>
        <div className="flex justify-between items-center bg-surface-container-highest/40 p-3 rounded-xl">
          <span className="font-bold text-on-secondary-container">Sua Posição</span>
          {rank ? (
            <span className="bg-secondary text-white px-4 py-1 rounded-full font-black text-sm">
              #{rank}
            </span>
          ) : (
            <Link
              href="/ranking"
              className="text-sm font-bold text-on-secondary-container underline"
            >
              Ver ranking
            </Link>
          )}
        </div>
        <Award className="absolute -bottom-4 -right-4 h-32 w-32 text-on-secondary-container opacity-10" />
      </div>

      <div className="flex gap-3 items-start bg-tertiary-container/20 p-4 rounded-2xl border-2 border-dashed border-tertiary-fixed">
        <div className="relative w-16 h-16 shrink-0">
          <Image src={MASCOT.tip} alt="Mascote" fill className="object-contain" />
        </div>
        <div className="text-sm min-w-0">
          <p className="font-bold text-tertiary mb-1 flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 hidden" />
            Dica do Robô:
          </p>
          <p className="text-on-surface-variant leading-snug">{tip}</p>
        </div>
      </div>
    </aside>
  );
}
