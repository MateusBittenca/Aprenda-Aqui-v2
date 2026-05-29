-- AlterTable
ALTER TABLE `tracks` ADD COLUMN `color_primary` VARCHAR(191) NOT NULL DEFAULT '#58CC02',
    ADD COLUMN `color_dark` VARCHAR(191) NOT NULL DEFAULT '#1f5100',
    ADD COLUMN `color_light` VARCHAR(191) NOT NULL DEFAULT '#87fe45',
    ADD COLUMN `color_muted` VARCHAR(191) NOT NULL DEFAULT '#2b6c00',
    ADD COLUMN `color_on_primary` VARCHAR(191) NOT NULL DEFAULT '#ffffff';

-- Dados iniciais por trilha
UPDATE `tracks` SET
  `color_primary` = '#fb923c',
  `color_dark` = '#c2410c',
  `color_light` = '#fdba74',
  `color_muted` = '#ea580c',
  `color_on_primary` = '#ffffff'
WHERE `slug` = 'html';

UPDATE `tracks` SET
  `color_primary` = '#3b82f6',
  `color_dark` = '#1d4ed8',
  `color_light` = '#93c5fd',
  `color_muted` = '#2563eb',
  `color_on_primary` = '#ffffff'
WHERE `slug` = 'css';

UPDATE `tracks` SET
  `color_primary` = '#eab308',
  `color_dark` = '#a16207',
  `color_light` = '#fde047',
  `color_muted` = '#ca8a04',
  `color_on_primary` = '#422006'
WHERE `slug` = 'javascript';
