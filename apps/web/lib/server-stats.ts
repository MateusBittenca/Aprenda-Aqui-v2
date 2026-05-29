import { prisma } from "database";
import { getUserWeeklyXp } from "@/lib/leaderboard";
import {
  buildContributionGraph,
  toDateKey,
  type ContributionGraphData,
} from "@/lib/contribution-graph";

export function calculateLevel(xpTotal: number): number {
  return Math.floor(xpTotal / 1000) + 1;
}

export function xpToNextLevel(xpTotal: number): number {
  return calculateLevel(xpTotal) * 1000 - xpTotal;
}

async function getWeeklyXpData(userId: string) {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const progress = await prisma.userProgress.findMany({
    where: { userId, completedAt: { gte: sevenDaysAgo } },
    select: { completedAt: true, xpEarned: true },
  });

  const dayLabels = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
  const xpByDay = new Map<string, number>();

  progress.forEach((p: { completedAt: Date; xpEarned: number }) => {
    const d = new Date(p.completedAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    xpByDay.set(key, (xpByDay.get(key) ?? 0) + p.xpEarned);
  });

  const days: { label: string; xp: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    days.push({ label: dayLabels[d.getDay()], xp: xpByDay.get(key) ?? 0 });
  }

  return days;
}

async function getContributionGraphData(userId: string): Promise<ContributionGraphData> {
  const weeksCount = 52;
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  const rangeStart = new Date(end);
  rangeStart.setDate(rangeStart.getDate() - weeksCount * 7 + 1);
  rangeStart.setHours(0, 0, 0, 0);

  const progress = await prisma.userProgress.findMany({
    where: { userId, completedAt: { gte: rangeStart } },
    select: { completedAt: true, xpEarned: true },
  });

  const xpByDate = new Map<string, number>();

  progress.forEach((p: { completedAt: Date; xpEarned: number }) => {
    const key = toDateKey(new Date(p.completedAt));
    xpByDate.set(key, (xpByDate.get(key) ?? 0) + p.xpEarned);
  });

  return buildContributionGraph(xpByDate, weeksCount);
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  xpTotal: number;
  streakAtual: number;
  ultimaAtividade: Date | null;
  level: number;
  xpToNextLevel: number;
}

export interface DashboardStats {
  xpTotal: number;
  streakAtual: number;
  lessonsCompleted: number;
  weeklyXp: { label: string; xp: number }[];
  contributionGraph: ContributionGraphData;
  xpWeekly: number;
  level: number;
  xpToNextLevel: number;
  continueLesson: {
    lessonId: string;
    title: string;
    trackTitle: string;
    trackSlug: string;
    unitTitle: string;
    type: string;
    colorPrimary: string;
    colorDark: string;
    colorLight: string;
    colorMuted: string;
    colorOnPrimary: string;
  } | null;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      xpTotal: true,
      streakAtual: true,
      ultimaAtividade: true,
    },
  });

  if (!user) return null;

  return {
    ...user,
    level: calculateLevel(user.xpTotal),
    xpToNextLevel: xpToNextLevel(user.xpTotal),
  };
}

export async function getDashboardStats(userId: string): Promise<DashboardStats | null> {
  const [user, lessonsCompleted, weeklyXp, contributionGraph, allLessons, completedIds, xpWeekly] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { xpTotal: true, streakAtual: true },
      }),
      prisma.userProgress.count({ where: { userId, completed: true } }),
      getWeeklyXpData(userId),
      getContributionGraphData(userId),
      prisma.lesson.findMany({
        orderBy: [
          { track: { order: "asc" } },
          { unit: { order: "asc" } },
          { order: "asc" },
        ],
        include: { track: true, unit: true },
      }),
      prisma.userProgress.findMany({
        where: { userId, completed: true },
        select: { lessonId: true },
      }),
      getUserWeeklyXp(userId),
    ]);

  if (!user) return null;

  const completedSet = new Set(
    completedIds.map((p: { lessonId: string }) => p.lessonId)
  );
  const nextLesson =
    allLessons.find((l: { id: string }) => !completedSet.has(l.id)) ?? null;

  return {
    xpTotal: user.xpTotal,
    streakAtual: user.streakAtual,
    lessonsCompleted,
    weeklyXp,
    contributionGraph,
    xpWeekly,
    level: calculateLevel(user.xpTotal),
    xpToNextLevel: xpToNextLevel(user.xpTotal),
    continueLesson: nextLesson
      ? {
          lessonId: nextLesson.id,
          title: nextLesson.title,
          trackTitle: nextLesson.track.title,
          trackSlug: nextLesson.track.slug,
          unitTitle: nextLesson.unit?.title ?? "",
          type: nextLesson.type,
          colorPrimary: nextLesson.track.colorPrimary,
          colorDark: nextLesson.track.colorDark,
          colorLight: nextLesson.track.colorLight,
          colorMuted: nextLesson.track.colorMuted,
          colorOnPrimary: nextLesson.track.colorOnPrimary,
        }
      : null,
  };
}
