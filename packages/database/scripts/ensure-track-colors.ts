/**
 * Garante que as colunas de cor existem em `tracks`.
 * Idempotente — seguro rodar várias vezes.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COLUMNS = [
  { name: "color_primary", default: "#58CC02" },
  { name: "color_dark", default: "#1f5100" },
  { name: "color_light", default: "#87fe45" },
  { name: "color_muted", default: "#2b6c00" },
  { name: "color_on_primary", default: "#ffffff" },
] as const;

const TRACK_UPDATES = [
  {
    slug: "html",
    color_primary: "#fb923c",
    color_dark: "#c2410c",
    color_light: "#fdba74",
    color_muted: "#ea580c",
    color_on_primary: "#ffffff",
  },
  {
    slug: "css",
    color_primary: "#3b82f6",
    color_dark: "#1d4ed8",
    color_light: "#93c5fd",
    color_muted: "#2563eb",
    color_on_primary: "#ffffff",
  },
  {
    slug: "javascript",
    color_primary: "#eab308",
    color_dark: "#a16207",
    color_light: "#fde047",
    color_muted: "#ca8a04",
    color_on_primary: "#422006",
  },
] as const;

async function columnExists(columnName: string): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) AS count
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'tracks'
      AND COLUMN_NAME = ${columnName}
  `;
  return Number(rows[0]?.count ?? 0) > 0;
}

async function main() {
  console.log("Verificando colunas de cor em tracks...");

  for (const col of COLUMNS) {
    const exists = await columnExists(col.name);
    if (exists) {
      console.log(`  ✓ ${col.name} já existe`);
      continue;
    }

    console.log(`  + Adicionando ${col.name}...`);
    await prisma.$executeRawUnsafe(
      `ALTER TABLE \`tracks\` ADD COLUMN \`${col.name}\` VARCHAR(191) NOT NULL DEFAULT '${col.default}'`
    );
  }

  for (const track of TRACK_UPDATES) {
    await prisma.$executeRaw`
      UPDATE tracks SET
        color_primary = ${track.color_primary},
        color_dark = ${track.color_dark},
        color_light = ${track.color_light},
        color_muted = ${track.color_muted},
        color_on_primary = ${track.color_on_primary}
      WHERE slug = ${track.slug}
    `;
    console.log(`  ✓ Cores atualizadas para trilha: ${track.slug}`);
  }

  console.log("\nConcluído! Reinicie o servidor Next.js (pnpm dev).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
