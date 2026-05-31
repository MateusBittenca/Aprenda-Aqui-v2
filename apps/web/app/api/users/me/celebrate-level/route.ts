import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateLevel } from "@/lib/level-system";
import { prisma } from "database";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { xpTotal: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const currentLevel = calculateLevel(user.xpTotal);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastCelebratedLevel: currentLevel },
  });

  return NextResponse.json({ lastCelebratedLevel: currentLevel });
}
