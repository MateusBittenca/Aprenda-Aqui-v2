import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "database";
import { processLevelUps } from "@/lib/level-rewards";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = session.user.id;
  const chestId = params.id;

  const chest = await prisma.trackChest.findUnique({
    where: { id: chestId },
    include: { track: { select: { slug: true } } },
  });

  if (!chest) {
    return NextResponse.json({ error: "Baú não encontrado" }, { status: 404 });
  }

  const existingClaim = await prisma.userChestClaim.findUnique({
    where: { userId_chestId: { userId, chestId } },
  });

  if (existingClaim) {
    return NextResponse.json({ alreadyClaimed: true, xpEarned: 0, gemsEarned: 0 });
  }

  const lessonProgress = await prisma.userProgress.findUnique({
    where: {
      userId_lessonId: { userId, lessonId: chest.afterLessonId },
    },
  });

  if (!lessonProgress?.completed) {
    return NextResponse.json(
      { error: "Complete a lição anterior para abrir este baú" },
      { status: 403 }
    );
  }

  const userBefore = await prisma.user.findUnique({
    where: { id: userId },
    select: { xpTotal: true },
  });
  const xpBefore = userBefore?.xpTotal ?? 0;

  await prisma.$transaction([
    prisma.userChestClaim.create({
      data: {
        userId,
        chestId,
        xpEarned: chest.xpReward,
        gemsEarned: chest.gemsReward,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        xpTotal: { increment: chest.xpReward },
        gems: { increment: chest.gemsReward },
      },
    }),
  ]);

  const { levelUp } = await processLevelUps(userId, xpBefore, xpBefore + chest.xpReward);

  revalidatePath("/dashboard", "layout");
  revalidatePath("/trilhas");
  revalidatePath(`/trilhas/${chest.track.slug}`);
  revalidatePath("/perfil");
  revalidatePath("/ranking");

  return NextResponse.json({
    success: true,
    xpEarned: chest.xpReward,
    gemsEarned: chest.gemsReward,
    trackSlug: chest.track.slug,
    levelUp,
  });
}
