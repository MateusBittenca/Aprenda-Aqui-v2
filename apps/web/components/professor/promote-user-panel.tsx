"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/professor/professor-ui";

interface SearchUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export function PromoteUserPanel() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; variant: "success" | "error" } | null>(
    null
  );

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/professor/users/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error ?? "Erro na busca", variant: "error" });
        return;
      }
      setResults(data.users ?? data ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function promoteUser(user: SearchUser) {
    if (!window.confirm(`Promover "${user.name}" (${user.email}) a professor?`)) return;
    setLoading(true);
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
      setResults((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: "TEACHER" } : u))
      );
      router.refresh();
    } finally {
      setLoading(false);
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
        <Button type="submit" disabled={loading} className="block-shadow-primary rounded-2xl font-bold">
          Buscar
        </Button>
      </form>

      <div className="space-y-3">
        {results.map((user) => (
          <div
            key={user.id}
            className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <p className="font-extrabold">{user.name}</p>
              <p className="text-sm text-secondary">{user.email}</p>
              {user.role === "TEACHER" && (
                <span className="text-xs font-bold uppercase text-primary">Já é professor</span>
              )}
            </div>
            {user.role !== "TEACHER" && (
              <Button
                onClick={() => promoteUser(user)}
                disabled={loading}
                className="rounded-xl font-bold block-shadow-primary"
              >
                Promover a professor
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
