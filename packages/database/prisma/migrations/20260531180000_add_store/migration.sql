-- AlterTable
ALTER TABLE `users` ADD COLUMN `streak_freezes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `xp_boost_expires_at` DATETIME(3) NULL,
    ADD COLUMN `active_editor_theme_key` VARCHAR(191) NOT NULL DEFAULT 'aprenda-aqui';

-- CreateTable
CREATE TABLE `user_inventory_items` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `item_key` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_inventory_items_user_id_item_key_key`(`user_id`, `item_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_inventory_items` ADD CONSTRAINT `user_inventory_items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
