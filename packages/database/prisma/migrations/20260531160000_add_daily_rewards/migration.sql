-- AlterTable
ALTER TABLE `users` ADD COLUMN `daily_reward_next_day` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `daily_reward_last_claim` DATETIME(3) NULL;
