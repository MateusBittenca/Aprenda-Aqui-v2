import { prisma, LeagueTier } from "database";

export function getWeekStart(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekEnd(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 7);
  return end;
}

export function getDaysUntilWeekEnd(): number {
  const now = new Date();
  const day = now.getDay();
  return day === 0 ? 0 : 7 - day;
}

export const LEAGUE_LABELS: Record<LeagueTier, string> = {
  BRONZE: "Liga Bronze",
  SILVER: "Liga Prata",
  GOLD: "Liga Ouro",
  PLATINUM: "Liga Platina",
  DIAMOND: "Liga Diamante",
};

export const LEAGUE_COLORS: Record<LeagueTier, string> = {
  BRONZE: "text-amber-700",
  SILVER: "text-slate-400",
  GOLD: "text-yellow-500",
  PLATINUM: "text-cyan-500",
  DIAMOND: "text-purple-500",
};

export interface LeaderboardRow {
  rank: number;
  userId: string;
  name: string;
  xpWeekly: number;
  league: LeagueTier;
  isCurrentUser: boolean;
}

export async function getUserWeeklyXp(
  userId: string,
  weekStart = getWeekStart()
): Promise<number> {
  const weekEnd = getWeekEnd(weekStart);

  const result = await prisma.userProgress.aggregate({
    where: {
      userId,
      completedAt: { gte: weekStart, lt: weekEnd },
    },
    _sum: { xpEarned: true },
  });

  return result._sum.xpEarned ?? 0;
}

export async function getWeeklyLeaderboard(
  currentUserId?: string
): Promise<{ rows: LeaderboardRow[]; userLeague: LeagueTier; weekStart: Date }> {
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd(weekStart);

  const aggregated = await prisma.userProgress.groupBy({
    by: ["userId"],
    where: {
      completedAt: { gte: weekStart, lt: weekEnd },
    },
    _sum: { xpEarned: true },
    orderBy: { _sum: { xpEarned: "desc" } },
  });

  if (aggregated.length === 0) {
    return { rows: [], userLeague: LeagueTier.BRONZE, weekStart };
  }

  const userIds = aggregated.map((entry: (typeof aggregated)[number]) => entry.userId);

  const [users, leagueEntries] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    }),
    prisma.leaderboardEntry.findMany({
      where: { userId: { in: userIds }, weekStart },
      select: { userId: true, league: true },
    }),
  ]);

  type UserRow = (typeof users)[number];
  type LeagueRow = (typeof leagueEntries)[number];
  type AggregatedRow = (typeof aggregated)[number];

  const userMap = new Map<string, string>(
    users.map((user: UserRow) => [user.id, user.name])
  );
  const leagueMap = new Map<string, LeagueTier>(
    leagueEntries.map((entry: LeagueRow) => [entry.userId, entry.league])
  );

  const rows: LeaderboardRow[] = aggregated.map((entry: AggregatedRow, index: number) => ({
    rank: index + 1,
    userId: entry.userId,
    name: userMap.get(entry.userId) ?? "Usuário",
    xpWeekly: entry._sum.xpEarned ?? 0,
    league: leagueMap.get(entry.userId) ?? LeagueTier.BRONZE,
    isCurrentUser: entry.userId === currentUserId,
  }));

  const userLeague: LeagueTier = currentUserId
    ? (leagueMap.get(currentUserId) ?? LeagueTier.BRONZE)
    : LeagueTier.BRONZE;

  return { rows, userLeague, weekStart };
}
