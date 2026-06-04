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
  const track = await prisma.track.findUnique({ where: { id } });
  if (!track) {
    return NextResponse.json({ error: "Trilha não encontrada" }, { status: 404 });
  }

  const units = await prisma.unit.findMany({
    where: { trackId: id },
    orderBy: { order: "asc" },
    include: { _count: { select: { lessons: true } } },
  });

  return NextResponse.json(units);
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { id: trackId } = await params;
  const track = await prisma.track.findUnique({ where: { id: trackId } });
  if (!track) {
    return NextResponse.json({ error: "Trilha não encontrada" }, { status: 404 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const validated = validateUnitInput(body as Parameters<typeof validateUnitInput>[0]);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const maxOrder = await prisma.unit.aggregate({
    where: { trackId },
    _max: { order: true },
  });
  const order = validated.data.order ?? (maxOrder._max.order ?? 0) + 1;

  const unit = await prisma.unit.create({
    data: {
      trackId,
      title: validated.data.title!,
      description: validated.data.description ?? null,
      order,
      pathOffset: validated.data.pathOffset ?? 0,
    },
  });

  revalidateProfessorContent(track);
  return NextResponse.json(unit, { status: 201 });
}
