import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { markNotificationRead } from "@/lib/notifications";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const ok = await markNotificationRead(params.id, session.user.id);
  if (!ok) {
    return NextResponse.json({ error: "Notificação não encontrada" }, { status: 404 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ read: true });
}
