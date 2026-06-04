import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStoreItem, prisma } from "database";
import {
  getThemeInventoryLookupKeys,
  normalizeEditorThemeKey,
} from "@/lib/editor-themes";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: { itemKey?: string } = {};
  try {
    body = await request.json();
  } catch {
    // corpo inválido tratado abaixo
  }

  const itemKey = body.itemKey;
  if (!itemKey) {
    return NextResponse.json({ error: "Item não informado" }, { status: 400 });
  }

  const item = getStoreItem(itemKey);
  if (!item) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { gems: true, xpBoostExpiresAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  if (item.effect === "editor_theme") {
    const owned = await prisma.userInventoryItem.findFirst({
      where: {
        userId,
        itemKey: { in: getThemeInventoryLookupKeys(itemKey) },
      },
    });
    if (owned) {
      return NextResponse.json({ error: "Você já possui este item" }, { status: 409 });
    }
  }

  if (user.gems < item.priceGems) {
    return NextResponse.json(
      { error: "Gemas insuficientes", gems: user.gems, cost: item.priceGems },
      { status: 402 }
    );
  }

  const now = new Date();
  const userData: {
    gems: { decrement: number };
    streakFreezes?: { increment: number };
    xpBoostExpiresAt?: Date;
    activeEditorThemeKey?: string;
  } = {
    gems: { decrement: item.priceGems },
  };

  if (item.effect === "streak_freeze") {
    userData.streakFreezes = { increment: item.quantity ?? 1 };
  } else if (item.effect === "xp_boost") {
    const base =
      user.xpBoostExpiresAt && user.xpBoostExpiresAt > now ? user.xpBoostExpiresAt : now;
    userData.xpBoostExpiresAt = new Date(base.getTime() + (item.boostDurationMs ?? 0));
  } else if (item.effect === "editor_theme") {
    userData.activeEditorThemeKey = normalizeEditorThemeKey(itemKey);
  }

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: userData }),
    ...(item.effect === "editor_theme"
      ? [
          prisma.userInventoryItem.create({
            data: { userId, itemKey: normalizeEditorThemeKey(itemKey) },
          }),
        ]
      : []),
  ]);

  revalidatePath("/loja");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/licoes", "layout");

  const result = updatedUser as { gems: number; xpBoostExpiresAt: Date | null };

  return NextResponse.json({
    success: true,
    itemKey,
    gems: result.gems,
    xpBoostExpiresAt: result.xpBoostExpiresAt,
  });
}
