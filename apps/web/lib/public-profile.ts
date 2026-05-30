import { prisma, LeagueTier } from "database";
import {
  getUserWeeklyXp,
  getWeeklyLeaderboard,
  getWeekStart,
  type LeaderboardRow,
} from "@/lib/leaderboard";
import { calculateLevel, getWeeklyXpDays, xpToNextLevel } from "@/lib/server-stats";

export interface PublicUserProfile {
  id: string;
  name: string;
  image: string | null;
  xpTotal: number;
  gems: number;
  streakAtual: number;
  createdAt: Date;
  level: number;
  xpToNextLevel: number;
  lessonsCompleted: number;
  xpWeekly: number;
  weeklyRank: number | null;
  league: LeagueTier;
  weeklyXpDays: { label: string; xp: number }[];
}

export async function getPublicUserProfile(
  userId: string
): Promise<PublicUserProfile | null> {
  const weekStart = getWeekStart();

  const [user, lessonsCompleted, xpWeekly, weeklyXpDays, leagueEntry, leaderboard] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          image: true,
          xpTotal: true,
          gems: true,
          streakAtual: true,
          createdAt: true,
        },
      }),
      prisma.userProgress.count({ where: { userId, completed: true } }),
      getUserWeeklyXp(userId, weekStart),
      getWeeklyXpDays(userId),
      prisma.leaderboardEntry.findUnique({
        where: { userId_weekStart: { userId, weekStart } },
        select: { league: true },
      }),
      getWeeklyLeaderboard(userId),
    ]);

  if (!user) return null;

  const weeklyRank =
    leaderboard.rows.find((row: LeaderboardRow) => row.userId === userId)?.rank ?? null;

  return {
    id: user.id,
    name: user.name,
    image: user.image,
    xpTotal: user.xpTotal,
    gems: user.gems,
    streakAtual: user.streakAtual,
    createdAt: user.createdAt,
    level: calculateLevel(user.xpTotal),
    xpToNextLevel: xpToNextLevel(user.xpTotal),
    lessonsCompleted,
    xpWeekly,
    weeklyRank,
    league: leagueEntry?.league ?? LeagueTier.BRONZE,
    weeklyXpDays,
  };
}
