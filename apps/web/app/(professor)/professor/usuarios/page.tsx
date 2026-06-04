import { prisma } from "database";
import { PromoteUserPanel } from "@/components/professor/promote-user-panel";

export default async function ProfessorUsersPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold font-display text-primary mb-2">Usuários</h1>
      <p className="text-secondary mb-8">
        Gerencie os usuários da plataforma e promova alunos a professor.
      </p>
      <PromoteUserPanel initialUsers={users} />
    </div>
  );
}
