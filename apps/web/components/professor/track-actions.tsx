"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/professor/professor-ui";

interface TrackActionsProps {
  trackId: string;
  published: boolean;
  title: string;
}

export function TrackActions({ trackId, published, title }: TrackActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; variant: "success" | "error" } | null>(
    null
  );

  async function togglePublish() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/professor/tracks/${trackId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage({ text: data.error ?? "Erro ao publicar", variant: "error" });
        return;
      }
      setMessage({
        text: published ? "Trilha arquivada" : "Trilha publicada",
        variant: "success",
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Excluir a trilha "${title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/professor/tracks/${trackId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Erro ao excluir");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 shrink-0">
      {message && (
        <StatusBanner message={message.text} variant={message.variant} onDismiss={() => setMessage(null)} />
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold"
          onClick={togglePublish}
          disabled={loading}
        >
          {published ? "Arquivar" : "Publicar"}
        </Button>
        <Button asChild variant="secondary" size="sm" className="rounded-xl font-bold">
          <Link href={`/professor/trilhas/${trackId}/editar`}>
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Editar
          </Link>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold text-error border-error/30"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
