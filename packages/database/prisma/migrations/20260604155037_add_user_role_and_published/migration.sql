-- AlterTable
ALTER TABLE `lessons` ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `tracks` ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('STUDENT', 'TEACHER') NOT NULL DEFAULT 'STUDENT';
