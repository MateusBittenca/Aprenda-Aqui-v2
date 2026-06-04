import { NextResponse } from "next/server";
import { gemsForXp, prisma, Prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";
import { revalidateProfessorContent, validateLessonInput } from "@/lib/professor-validation";

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
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { track: true, unit: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lição não encontrada" }, { status: 404 });
  }

  return NextResponse.json(lesson);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { id } = await params;
  const existing = await prisma.lesson.findUnique({
    where: { id },
    include: { track: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Lição não encontrada" }, { status: 404 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const merged = {
    title: body.title ?? existing.title,
    type: body.type ?? existing.type,
    order: body.order ?? existing.order,
    xpReward: body.xpReward ?? existing.xpReward,
    published: body.published ?? existing.published,
    content: body.content ?? existing.content,
    solution: body.solution !== undefined ? body.solution : existing.solution,
  };

  const validated = validateLessonInput(
    merged as Parameters<typeof validateLessonInput>[0],
    false
  );
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const xpReward = validated.data.xpReward ?? existing.xpReward;
  const updateData = {
    title: validated.data.title,
    type: validated.data.type,
    order: validated.data.order,
    xpReward,
    published: validated.data.published,
    content: validated.data.content as Prisma.InputJsonValue,
    solution: validated.data.solution as Prisma.InputJsonValue | undefined,
    gemsReward: gemsForXp(xpReward),
  };

  const lesson = await prisma.lesson.update({
    where: { id },
    data: updateData,
  });

  revalidateProfessorContent(existing.track);
  return NextResponse.json(lesson);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { id } = await params;
  const existing = await prisma.lesson.findUnique({
    where: { id },
    include: { track: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Lição não encontrada" }, { status: 404 });
  }

  await prisma.lesson.delete({ where: { id } });
  revalidateProfessorContent(existing.track);

  return NextResponse.json({ ok: true });
}
