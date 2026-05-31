-- AlterTable
ALTER TABLE `users` ADD COLUMN `active_title_key` VARCHAR(191) NOT NULL DEFAULT 'iniciante',
    ADD COLUMN `last_celebrated_level` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `user_title_unlocks` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `title_key` VARCHAR(191) NOT NULL,
    `unlocked_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_title_unlocks_user_id_title_key_key`(`user_id`, `title_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_title_unlocks` ADD CONSTRAINT `user_title_unlocks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
