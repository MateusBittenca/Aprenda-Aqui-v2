/**
 * Sincroniza trilhas (tracks + units + lessons + chests) do banco local para produção.
 *
 * Uso (recomendado — credenciais em .env.railway, ignorado pelo Git):
 *   cp .env.railway.example .env.railway
 *   pnpm run db:sync-tracks
 *
 * Ou via variáveis de ambiente na linha de comando.
 *
 * PRODUCTION_DATABASE_URL precisa ser a URL **pública** (TCP Proxy) do MySQL no Railway.
 * mysql.railway.internal só funciona dentro da rede do Railway.
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { Prisma, PrismaClient } from "@prisma/client";

function loadRailwayEnvFile() {
  const candidates = [
    resolve(process.cwd(), ".env.railway"),
    resolve(process.cwd(), "../.env.railway"),
    resolve(process.cwd(), "../../.env.railway"),
  ];

  for (const file of candidates) {
    if (!existsSync(file)) continue;

    for (const line of readFileSync(file, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
    break;
  }
}

loadRailwayEnvFile();

const sourceUrl =
  process.env.SOURCE_DATABASE_URL ?? process.env.DATABASE_URL;
const targetUrl =
  process.env.PRODUCTION_DATABASE_URL ?? process.env.TARGET_DATABASE_URL;
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

if (!sourceUrl) {
  console.error("Defina SOURCE_DATABASE_URL ou DATABASE_URL (banco local).");
  process.exit(1);
}

if (!targetUrl) {
  console.error(
    "Defina PRODUCTION_DATABASE_URL em .env.railway (veja .env.railway.example) ou na linha de comando."
  );
  process.exit(1);
}

const source = new PrismaClient({
  datasources: { db: { url: sourceUrl } },
});

const target = new PrismaClient({
  datasources: { db: { url: targetUrl } },
});

type TrackBundle = Prisma.TrackGetPayload<{
  include: {
    units: {
      include: { lessons: true };
      orderBy: { order: "asc" };
    };
    chests: { orderBy: { order: "asc" } };
  };
}>;

async function loadLocalTracks(): Promise<TrackBundle[]> {
  return source.track.findMany({
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
      chests: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });
}

async function createTrackTree(track: TrackBundle) {
  await target.track.create({
    data: {
      id: track.id,
      title: track.title,
      description: track.description,
      icon: track.icon,
      slug: track.slug,
      order: track.order,
      colorPrimary: track.colorPrimary,
      colorDark: track.colorDark,
      colorLight: track.colorLight,
      colorMuted: track.colorMuted,
      colorOnPrimary: track.colorOnPrimary,
      published: track.published,
    },
  });

  for (const unit of track.units) {
    await target.unit.create({
      data: {
        id: unit.id,
        trackId: track.id,
        title: unit.title,
        description: unit.description,
        order: unit.order,
        pathOffset: unit.pathOffset,
      },
    });

    for (const lesson of unit.lessons) {
      await target.lesson.create({
        data: {
          id: lesson.id,
          trackId: track.id,
          unitId: unit.id,
          title: lesson.title,
          type: lesson.type,
          content: lesson.content as Prisma.InputJsonValue,
          solution: lesson.solution as Prisma.InputJsonValue | undefined,
          order: lesson.order,
          xpReward: lesson.xpReward,
          gemsReward: lesson.gemsReward,
          published: lesson.published,
        },
      });
    }
  }

  for (const chest of track.chests) {
    await target.trackChest.create({
      data: {
        id: chest.id,
        trackId: track.id,
        afterLessonId: chest.afterLessonId,
        title: chest.title,
        xpReward: chest.xpReward,
        gemsReward: chest.gemsReward,
        order: chest.order,
      },
    });
  }
}

async function updateTrackTree(track: TrackBundle, existingId: string) {
  await target.track.update({
    where: { id: existingId },
    data: {
      title: track.title,
      description: track.description,
      icon: track.icon,
      order: track.order,
      colorPrimary: track.colorPrimary,
      colorDark: track.colorDark,
      colorLight: track.colorLight,
      colorMuted: track.colorMuted,
      colorOnPrimary: track.colorOnPrimary,
      published: track.published,
    },
  });

  const lessonIdMap = new Map<string, string>();

  for (const unit of track.units) {
    const prodUnit = await target.unit.findFirst({
      where: { trackId: existingId, order: unit.order },
      include: { lessons: true },
    });

    let unitId = prodUnit?.id;

    if (!prodUnit) {
      const created = await target.unit.create({
        data: {
          id: unit.id,
          trackId: existingId,
          title: unit.title,
          description: unit.description,
          order: unit.order,
          pathOffset: unit.pathOffset,
        },
      });
      unitId = created.id;
    } else {
      await target.unit.update({
        where: { id: prodUnit.id },
        data: {
          title: unit.title,
          description: unit.description,
          pathOffset: unit.pathOffset,
        },
      });
      unitId = prodUnit.id;
    }

    for (const lesson of unit.lessons) {
      const prodLesson = await target.lesson.findFirst({
        where: { trackId: existingId, unitId, order: lesson.order },
      });

      if (!prodLesson) {
        const created = await target.lesson.create({
          data: {
            id: lesson.id,
            trackId: existingId,
            unitId,
            title: lesson.title,
            type: lesson.type,
            content: lesson.content as Prisma.InputJsonValue,
            solution: lesson.solution as Prisma.InputJsonValue | undefined,
            order: lesson.order,
            xpReward: lesson.xpReward,
            gemsReward: lesson.gemsReward,
            published: lesson.published,
          },
        });
        lessonIdMap.set(lesson.id, created.id);
      } else {
        await target.lesson.update({
          where: { id: prodLesson.id },
          data: {
            title: lesson.title,
            type: lesson.type,
            content: lesson.content as Prisma.InputJsonValue,
            solution: lesson.solution as Prisma.InputJsonValue | undefined,
            xpReward: lesson.xpReward,
            gemsReward: lesson.gemsReward,
            published: lesson.published,
          },
        });
        lessonIdMap.set(lesson.id, prodLesson.id);
      }
    }
  }

  for (const chest of track.chests) {
    const afterLessonId =
      lessonIdMap.get(chest.afterLessonId) ?? chest.afterLessonId;

    const exists = await target.trackChest.findFirst({
      where: { trackId: existingId, afterLessonId },
    });

    if (!exists) {
      await target.trackChest.create({
        data: {
          id: chest.id,
          trackId: existingId,
          afterLessonId,
          title: chest.title,
          xpReward: chest.xpReward,
          gemsReward: chest.gemsReward,
          order: chest.order,
        },
      });
    }
  }
}

async function main() {
  console.log("Carregando trilhas do banco local...");
  const tracks = await loadLocalTracks();

  console.log(`\n${tracks.length} trilha(s) local(is):`);
  for (const t of tracks) {
    const lessons = t.units.reduce((n, u) => n + u.lessons.length, 0);
    console.log(
      `  - ${t.slug} (${t.title}): ${t.units.length} unidades, ${lessons} lições, published=${t.published}`
    );
  }

  if (dryRun) {
    console.log("\n[DRY_RUN] Nenhuma alteração no banco de produção.");
    return;
  }

  console.log("\nConectando ao banco de produção...");
  const prodSlugs = await target.track.findMany({
    select: { slug: true },
  });
  console.log(
    `Produção tem ${prodSlugs.length} trilha(s): ${prodSlugs.map((t) => t.slug).join(", ") || "(nenhuma)"}`
  );

  for (const track of tracks) {
    const existing = await target.track.findUnique({
      where: { slug: track.slug },
    });

    if (!existing) {
      console.log(`\n+ Criando trilha: ${track.slug}`);
      await createTrackTree(track);
      continue;
    }

    const localLessons = track.units.reduce((n, u) => n + u.lessons.length, 0);
    const prodCounts = await target.unit.count({
      where: { trackId: existing.id },
    });
    const prodLessons = await target.lesson.count({
      where: { trackId: existing.id },
    });

    if (prodLessons >= localLessons && prodCounts >= track.units.length) {
      console.log(`\n= ${track.slug}: já existe em produção (${prodLessons} lições)`);
      await target.track.update({
        where: { id: existing.id },
        data: { published: track.published },
      });
      continue;
    }

    console.log(
      `\n~ Atualizando trilha: ${track.slug} (prod: ${prodLessons} lições, local: ${localLessons})`
    );
    await updateTrackTree(track, existing.id);
  }

  console.log("\nSincronização concluída.");
}

main()
  .catch((err) => {
    console.error("\nErro na sincronização:", err);
    process.exit(1);
  })
  .finally(async () => {
    await source.$disconnect();
    await target.$disconnect();
  });
