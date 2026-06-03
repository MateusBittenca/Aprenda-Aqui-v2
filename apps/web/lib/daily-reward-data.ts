import { prisma, resolveDailyRewardState, type DailyRewardState } from "database";

export type { DailyRewardState };

export async function getDailyRewardStateForUser(
  userId: string
): Promise<DailyRewardState | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      dailyRewardNextDay: true,
      dailyRewardLastClaim: true,
    },
  });

  if (!user) return null;

  return resolveDailyRewardState({
    dailyRewardNextDay: user.dailyRewardNextDay,
    dailyRewardLastClaim: user.dailyRewardLastClaim,
  });
}
