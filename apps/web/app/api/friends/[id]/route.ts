import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, FriendshipStatus } from "database";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const friendship = await prisma.friendship.findUnique({
    where: { id: params.id },
  });

  if (!friendship) {
    return NextResponse.json({ error: "Amizade não encontrada" }, { status: 404 });
  }

  if (
    friendship.requesterId !== session.user.id &&
    friendship.addresseeId !== session.user.id
  ) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  if (friendship.status !== FriendshipStatus.ACCEPTED) {
    return NextResponse.json({ error: "Amizade não está ativa" }, { status: 400 });
  }

  const otherUserId =
    friendship.requesterId === session.user.id
      ? friendship.addresseeId
      : friendship.requesterId;

  await prisma.friendship.delete({ where: { id: params.id } });

  revalidatePath("/comunidade");
  revalidatePath(`/perfil/${otherUserId}`);
  revalidatePath("/", "layout");

  return NextResponse.json({ status: "removed" });
}
