import { NextResponse } from "next/server";
import { prisma, UserRole } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { id } = await params;

  let body: { role?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  if (body.role !== "TEACHER" && body.role !== "STUDENT") {
    return NextResponse.json({ error: "Papel inválido" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  if (target.role === UserRole.TEACHER && body.role === "STUDENT") {
    const teacherCount = await prisma.user.count({
      where: { role: UserRole.TEACHER },
    });
    if (teacherCount <= 1) {
      return NextResponse.json(
        { error: "Não é possível rebaixar o último professor" },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: body.role as UserRole },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(updated);
}
