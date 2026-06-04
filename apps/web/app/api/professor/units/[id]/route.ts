import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";
import { revalidateProfessorContent, validateUnitInput } from "@/lib/professor-validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { id } = await params;
  const unit = await prisma.unit.findUnique({
    where: { id },
    include: {
      track: true,
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!unit) {
    return NextResponse.json({ error: "Unidade não encontrada" }, { status: 404 });
  }

  return NextResponse.json(unit);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { id } = await params;
  const existing = await prisma.unit.findUnique({
    where: { id },
    include: { track: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Unidade não encontrada" }, { status: 404 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const validated = validateUnitInput(body as Parameters<typeof validateUnitInput>[0], true);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const unit = await prisma.unit.update({
    where: { id },
    data: validated.data,
  });

  revalidateProfessorContent(existing.track);
  return NextResponse.json(unit);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { id } = await params;
  const existing = await prisma.unit.findUnique({
    where: { id },
    include: { track: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Unidade não encontrada" }, { status: 404 });
  }

  await prisma.unit.delete({ where: { id } });
  revalidateProfessorContent(existing.track);

  return NextResponse.json({ ok: true });
}
