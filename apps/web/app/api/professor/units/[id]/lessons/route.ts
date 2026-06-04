import { NextResponse } from "next/server";
import { gemsForXp, prisma, Prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";
import { revalidateProfessorContent, validateLessonInput } from "@/lib/professor-validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { id: unitId } = await params;
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { track: true },
  });
  if (!unit) {
    return NextResponse.json({ error: "Unidade não encontrada" }, { status: 404 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const validated = validateLessonInput(body as Parameters<typeof validateLessonInput>[0]);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const maxOrder = await prisma.lesson.aggregate({
    where: { unitId },
    _max: { order: true },
  });
  const order = validated.data.order ?? (maxOrder._max.order ?? 0) + 1;
  const xpReward = validated.data.xpReward ?? 10;

  const lesson = await prisma.lesson.create({
    data: {
      trackId: unit.trackId,
      unitId,
      title: validated.data.title!,
      type: validated.data.type!,
      content: validated.data.content as Prisma.InputJsonValue,
      solution: (validated.data.solution ?? undefined) as Prisma.InputJsonValue | undefined,
      order,
      xpReward,
      gemsReward: gemsForXp(xpReward),
      published: validated.data.published ?? false,
    },
  });

  revalidateProfessorContent(unit.track);
  return NextResponse.json(lesson, { status: 201 });
}
