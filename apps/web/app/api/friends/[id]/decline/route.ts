import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
  });

  if (!friendship) {
    return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
  }

  const isAddressee = friendship.addresseeId === session.user.id;
  const isRequester = friendship.requesterId === session.user.id;

  if (!isAddressee && !isRequester) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  if (friendship.status !== FriendshipStatus.PENDING) {
    return NextResponse.json({ error: "Convite não está pendente" }, { status: 400 });
  }

  await prisma.friendship.update({
    where: { id: params.id },
    data: { status: FriendshipStatus.DECLINED },
  });

  const otherUserId = isAddressee ? friendship.requesterId : friendship.addresseeId;
  revalidatePath("/comunidade");
  revalidatePath(`/perfil/${otherUserId}`);
  revalidatePath("/", "layout");

  return NextResponse.json({ status: "declined" });
}
