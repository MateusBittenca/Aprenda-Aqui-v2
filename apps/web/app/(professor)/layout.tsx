import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProfessorSidebar } from "@/components/professor/professor-sidebar";

export default async function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfessorSidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
