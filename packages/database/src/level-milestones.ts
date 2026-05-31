export type LevelTier = "iniciante" | "explorador" | "especialista" | "mestre" | "lenda";

export interface LevelMilestone {
  level: number;
  xpRequired: number;
  titleKey: string;
  titleLabel: string;
  gemsReward: number;
  tier: LevelTier;
  chapterLabel: string;
}

function gemsForLevel(level: number): number {
  const base = 5 + level * 2;
  const bonus = level % 5 === 0 ? 15 + level * 3 : 0;
  return base + bonus;
}

function tierForLevel(level: number): LevelTier {
  if (level >= 20) return "lenda";
  if (level >= 15) return "mestre";
  if (level >= 10) return "especialista";
  if (level >= 5) return "explorador";
  return "iniciante";
}

function chapterForTier(tier: LevelTier): string {
  switch (tier) {
    case "lenda":
      return "Capítulo V — Lenda do código";
    case "mestre":
      return "Capítulo IV — Mestre";
    case "especialista":
      return "Capítulo III — Especialista";
    case "explorador":
      return "Capítulo II — Explorador";
    default:
      return "Capítulo I — Iniciante";
  }
}

const TITLE_BY_TIER: Record<LevelTier, string[]> = {
  iniciante: ["Iniciante", "Aprendiz", "Estudante", "Praticante"],
  explorador: ["Explorador", "Desbravador", "Aventureiro", "Pioneiro", "Trilheiro"],
  especialista: ["Especialista", "Veterano", "Proficiente", "Referência", "Estrategista"],
  mestre: ["Mestre", "Sábio do código", "Arquiteto", "Mentor", "Guardião"],
  lenda: [
    "Lenda do código",
    "Lenda viva",
    "Ícone",
    "Mítico",
    "Supremo",
    "Imortal",
    "Transcendente",
    "Eterno",
    "Absoluto",
    "Lendário máximo",
  ],
};

function titleForLevel(level: number): { titleKey: string; titleLabel: string } {
  const tier = tierForLevel(level);
  const titles = TITLE_BY_TIER[tier];
  const indexInTier = level - (tier === "iniciante" ? 1 : tier === "explorador" ? 5 : tier === "especialista" ? 10 : tier === "mestre" ? 15 : 20);
  const label = titles[Math.min(indexInTier, titles.length - 1)] ?? titles[0];
  const titleKey = `${tier}-${indexInTier + 1}`;
  return { titleKey, titleLabel: label };
}

export const MAX_LEVEL = 30;
export const XP_PER_LEVEL = 1000;

export const LEVEL_MILESTONES: LevelMilestone[] = Array.from({ length: MAX_LEVEL }, (_, i) => {
  const level = i + 1;
  const tier = tierForLevel(level);
  const { titleKey, titleLabel } = titleForLevel(level);
  return {
    level,
    xpRequired: level * XP_PER_LEVEL,
    titleKey,
    titleLabel,
    gemsReward: gemsForLevel(level),
    tier,
    chapterLabel: chapterForTier(tier),
  };
});

export function getMilestoneByLevel(level: number): LevelMilestone | undefined {
  return LEVEL_MILESTONES.find((m) => m.level === level);
}

export function getLevelFromXp(xpTotal: number): number {
  return Math.floor(xpTotal / XP_PER_LEVEL) + 1;
}

export function getTitleLabelByKey(titleKey: string): string {
  const found = LEVEL_MILESTONES.find((m) => m.titleKey === titleKey);
  return found?.titleLabel ?? "Iniciante";
}

export function getMilestonesForLevelRange(fromLevel: number, toLevel: number): LevelMilestone[] {
  return LEVEL_MILESTONES.filter((m) => m.level >= fromLevel && m.level <= toLevel);
}
