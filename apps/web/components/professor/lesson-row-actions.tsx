"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonRowActionsProps {
  lessonId: string;
  title: string;
  published: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export function LessonRowActions({
  lessonId,
  title,
  published,
  isFirst,
  isLast,
}: LessonRowActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function reorder(direction: "up" | "down") {
    setLoading(true);
    try {
      await fetch(`/api/professor/lessons/${lessonId}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish() {
    setLoading(true);
    try {
      await fetch(`/api/professor/lessons/${lessonId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Excluir a lição "${title}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/professor/lessons/${lessonId}`, { method: "DELETE" });
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
    <div className="flex flex-wrap gap-2 shrink-0">
      <Button
        variant="secondary"
        size="sm"
        className="rounded-xl"
        disabled={loading || isFirst}
        onClick={() => reorder("up")}
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="rounded-xl"
        disabled={loading || isLast}
        onClick={() => reorder("down")}
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="rounded-xl font-bold"
        disabled={loading}
        onClick={togglePublish}
      >
        {published ? "Arquivar" : "Publicar"}
      </Button>
      <Button asChild variant="secondary" size="sm" className="rounded-xl font-bold">
        <Link href={`/professor/licoes/${lessonId}/editar`}>
          <Pencil className="h-3.5 w-3.5 mr-1" />
          Editar
        </Link>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="rounded-xl font-bold text-error border-error/30"
        disabled={loading}
        onClick={handleDelete}
      >
        <Trash2 className="h-3.5 w-3.5 mr-1" />
        Excluir
      </Button>
    </div>
  );
}
