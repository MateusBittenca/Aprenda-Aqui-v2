export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  xp: number;
  level: ContributionLevel;
}

export interface ContributionGraphData {
  weeks: ContributionDay[][];
  totalXpInPeriod: number;
  activeDays: number;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function xpToContributionLevel(xp: number): ContributionLevel {
  if (xp <= 0) return 0;
  if (xp <= 10) return 1;
  if (xp <= 25) return 2;
  if (xp <= 50) return 3;
  return 4;
}

export function buildContributionGraph(
  xpByDate: Map<string, number>,
  weeksCount = 52
): ContributionGraphData {
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  const rangeStart = new Date(end);
  rangeStart.setDate(rangeStart.getDate() - weeksCount * 7 + 1);

  const gridStart = new Date(rangeStart);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const weeks: ContributionDay[][] = [];
  const cursor = new Date(gridStart);

  while (cursor <= end) {
    const week: ContributionDay[] = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(cursor);
      day.setDate(cursor.getDate() + i);

      if (day > end) {
        week.push({ date: "", xp: 0, level: 0 });
        continue;
      }

      const key = toDateKey(day);
      const xp = day >= rangeStart ? (xpByDate.get(key) ?? 0) : 0;

      week.push({
        date: key,
        xp,
        level: xpToContributionLevel(xp),
      });
    }

    weeks.push(week);
    cursor.setDate(cursor.getDate() + 7);
  }

  let totalXpInPeriod = 0;
  let activeDays = 0;

  xpByDate.forEach((xp, key) => {
    if (key >= toDateKey(rangeStart) && key <= toDateKey(end) && xp > 0) {
      totalXpInPeriod += xp;
      activeDays += 1;
    }
  });

  return { weeks, totalXpInPeriod, activeDays };
}

export const CONTRIBUTION_LEVEL_CLASS: Record<ContributionLevel, string> = {
  0: "bg-surface-container-highest hover:ring-1 hover:ring-outline/30",
  1: "bg-primary-container/30 hover:ring-1 hover:ring-primary/40",
  2: "bg-primary-container/55 hover:ring-1 hover:ring-primary/50",
  3: "bg-primary-container/80 hover:ring-1 hover:ring-primary/60",
  4: "bg-primary-container hover:ring-1 hover:ring-primary",
};

export function formatContributionTooltip(date: string, xp: number): string {
  if (!date) return "";
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));

  if (xp <= 0) return `${formatted}: nenhum XP`;
  return `${formatted}: ${xp} XP`;
}
