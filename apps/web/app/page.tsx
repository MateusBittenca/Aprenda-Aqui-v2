import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(session.user.role === "TEACHER" ? "/professor" : "/dashboard");
  }

  return <LandingPage />;
}
