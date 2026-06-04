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
export { gemsForXp } from "./gems.ts";
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
} from "./daily-rewards.ts";
export * from "./level-milestones.ts";
export { syncLevelRewardsForUser } from "./sync-level-rewards.ts";
export {
  DEFAULT_EDITOR_THEME_KEY,
  STORE_ITEMS,
  XP_BOOST_DURATION_MS,
  XP_BOOST_MULTIPLIER,
  getFeaturedStoreItems,
  getStoreItem,
  getStoreItemsByCategory,
  getThemeItemKeys,
  type StoreItem,
  type StoreItemCategory,
  type StoreItemEffect,
} from "./store-items.ts";
