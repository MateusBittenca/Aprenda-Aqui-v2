"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/professor/professor-ui";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PromoteUserPanelProps {
  initialUsers: UserItem[];
}

export function PromoteUserPanel({ initialUsers }: PromoteUserPanelProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; variant: "success" | "error" } | null>(
    null
  );

  const filteredUsers = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
    );
  }, [users, filter]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilter(query);
  }

  function handleClearSearch() {
    setQuery("");
    setFilter("");
  }

  async function promoteUser(user: UserItem) {
    if (!window.confirm(`Promover "${user.name}" (${user.email}) a professor?`)) return;
    setLoadingId(user.id);
    setMessage(null);
    try {
      const res = await fetch(`/api/professor/users/${user.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "TEACHER" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error ?? "Erro ao promover", variant: "error" });
        return;
      }
      setMessage({ text: `${user.name} promovido(a) a professor`, variant: "success" });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: "TEACHER" } : u))
      );
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div>
      {message && (
        <StatusBanner
          message={message.text}
          variant={message.variant}
          onDismiss={() => setMessage(null)}
        />
      )}

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por email ou nome"
          className="flex-1 rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
        />
        <Button type="submit" className="block-shadow-primary rounded-2xl font-bold">
          Buscar
        </Button>
        {filter && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleClearSearch}
            className="rounded-2xl font-bold"
          >
            Limpar
          </Button>
        )}
      </form>

      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <p className="font-extrabold">{user.name}</p>
              <p className="text-sm text-secondary">{user.email}</p>
              {user.role === "TEACHER" ? (
                <span className="text-xs font-bold uppercase text-primary">Professor</span>
              ) : (
                <span className="text-xs font-bold uppercase text-secondary">Aluno</span>
              )}
            </div>
            {user.role !== "TEACHER" && (
              <Button
                onClick={() => promoteUser(user)}
                disabled={loadingId === user.id}
                className="rounded-xl font-bold block-shadow-primary"
              >
                {loadingId === user.id ? "Promovendo..." : "Promover a professor"}
              </Button>
            )}
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-10 text-center text-secondary">
          Nenhum usuário cadastrado.
        </div>
      )}

      {users.length > 0 && filteredUsers.length === 0 && (
        <div className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-10 text-center text-secondary">
          Nenhum usuário encontrado para &quot;{filter}&quot;.
        </div>
      )}
    </div>
  );
}
