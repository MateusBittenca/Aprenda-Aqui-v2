import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";
import { revalidateProfessorContent } from "@/lib/professor-validation";

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
  const unit = await prisma.unit.findUnique({
    where: { id },
    include: { track: true },
  });
  if (!unit) {
    return NextResponse.json({ error: "Unidade não encontrada" }, { status: 404 });
  }

  let body: { direction?: "up" | "down"; order?: number } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const siblings = await prisma.unit.findMany({
    where: { trackId: unit.trackId },
    orderBy: { order: "asc" },
  });

  const currentIndex = siblings.findIndex((s) => s.id === id);
  if (currentIndex === -1) {
    return NextResponse.json({ error: "Unidade não encontrada" }, { status: 404 });
  }

  if (typeof body.order === "number") {
    await prisma.unit.update({
      where: { id },
      data: { order: body.order },
    });
  } else if (body.direction === "up" && currentIndex > 0) {
    const prev = siblings[currentIndex - 1];
    await prisma.$transaction([
      prisma.unit.update({ where: { id }, data: { order: prev.order } }),
      prisma.unit.update({ where: { id: prev.id }, data: { order: unit.order } }),
    ]);
  } else if (body.direction === "down" && currentIndex < siblings.length - 1) {
    const next = siblings[currentIndex + 1];
    await prisma.$transaction([
      prisma.unit.update({ where: { id }, data: { order: next.order } }),
      prisma.unit.update({ where: { id: next.id }, data: { order: unit.order } }),
    ]);
  }

  revalidateProfessorContent(unit.track);
  const units = await prisma.unit.findMany({
    where: { trackId: unit.trackId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(units);
}
