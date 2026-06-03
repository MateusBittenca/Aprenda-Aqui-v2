import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DEFAULT_EDITOR_THEME_KEY, prisma } from "database";
import {
  EDITOR_THEMES,
  getThemeInventoryLookupKeys,
  normalizeEditorThemeKey,
} from "@/lib/editor-themes";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: { themeKey?: string } = {};
  try {
    body = await request.json();
  } catch {
    // corpo inválido tratado abaixo
  }

  const rawThemeKey = body.themeKey;
  if (!rawThemeKey) {
    return NextResponse.json({ error: "Tema inválido" }, { status: 400 });
  }

  const themeKey = normalizeEditorThemeKey(rawThemeKey);
  if (!EDITOR_THEMES[themeKey]) {
    return NextResponse.json({ error: "Tema inválido" }, { status: 400 });
  }

  if (themeKey !== DEFAULT_EDITOR_THEME_KEY) {
    const owned = await prisma.userInventoryItem.findFirst({
      where: {
        userId,
        itemKey: { in: getThemeInventoryLookupKeys(rawThemeKey) },
      },
    });
    if (!owned) {
      return NextResponse.json(
        { error: "Você ainda não possui este tema" },
        { status: 403 }
      );
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { activeEditorThemeKey: themeKey },
  });

  revalidatePath("/loja");
  revalidatePath("/licoes", "layout");

  return NextResponse.json({ success: true, activeEditorThemeKey: themeKey });
}
