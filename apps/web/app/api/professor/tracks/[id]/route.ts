import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";
import {
  revalidateProfessorContent,
  validateTrackInput,
} from "@/lib/professor-validation";

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
  const track = await prisma.track.findUnique({
    where: { id },
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          _count: { select: { lessons: true } },
        },
      },
    },
  });

  if (!track) {
    return NextResponse.json({ error: "Trilha não encontrada" }, { status: 404 });
  }

  return NextResponse.json(track);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { id } = await params;
  const existing = await prisma.track.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Trilha não encontrada" }, { status: 404 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const validated = validateTrackInput(body as Parameters<typeof validateTrackInput>[0], true);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  if (validated.data.slug && validated.data.slug !== existing.slug) {
    const slugTaken = await prisma.track.findUnique({
      where: { slug: validated.data.slug },
    });
    if (slugTaken) {
      return NextResponse.json({ error: "Slug já existe" }, { status: 409 });
    }
  }

  const track = await prisma.track.update({
    where: { id },
    data: validated.data,
  });

  revalidateProfessorContent(track);
  if (existing.slug !== track.slug) {
    revalidateProfessorContent(existing);
  }

  return NextResponse.json(track);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { id } = await params;
  const existing = await prisma.track.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Trilha não encontrada" }, { status: 404 });
  }

  await prisma.track.delete({ where: { id } });
  revalidateProfessorContent(existing);

  return NextResponse.json({ ok: true });
}
