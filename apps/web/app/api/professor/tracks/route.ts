import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";
import { revalidateProfessorContent } from "@/lib/professor-validation";
import { validateTrackInput } from "@/lib/professor-validation";

export async function GET() {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const tracks = await prisma.track.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { units: true, lessons: true } },
    },
  });

  return NextResponse.json(tracks);
}

export async function POST(request: Request) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const validated = validateTrackInput(body as Parameters<typeof validateTrackInput>[0]);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const existing = await prisma.track.findUnique({
    where: { slug: validated.data.slug! },
  });
  if (existing) {
    return NextResponse.json({ error: "Slug já existe" }, { status: 409 });
  }

  const maxOrder = await prisma.track.aggregate({ _max: { order: true } });
  const order = validated.data.order ?? (maxOrder._max.order ?? 0) + 1;

  const track = await prisma.track.create({
    data: {
      title: validated.data.title!,
      description: validated.data.description!,
      slug: validated.data.slug!,
      icon: validated.data.icon!,
      order,
      colorPrimary: validated.data.colorPrimary ?? "#58CC02",
      colorDark: validated.data.colorDark ?? "#1f5100",
      colorLight: validated.data.colorLight ?? "#87fe45",
      colorMuted: validated.data.colorMuted ?? "#2b6c00",
      colorOnPrimary: validated.data.colorOnPrimary ?? "#ffffff",
      published: validated.data.published ?? false,
    },
  });

  revalidateProfessorContent(track);
  return NextResponse.json(track, { status: 201 });
}
