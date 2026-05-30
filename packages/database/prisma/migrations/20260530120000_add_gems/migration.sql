-- AlterTable
ALTER TABLE `users` ADD COLUMN `gems` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `lessons` ADD COLUMN `gems_reward` INTEGER NOT NULL DEFAULT 5;

-- Preencher recompensa de gemas proporcional ao XP das lições existentes
UPDATE `lessons` SET `gems_reward` = GREATEST(1, FLOOR(`xp_reward` / 2));
