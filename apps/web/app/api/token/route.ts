// Este endpoint foi desativado por segurança.
// A conclusão de lições agora é feita via /api/lessons/[id]/complete
// que gerencia a autenticação server-side com getServerSession.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Endpoint removido" }, { status: 410 });
}
