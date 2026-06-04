import type { PrismaClient } from "@prisma/client";
import {
  getLevelFromXp,
  getMilestoneByLevel,
  getMilestonesForLevelRange,
} from "./level-milestones";

export interface SyncLevelRewardsResult {
  level: number;
  activeTitleKey: string;
  totalGemsFromLevels: number;
}

export async function syncLevelRewardsForUser(
  prisma: PrismaClient,
  userId: string,
  xpTotal: number
): Promise<SyncLevelRewardsResult> {
  const level = getLevelFromXp(xpTotal);
  const milestones = getMilestonesForLevelRange(1, level);
  let totalGemsFromLevels = 0;
  let activeTitleKey = "iniciante";

  for (const milestone of milestones) {
    totalGemsFromLevels += milestone.gemsReward;
    activeTitleKey = milestone.titleKey;

    await prisma.userTitleUnlock.upsert({
      where: {
        userId_titleKey: { userId, titleKey: milestone.titleKey },
      },
      create: {
        userId,
        titleKey: milestone.titleKey,
      },
      update: {},
    });
  }

  const topMilestone = getMilestoneByLevel(level);
  if (topMilestone) {
    activeTitleKey = topMilestone.titleKey;
  }

  return { level, activeTitleKey, totalGemsFromLevels };
}
