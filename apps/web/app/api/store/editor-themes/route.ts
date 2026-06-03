import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStoreStateForUser } from "@/lib/store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const state = await getStoreStateForUser(session.user.id);
  if (!state) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    activeThemeKey: state.activeEditorThemeKey,
    ownedThemeKeys: state.ownedItemKeys,
  });
}
