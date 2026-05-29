import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyFriendAccepted } from "@/lib/notifications";
import { prisma, FriendshipStatus } from "database";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const friendship = await prisma.friendship.findUnique({
    where: { id: params.id },
    include: { addressee: { select: { name: true } } },
  });

  if (!friendship) {
    return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
  }

  if (friendship.addresseeId !== session.user.id) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  if (friendship.status !== FriendshipStatus.PENDING) {
    return NextResponse.json({ error: "Convite não está pendente" }, { status: 400 });
  }

  await prisma.friendship.update({
    where: { id: params.id },
    data: { status: FriendshipStatus.ACCEPTED },
  });

  await notifyFriendAccepted({
    friendshipId: friendship.id,
    requesterId: friendship.requesterId,
    addresseeId: friendship.addresseeId,
    addresseeName: friendship.addressee.name,
  });

  revalidatePath("/comunidade");
  revalidatePath(`/perfil/${friendship.requesterId}`);
  revalidatePath("/", "layout");

  return NextResponse.json({ status: "friends" });
}
