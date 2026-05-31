import {
  LEVEL_MILESTONES,
  MAX_LEVEL,
  XP_PER_LEVEL,
  getLevelFromXp,
  getMilestoneByLevel,
  getTitleLabelByKey,
  type LevelMilestone,
  type LevelTier,
} from "database/level-milestones";

export { getMilestoneByLevel };

export {
  LEVEL_MILESTONES,
  MAX_LEVEL,
  XP_PER_LEVEL,
  getTitleLabelByKey,
  type LevelMilestone,
  type LevelTier,
};

export function calculateLevel(xpTotal: number): number {
  return getLevelFromXp(xpTotal);
}

export function xpToNextLevel(xpTotal: number): number {
  return calculateLevel(xpTotal) * XP_PER_LEVEL - xpTotal;
}

export function xpInCurrentLevel(xpTotal: number): number {
  return xpTotal - (calculateLevel(xpTotal) - 1) * XP_PER_LEVEL;
}

export function getLevelTitle(level: number): string {
  return getMilestoneByLevel(level)?.titleLabel ?? "Iniciante";
}

export function getTitleLabel(titleKey: string): string {
  return getTitleLabelByKey(titleKey);
}

export type LevelTrailNodeStatus = "completed" | "current" | "locked";

export interface LevelTrailNode {
  milestone: LevelMilestone;
  status: LevelTrailNodeStatus;
  showChapter: boolean;
}

export function buildLevelTrail(
  currentLevel: number,
  windowBefore = 2,
  windowAfter = 8
): LevelTrailNode[] {
  const minLevel = Math.max(1, currentLevel - windowBefore);
  const maxLevel = Math.min(MAX_LEVEL, currentLevel + windowAfter);
  const nodes: LevelTrailNode[] = [];
  let lastChapter: string | null = null;

  for (let level = minLevel; level <= maxLevel; level++) {
    const milestone = getMilestoneByLevel(level);
    if (!milestone) continue;

    let status: LevelTrailNodeStatus;
    if (level < currentLevel) status = "completed";
    else if (level === currentLevel) status = "current";
    else status = "locked";

    const showChapter = milestone.chapterLabel !== lastChapter;
    lastChapter = milestone.chapterLabel;

    nodes.push({ milestone, status, showChapter });
  }

  return nodes;
}
