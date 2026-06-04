"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/professor/professor-ui";

interface UnitFormProps {
  trackId: string;
  unitId?: string;
  mode: "create" | "edit";
  initial?: {
    title: string;
    description?: string | null;
    order: number;
    pathOffset: number;
  };
}

export function UnitForm({ trackId, unitId, mode, initial }: UnitFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [pathOffset, setPathOffset] = useState(initial?.pathOffset ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = { title, description: description || null, order, pathOffset };
    const url =
      mode === "create"
        ? `/api/professor/tracks/${trackId}/units`
        : `/api/professor/units/${unitId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar");
        return;
      }
      const redirectId = mode === "create" ? data.id : unitId;
      router.push(`/professor/unidades/${redirectId}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <StatusBanner message={error} variant="error" onDismiss={() => setError("")} />}

      <div className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-6 space-y-4">
        <div>
          <label className="block text-sm font-bold text-secondary mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-secondary mb-1">Descrição (opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Ordem</label>
            <input
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Path offset</label>
            <input
              type="number"
              value={pathOffset}
              onChange={(e) => setPathOffset(Number(e.target.value))}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="block-shadow-primary rounded-2xl font-bold">
          {loading ? "Salvando..." : mode === "create" ? "Criar unidade" : "Salvar"}
        </Button>
        <Button type="button" variant="secondary" asChild className="rounded-2xl font-bold">
          <Link href={unitId ? `/professor/unidades/${unitId}` : `/professor/trilhas/${trackId}`}>
            Cancelar
          </Link>
        </Button>
      </div>
    </form>
  );
}
