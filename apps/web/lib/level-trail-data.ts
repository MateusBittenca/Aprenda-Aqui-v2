import { prisma } from "database";
import { calculateLevel, getMilestoneByLevel } from "@/lib/level-system";
import type { LevelUpPayload } from "@/lib/level-rewards";

export async function getUserLevelContext(userId: string) {
  const [user, titleUnlocks] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        xpTotal: true,
        activeTitleKey: true,
        lastCelebratedLevel: true,
      },
    }),
    prisma.userTitleUnlock.findMany({
      where: { userId },
      select: { titleKey: true, unlockedAt: true },
      orderBy: { unlockedAt: "asc" },
    }),
  ]);

  if (!user) return null;

  const currentLevel = calculateLevel(user.xpTotal);
  let pendingLevelUp: LevelUpPayload | null = null;

  if (currentLevel > user.lastCelebratedLevel) {
    const milestone = getMilestoneByLevel(currentLevel);
    if (milestone) {
      pendingLevelUp = {
        newLevel: currentLevel,
        previousLevel: user.lastCelebratedLevel,
        gemsGranted: 0,
        titleKey: milestone.titleKey,
        titleLabel: milestone.titleLabel,
        levelsGained: currentLevel - user.lastCelebratedLevel,
      };
    }
  }

  return {
    xpTotal: user.xpTotal,
    activeTitleKey: user.activeTitleKey,
    unlockedTitles: titleUnlocks.map((t: { titleKey: string; unlockedAt: Date }) => ({
      titleKey: t.titleKey,
      unlockedAt: t.unlockedAt.toISOString(),
    })),
    pendingLevelUp,
  };
}
