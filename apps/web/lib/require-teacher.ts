import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";

type TeacherSession = Session & {
  user: { id: string; role: "TEACHER" };
};

export type TeacherAuthResult =
  | { ok: true; session: TeacherSession }
  | { ok: false; error: "unauthenticated" | "forbidden" };

export async function requireTeacher(): Promise<TeacherAuthResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "unauthenticated" };
  }
  if (session.user.role !== "TEACHER") {
    return { ok: false, error: "forbidden" };
  }
  return { ok: true, session: session as TeacherSession };
}

export function teacherAuthResponse(error: "unauthenticated" | "forbidden") {
  if (error === "unauthenticated") {
    return { status: 401, body: { error: "Não autenticado" } };
  }
  return { status: 403, body: { error: "Acesso negado" } };
}
