import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Redireciona após login com base no papel (cookie já aplicado no server). */
export default async function AuthRedirectPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?error=SessionRequired");
  }

  if (session.user.role === "TEACHER") {
    redirect("/professor/trilhas");
  }

  redirect("/dashboard");
}
