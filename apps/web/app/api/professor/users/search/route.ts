import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";

export async function GET(request: Request) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const { status, body } = teacherAuthResponse(auth.error);
    return NextResponse.json(body, { status });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [{ email: { contains: q } }, { name: { contains: q } }],
        }
      : undefined,
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ users });
}
