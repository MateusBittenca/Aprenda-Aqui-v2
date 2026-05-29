import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findFriendshipBetween } from "@/lib/community";
import { notifyFriendRequest } from "@/lib/notifications";
import { prisma, FriendshipStatus } from "database";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let body: { targetUserId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const targetUserId = body.targetUserId?.trim();
  if (!targetUserId) {
    return NextResponse.json({ error: "Usuário alvo é obrigatório" }, { status: 400 });
  }

  if (targetUserId === session.user.id) {
    return NextResponse.json({ error: "Você não pode adicionar a si mesmo" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const existing = await findFriendshipBetween(session.user.id, targetUserId);
  if (existing) {
    if (existing.status === FriendshipStatus.ACCEPTED) {
      return NextResponse.json({ error: "Vocês já são amigos" }, { status: 409 });
    }
    if (existing.status === FriendshipStatus.PENDING) {
      return NextResponse.json({ error: "Já existe um convite pendente" }, { status: 409 });
    }
    if (existing.status === FriendshipStatus.DECLINED) {
      await prisma.friendship.update({
        where: { id: existing.id },
        data: {
          requesterId: session.user.id,
          addresseeId: targetUserId,
          status: FriendshipStatus.PENDING,
        },
      });
      await notifyFriendRequest({
        friendshipId: existing.id,
        requesterId: session.user.id,
        addresseeId: targetUserId,
        requesterName: session.user.name ?? "Alguém",
      });
      revalidatePath("/comunidade");
      revalidatePath(`/perfil/${targetUserId}`);
      revalidatePath("/", "layout");
      return NextResponse.json({ id: existing.id, status: "pending_sent" });
    }
  }

  const friendship = await prisma.friendship.create({
    data: {
      requesterId: session.user.id,
      addresseeId: targetUserId,
      status: FriendshipStatus.PENDING,
    },
  });

  await notifyFriendRequest({
    friendshipId: friendship.id,
    requesterId: session.user.id,
    addresseeId: targetUserId,
    requesterName: session.user.name ?? "Alguém",
  });

  revalidatePath("/comunidade");
  revalidatePath(`/perfil/${targetUserId}`);
  revalidatePath("/", "layout");

  return NextResponse.json({ id: friendship.id, status: "pending_sent" });
}
