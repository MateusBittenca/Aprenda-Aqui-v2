import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getWeeklyLeaderboard,
  getDaysUntilWeekEnd,
  LEAGUE_LABELS,
  LEAGUE_COLORS,
  type LeaderboardRow,
} from "@/lib/leaderboard";
import { LeaderboardRowLink } from "@/components/ranking/leaderboard-row-link";
import { cn } from "@/lib/utils";
import { Shield, Trophy, Info, Award } from "lucide-react";

export default async function RankingPage() {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const { rows, userLeague } = await getWeeklyLeaderboard(currentUserId);
  const daysLeft = getDaysUntilWeekEnd();
  const leagueLabel = LEAGUE_LABELS[userLeague];
  const leagueColor = LEAGUE_COLORS[userLeague];

  const currentUserRow = rows.find((r: LeaderboardRow) => r.isCurrentUser);
  const promotionZoneEnd = Math.min(3, rows.length);

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="relative mb-4">
          <div className="w-28 h-28 bg-surface-container-high rounded-full flex items-center justify-center border-b-8 border-surface-variant">
            <Shield className={cn("h-16 w-16", leagueColor)} />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-tertiary-container p-2 rounded-full shadow-lg border-2 border-surface-container-lowest">
            <Trophy className="h-5 w-5 text-on-tertiary-container fill-on-tertiary-container" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-on-background font-display">{leagueLabel}</h1>
        <p className="text-secondary mt-2 max-w-md">
          {daysLeft === 0
            ? "A rodada termina hoje! Dê o seu melhor."
            : `Os 3 primeiros sobem de liga! Faltam ${daysLeft} ${daysLeft === 1 ? "dia" : "dias"} para o fim da rodada.`}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="card-elevation rounded-4xl p-10 border-2 border-surface-container-highest text-center">
          <Trophy className="h-12 w-12 text-outline mx-auto mb-4" />
          <h2 className="text-xl font-bold text-on-background mb-2">Nenhum participante ainda</h2>
          <p className="text-on-surface-variant">
            Complete lições esta semana para aparecer no ranking!
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-4xl border-2 border-surface-container-highest overflow-hidden shadow-sm">
          <div className="grid grid-cols-[60px_1fr_100px] gap-4 p-4 bg-surface-container-low border-b-2 border-surface-container-highest items-center">
            <span className="text-xs font-bold text-secondary text-center uppercase tracking-wider">
              Rank
            </span>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Estudante
            </span>
            <span className="text-xs font-bold text-secondary text-right uppercase tracking-wider">
              XP Semanal
            </span>
          </div>

          <div className="divide-y divide-surface-container-highest">
            {rows.map((row: LeaderboardRow, index: number) => {
              const showPromotionZone =
                index === promotionZoneEnd && promotionZoneEnd < rows.length;

              return (
                <div key={row.userId}>
                  {showPromotionZone && (
                    <div className="bg-primary-container/10 px-4 py-2 text-center border-y-2 border-primary-container/20">
                      <span className="text-[11px] text-primary font-bold uppercase tracking-widest">
                        Zona de Promoção
                      </span>
                    </div>
                  )}

                  <LeaderboardRowLink row={row} currentUserRow={currentUserRow} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-tertiary-container/20 p-5 rounded-3xl border-b-4 border-tertiary-container flex items-start gap-4">
          <div className="p-2 bg-tertiary-container rounded-xl shrink-0">
            <Info className="h-5 w-5 text-on-tertiary-container" />
          </div>
          <div>
            <h3 className="font-bold text-on-tertiary-container mb-1">Como funciona</h3>
            <p className="text-sm text-on-tertiary-container/80">
              Complete lições para ganhar XP semanal. Os 3 primeiros sobem de liga ao final da
              semana. Toque em um estudante para ver o perfil.
            </p>
          </div>
        </div>

        <div className="bg-secondary-container/20 p-5 rounded-3xl border-b-4 border-secondary-container flex items-start gap-4">
          <div className="p-2 bg-secondary-container rounded-xl shrink-0">
            <Award className="h-5 w-5 text-on-secondary-container" />
          </div>
          <div>
            <h3 className="font-bold text-on-secondary-container mb-1">Recompensas</h3>
            <p className="text-sm text-on-secondary-container/80">
              O Top 3 ganha emblemas exclusivos e XP bônus ao final da semana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
