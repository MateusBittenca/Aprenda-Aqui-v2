import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LIVES_REFILL_GEM_COST } from "@/lib/lesson-lives";
import { prisma } from "database";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { gems: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  if (user.gems < LIVES_REFILL_GEM_COST) {
    return NextResponse.json(
      {
        error: "Gemas insuficientes",
        gems: user.gems,
        cost: LIVES_REFILL_GEM_COST,
      },
      { status: 402 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { gems: { decrement: LIVES_REFILL_GEM_COST } },
    select: { gems: true },
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath("/perfil");

  return NextResponse.json({
    gems: updated.gems,
    cost: LIVES_REFILL_GEM_COST,
  });
}
