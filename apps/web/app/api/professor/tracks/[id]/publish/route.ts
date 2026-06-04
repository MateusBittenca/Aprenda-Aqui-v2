import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";
import { revalidateProfessorContent } from "@/lib/professor-validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
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

  let body: { published?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  if (typeof body.published !== "boolean") {
    return NextResponse.json({ error: "Campo published é obrigatório" }, { status: 400 });
  }

  const updated = await prisma.track.update({
    where: { id },
    data: { published: body.published },
  });

  revalidateProfessorContent(updated);
  return NextResponse.json(updated);
}
