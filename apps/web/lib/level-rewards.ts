import { prisma } from "database";
import {
  getLevelFromXp,
  getMilestoneByLevel,
  getMilestonesForLevelRange,
} from "database/level-milestones";

export interface LevelUpPayload {
  newLevel: number;
  previousLevel: number;
  gemsGranted: number;
  titleKey: string;
  titleLabel: string;
  levelsGained: number;
}

export interface ProcessLevelUpsResult {
  levelUp: LevelUpPayload | null;
}

export async function processLevelUps(
  userId: string,
  xpBefore: number,
  xpAfter: number
): Promise<ProcessLevelUpsResult> {
  const levelBefore = getLevelFromXp(xpBefore);
  const levelAfter = getLevelFromXp(xpAfter);

  if (levelAfter <= levelBefore) {
    return { levelUp: null };
  }

  const milestones = getMilestonesForLevelRange(levelBefore + 1, levelAfter);
  let totalGems = 0;
  let activeTitleKey = "";
  let topTitleLabel = "";

  for (const milestone of milestones) {
    totalGems += milestone.gemsReward;
    activeTitleKey = milestone.titleKey;
    topTitleLabel = milestone.titleLabel;

    await prisma.userTitleUnlock.upsert({
      where: {
        userId_titleKey: { userId, titleKey: milestone.titleKey },
      },
      create: { userId, titleKey: milestone.titleKey },
      update: {},
    });
  }

  const topMilestone = getMilestoneByLevel(levelAfter);
  if (topMilestone) {
    activeTitleKey = topMilestone.titleKey;
    topTitleLabel = topMilestone.titleLabel;
  }

  if (totalGems > 0 || activeTitleKey) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(totalGems > 0 ? { gems: { increment: totalGems } } : {}),
        ...(activeTitleKey ? { activeTitleKey } : {}),
      },
    });
  }

  return {
    levelUp: {
      newLevel: levelAfter,
      previousLevel: levelBefore,
      gemsGranted: totalGems,
      titleKey: activeTitleKey,
      titleLabel: topTitleLabel,
      levelsGained: levelAfter - levelBefore,
    },
  };
}
