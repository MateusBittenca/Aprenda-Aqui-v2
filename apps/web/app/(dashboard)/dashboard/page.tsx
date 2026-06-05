import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getDashboardStats, getUserProfile } from "@/lib/server-stats";
import { formatNumber } from "@/lib/utils";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { ContinueLearning } from "@/components/dashboard/continue-learning";
import { Achievements } from "@/components/dashboard/achievements";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [profile, stats] = await Promise.all([
    getUserProfile(userId),
    getDashboardStats(userId),
  ]);

  const name = profile?.name?.split(" ")[0] ?? "Aluno";
  const xpToNext = profile?.xpToNextLevel ?? 250;

  return (
    <>
      <section className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-navy mb-1.5 sm:mb-2">
          Olá, {name}!
        </h1>
        <p className="text-base sm:text-lg text-navy/60 leading-relaxed">
          Você está progredindo bem. Faltam{" "}
          <span className="text-primary font-bold">{formatNumber(xpToNext)} XP</span>{" "}
          para o nível {(profile?.level ?? 1) + 1}.
        </p>
      </section>

      {stats && (
        <>
          <StatsGrid
            contributionGraph={stats.contributionGraph}
            xpTotal={stats.xpTotal}
            lessonsCompleted={stats.lessonsCompleted}
          />
          <Achievements
            streak={stats.streakAtual}
            xpWeekly={stats.xpWeekly}
            level={stats.level}
            xpToNextLevel={stats.xpToNextLevel}
          />
          <ContinueLearning lesson={stats.continueLesson} />
        </>
      )}
    </>
  );
}
