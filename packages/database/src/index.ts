import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "@prisma/client";
export { gemsForXp } from "./gems";
export {
  DAILY_REWARD_CYCLE_DAYS,
  DAILY_REWARD_TIERS,
  calendarDaysBetween,
  getDailyRewardTier,
  nextDayAfterClaim,
  resolveDailyRewardState,
  startOfCalendarDay,
  type DailyRewardDayStatus,
  type DailyRewardState,
  type DailyRewardTier,
} from "./daily-rewards";
export * from "./level-milestones";
export { syncLevelRewardsForUser } from "./sync-level-rewards";
