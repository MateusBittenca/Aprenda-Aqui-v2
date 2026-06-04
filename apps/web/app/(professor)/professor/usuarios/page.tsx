import { PromoteUserPanel } from "@/components/professor/promote-user-panel";

export default function ProfessorUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold font-display text-primary mb-2">Usuários</h1>
      <p className="text-secondary mb-8">
        Busque um usuário e promova-o a professor da plataforma.
      </p>
      <PromoteUserPanel />
    </div>
  );
}
