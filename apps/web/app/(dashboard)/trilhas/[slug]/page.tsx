import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "database";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/lib/server-stats";
import { getWeeklyLeaderboard } from "@/lib/leaderboard";
import { buildLessonPath, countLessonsToRanking } from "@/lib/track-path";
import { LearningPath } from "@/components/tracks/learning-path";
import { TrackProgressSidebar } from "@/components/tracks/track-progress-sidebar";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackIconBadge } from "@/lib/track-icons";
import { getTrackTheme } from "@/lib/track-theme";

interface TrackPageProps {
  params: { slug: string };
  searchParams: { completed?: string; xp?: string; gems?: string };
}

export const dynamic = "force-dynamic";

async function getDailyXp(userId: string): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const result = await prisma.userProgress.aggregate({
    where: { userId, completedAt: { gte: start } },
    _sum: { xpEarned: true },
  });

  return result._sum.xpEarned ?? 0;
}

export default async function TrackDetailPage({ params, searchParams }: TrackPageProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const track = await prisma.track.findUnique({
    where: { slug: params.slug },
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!track) notFound();

  const theme = getTrackTheme(track);

  const completedIds = new Set<string>();
  if (userId) {
    const progress = await prisma.userProgress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    });
    progress.forEach((p: { lessonId: string }) => completedIds.add(p.lessonId));
  }

  const justCompleted = searchParams.completed;
  const xpEarned = searchParams.xp ? Number(searchParams.xp) : 0;
  const gemsEarned = searchParams.gems ? Number(searchParams.gems) : 0;

  const pathNodes = buildLessonPath(track.units, completedIds, justCompleted);

  const [profile, leaderboard, dailyXp] = userId
    ? await Promise.all([
        getUserProfile(userId),
        getWeeklyLeaderboard(userId),
        getDailyXp(userId),
      ])
    : [null, null, 0];

  const currentRank = leaderboard?.rows.find((r) => r.isCurrentUser)?.rank;
  const lessonsToRanking = countLessonsToRanking(pathNodes);

  return (
    <div
      className={cn("max-w-container-max mx-auto", theme.className)}
      style={theme.cssVars}
    >
      {justCompleted && (
        <div className="track-banner mb-6 p-4 border-2 rounded-3xl flex items-center gap-4">
          <Trophy className="track-text h-8 w-8 shrink-0" />
          <div>
            <p className="font-extrabold text-on-background">Lição concluída!</p>
            {(xpEarned > 0 || gemsEarned > 0) && (
              <p className="text-sm text-on-surface-variant">
                Você ganhou{" "}
                {xpEarned > 0 && (
                  <span className="track-banner-text font-bold">+{xpEarned} XP</span>
                )}
                {xpEarned > 0 && gemsEarned > 0 && " e "}
                {gemsEarned > 0 && (
                  <span className="text-secondary font-bold">+{gemsEarned} gemas</span>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        <section className="flex-grow w-full min-w-0 flex flex-col items-center">
          <div className="w-full max-w-2xl text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TrackIconBadge iconKey={track.icon} slug={track.slug} size="lg" />
              <h1 className="track-title text-3xl md:text-4xl font-black font-display">
                Trilha {track.title}
              </h1>
            </div>
            <p className="track-text text-lg">{track.description}</p>
          </div>

          <LearningPath
            nodes={pathNodes}
            trackIcon={track.icon ?? undefined}
            trackSlug={track.slug}
            trackColors={track}
            theme={theme}
          />

          <Link
            href="/trilhas"
            className="track-link mt-4 text-sm text-on-surface-variant transition-colors"
          >
            ← Voltar para todas as trilhas
          </Link>
        </section>

        {userId && profile && (
          <TrackProgressSidebar
            streak={profile.streakAtual}
            xpTotal={profile.xpTotal}
            dailyXp={dailyXp}
            userLeague={leaderboard?.userLeague ?? "BRONZE"}
            rank={currentRank}
            lessonsToRanking={lessonsToRanking}
          />
        )}
      </div>
    </div>
  );
}
