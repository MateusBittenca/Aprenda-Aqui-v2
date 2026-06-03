export const DAILY_REWARD_CYCLE_DAYS = 7;

export interface DailyRewardTier {
  day: number;
  gems: number;
  xp: number;
}

/** Recompensas escalonadas ao longo de 7 dias consecutivos. */
export const DAILY_REWARD_TIERS: DailyRewardTier[] = [
  { day: 1, gems: 10, xp: 0 },
  { day: 2, gems: 15, xp: 25 },
  { day: 3, gems: 20, xp: 0 },
  { day: 4, gems: 30, xp: 50 },
  { day: 5, gems: 40, xp: 0 },
  { day: 6, gems: 50, xp: 75 },
  { day: 7, gems: 100, xp: 150 },
];

export function getDailyRewardTier(day: number): DailyRewardTier {
  const tier = DAILY_REWARD_TIERS.find((t) => t.day === day);
  if (!tier) {
    return DAILY_REWARD_TIERS[0]!;
  }
  return tier;
}

export function startOfCalendarDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function calendarDaysBetween(earlier: Date, later: Date): number {
  const a = startOfCalendarDay(earlier).getTime();
  const b = startOfCalendarDay(later).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export interface DailyRewardUserFields {
  dailyRewardNextDay: number;
  dailyRewardLastClaim: Date | null;
}

export interface DailyRewardDayStatus {
  day: number;
  gems: number;
  xp: number;
  status: "claimed" | "available" | "locked";
}

export interface DailyRewardState {
  days: DailyRewardDayStatus[];
  canClaim: boolean;
  claimedToday: boolean;
  currentDay: number;
  streakBroken: boolean;
  nextDay: number;
}

export function resolveDailyRewardState(
  fields: DailyRewardUserFields
): DailyRewardState {
  const today = startOfCalendarDay(new Date());
  let nextDay = Math.min(Math.max(fields.dailyRewardNextDay, 1), DAILY_REWARD_CYCLE_DAYS);
  let canClaim = true;
  let claimedToday = false;
  let streakBroken = false;
  let currentDay = nextDay;

  if (fields.dailyRewardLastClaim) {
    const last = startOfCalendarDay(fields.dailyRewardLastClaim);
    const diff = calendarDaysBetween(last, today);

    if (diff === 0) {
      canClaim = false;
      claimedToday = true;
      currentDay = nextDay === 1 ? DAILY_REWARD_CYCLE_DAYS : nextDay - 1;
    } else if (diff === 1) {
      canClaim = true;
      currentDay = nextDay;
    } else {
      canClaim = true;
      streakBroken = true;
      nextDay = 1;
      currentDay = 1;
    }
  } else {
    currentDay = 1;
    nextDay = 1;
  }

  const completedThrough = claimedToday
    ? currentDay
    : canClaim
      ? nextDay - 1
      : 0;

  const days: DailyRewardDayStatus[] = DAILY_REWARD_TIERS.map((tier) => {
    let status: DailyRewardDayStatus["status"] = "locked";
    if (tier.day <= completedThrough) {
      status = "claimed";
    } else if (canClaim && tier.day === currentDay) {
      status = "available";
    }
    return { ...tier, status };
  });

  return {
    days,
    canClaim,
    claimedToday,
    currentDay,
    streakBroken,
    nextDay,
  };
}

export function nextDayAfterClaim(claimedDay: number): number {
  return claimedDay >= DAILY_REWARD_CYCLE_DAYS ? 1 : claimedDay + 1;
}
