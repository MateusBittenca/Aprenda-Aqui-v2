-- CreateTable
CREATE TABLE `track_chests` (
    `id` VARCHAR(191) NOT NULL,
    `track_id` VARCHAR(191) NOT NULL,
    `after_lesson_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'Baú de recompensas',
    `xp_reward` INTEGER NOT NULL DEFAULT 25,
    `gems_reward` INTEGER NOT NULL DEFAULT 10,
    `order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `track_chests_track_id_after_lesson_id_key`(`track_id`, `after_lesson_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_chest_claims` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `chest_id` VARCHAR(191) NOT NULL,
    `xp_earned` INTEGER NOT NULL,
    `gems_earned` INTEGER NOT NULL,
    `claimed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_chest_claims_user_id_chest_id_key`(`user_id`, `chest_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `track_chests` ADD CONSTRAINT `track_chests_track_id_fkey` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `track_chests` ADD CONSTRAINT `track_chests_after_lesson_id_fkey` FOREIGN KEY (`after_lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_chest_claims` ADD CONSTRAINT `user_chest_claims_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_chest_claims` ADD CONSTRAINT `user_chest_claims_chest_id_fkey` FOREIGN KEY (`chest_id`) REFERENCES `track_chests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
