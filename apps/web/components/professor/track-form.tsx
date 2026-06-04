"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/professor/professor-ui";
import { slugify } from "@/lib/professor-validation";

const ICON_OPTIONS = ["code", "palette", "braces", "terminal", "layers"];

const DEFAULT_COLORS = {
  colorPrimary: "#58CC02",
  colorDark: "#1f5100",
  colorLight: "#87fe45",
  colorMuted: "#2b6c00",
  colorOnPrimary: "#ffffff",
};

export interface TrackFormValues {
  title: string;
  description: string;
  slug: string;
  icon: string;
  order: number;
  colorPrimary: string;
  colorDark: string;
  colorLight: string;
  colorMuted: string;
  colorOnPrimary: string;
  published: boolean;
}

interface TrackFormProps {
  initial?: Partial<TrackFormValues>;
  trackId?: string;
  mode: "create" | "edit";
}

export function TrackForm({ initial, trackId, mode }: TrackFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [icon, setIcon] = useState(initial?.icon ?? "code");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [colors, setColors] = useState({
    colorPrimary: initial?.colorPrimary ?? DEFAULT_COLORS.colorPrimary,
    colorDark: initial?.colorDark ?? DEFAULT_COLORS.colorDark,
    colorLight: initial?.colorLight ?? DEFAULT_COLORS.colorLight,
    colorMuted: initial?.colorMuted ?? DEFAULT_COLORS.colorMuted,
    colorOnPrimary: initial?.colorOnPrimary ?? DEFAULT_COLORS.colorOnPrimary,
  });
  const [published, setPublished] = useState(initial?.published ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title,
      description,
      slug,
      icon,
      order,
      ...colors,
      published,
    };

    const url =
      mode === "create" ? "/api/professor/tracks" : `/api/professor/tracks/${trackId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar trilha");
        return;
      }
      router.push(mode === "create" ? `/professor/trilhas/${data.id}` : `/professor/trilhas/${trackId}`);
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
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-secondary mb-1">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Ícone</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-secondary mb-1">Ordem</label>
          <input
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium max-w-[120px]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-secondary mb-2">Cores</label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(
              Object.keys(colors) as Array<keyof typeof colors>
            ).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors[key]}
                  onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                  className="h-10 w-10 rounded-lg border-2 border-surface-variant cursor-pointer"
                />
                <span className="text-xs font-bold text-secondary">{key}</span>
              </div>
            ))}
          </div>
          <div
            className="mt-4 rounded-2xl p-4 text-center font-bold"
            style={{ backgroundColor: colors.colorPrimary, color: colors.colorOnPrimary }}
          >
            Preview: {title || "Trilha"}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-bold">Publicar trilha</span>
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="block-shadow-primary rounded-2xl font-bold">
          {loading ? "Salvando..." : mode === "create" ? "Criar trilha" : "Salvar alterações"}
        </Button>
        <Button type="button" variant="secondary" asChild className="rounded-2xl font-bold">
          <Link href={trackId ? `/professor/trilhas/${trackId}` : "/professor/trilhas"}>
            Cancelar
          </Link>
        </Button>
      </div>
    </form>
  );
}
