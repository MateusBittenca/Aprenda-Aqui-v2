import Link from "next/link";
import { UserX } from "lucide-react";

export default function ProfileNotFound() {
  return (
    <div className="max-w-[480px] mx-auto text-center py-16">
      <UserX className="h-14 w-14 text-outline mx-auto mb-4" />
      <h1 className="text-2xl font-extrabold text-on-background font-display mb-2">
        Usuário não encontrado
      </h1>
      <p className="text-on-surface-variant mb-6">
        Este perfil não existe ou foi removido.
      </p>
      <Link
        href="/ranking"
        className="inline-flex px-5 py-2.5 bg-primary-container text-on-primary-container font-bold rounded-xl border-b-4 border-primary block-shadow-primary"
      >
        Voltar ao ranking
      </Link>
    </div>
  );
}
