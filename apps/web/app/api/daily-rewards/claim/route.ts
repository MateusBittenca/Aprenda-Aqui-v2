import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  getDailyRewardTier,
  nextDayAfterClaim,
  prisma,
  resolveDailyRewardState,
} from "database";
import { authOptions } from "@/lib/auth";
import { processLevelUps } from "@/lib/level-rewards";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      xpTotal: true,
      gems: true,
      dailyRewardNextDay: true,
      dailyRewardLastClaim: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const beforeState = resolveDailyRewardState({
    dailyRewardNextDay: user.dailyRewardNextDay,
    dailyRewardLastClaim: user.dailyRewardLastClaim,
  });

  if (!beforeState.canClaim) {
    return NextResponse.json(
      { error: "Você já resgatou a recompensa de hoje. Volte amanhã!" },
      { status: 400 }
    );
  }

  const dayToClaim = beforeState.currentDay;
  const tier = getDailyRewardTier(dayToClaim);
  const xpBefore = user.xpTotal;
  const xpAfter = xpBefore + tier.xp;
  const now = new Date();
  const nextDay = nextDayAfterClaim(dayToClaim);

  await prisma.user.update({
    where: { id: userId },
    data: {
      gems: { increment: tier.gems },
      xpTotal: { increment: tier.xp },
      dailyRewardNextDay: nextDay,
      dailyRewardLastClaim: now,
    },
  });

  const { levelUp } =
    tier.xp > 0 ? await processLevelUps(userId, xpBefore, xpAfter) : { levelUp: null };

  const state = resolveDailyRewardState({
    dailyRewardNextDay: nextDay,
    dailyRewardLastClaim: now,
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath("/perfil");
  revalidatePath("/ranking");

  return NextResponse.json({
    success: true,
    dayClaimed: dayToClaim,
    gemsEarned: tier.gems,
    xpEarned: tier.xp,
    levelUp,
    state,
  });
}
