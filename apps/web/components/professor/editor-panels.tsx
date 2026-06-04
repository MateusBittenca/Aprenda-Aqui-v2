"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/professor/professor-ui";
import { TrackIconPicker } from "@/components/professor/track-icon-picker";
import { TrackColorPicker } from "@/components/professor/track-color-picker";
import type { EditorPathLesson, EditorTrackData } from "@/lib/track-editor-path";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const emptyQuizQuestion = (): QuizQuestion => ({
  question: "",
  options: ["", ""],
  correctIndex: 0,
});

interface PanelProps {
  onSuccess: () => void;
  onMessage?: (msg: { text: string; variant: "success" | "error" } | null) => void;
}

interface EditorTrackPanelProps extends PanelProps {
  track: EditorTrackData;
  onPreviewChange?: (patch: Partial<EditorTrackData>) => void;
}

export function EditorTrackPanel({ track, onSuccess, onPreviewChange, onMessage }: EditorTrackPanelProps) {
  const router = useRouter();
  const [title, setTitle] = useState(track.title);
  const [description, setDescription] = useState(track.description);
  const [slug, setSlug] = useState(track.slug);
  const [icon, setIcon] = useState(track.icon);
  const [published, setPublished] = useState(track.published);
  const [colors, setColors] = useState({
    colorPrimary: track.colorPrimary,
    colorDark: track.colorDark,
    colorLight: track.colorLight,
    colorMuted: track.colorMuted,
    colorOnPrimary: track.colorOnPrimary,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onPreviewChange?.({ title, description, slug, icon, published, ...colors });
  }, [title, description, slug, icon, published, colors, onPreviewChange]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    onMessage?.(null);
    try {
      const res = await fetch(`/api/professor/tracks/${track.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, slug, icon, published, ...colors }),
      });
      const data = await res.json();
      if (!res.ok) {
        onMessage?.({ text: data.error ?? "Erro ao salvar", variant: "error" });
        return;
      }
      onMessage?.({ text: "Trilha salva!", variant: "success" });
      onSuccess();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <h3 className="font-extrabold font-display text-lg">Configurações da trilha</h3>

      <Field label="Título" value={title} onChange={setTitle} required />
      <Field label="Descrição" value={description} onChange={setDescription} multiline required />
      <Field label="Slug" value={slug} onChange={setSlug} required />

      <TrackIconPicker
        value={icon}
        onChange={setIcon}
        accentColor={colors.colorPrimary}
      />

      <TrackColorPicker value={colors} onChange={setColors} />

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        <span className="text-sm font-bold">Publicar trilha</span>
      </label>

      <Button type="submit" disabled={loading} className="w-full block-shadow-primary rounded-2xl font-bold">
        {loading ? "Salvando..." : "Salvar trilha"}
      </Button>
    </form>
  );
}

interface EditorUnitPanelProps extends PanelProps {
  trackId: string;
  unit?: EditorTrackData["units"][number];
  mode: "create" | "edit";
}

export function EditorUnitPanel({ trackId, unit, mode, onSuccess, onMessage }: EditorUnitPanelProps) {
  const router = useRouter();
  const [title, setTitle] = useState(unit?.title ?? "");
  const [description, setDescription] = useState(unit?.description ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    onMessage?.(null);
    const url =
      mode === "create"
        ? `/api/professor/tracks/${trackId}/units`
        : `/api/professor/units/${unit!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: description || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        onMessage?.({ text: data.error ?? "Erro ao salvar", variant: "error" });
        return;
      }
      onMessage?.({ text: mode === "create" ? "Unidade criada!" : "Unidade salva!", variant: "success" });
      onSuccess();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!unit || !window.confirm(`Excluir unidade "${unit.title}" e todas as lições?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/professor/units/${unit.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        onMessage?.({ text: data.error ?? "Erro ao excluir", variant: "error" });
        return;
      }
      onSuccess();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <h3 className="font-extrabold font-display text-lg">
        {mode === "create" ? "Nova unidade" : "Editar unidade"}
      </h3>
      <Field label="Título" value={title} onChange={setTitle} required />
      <Field label="Descrição" value={description} onChange={setDescription} multiline />
      <Button type="submit" disabled={loading} className="w-full block-shadow-primary rounded-2xl font-bold">
        {loading ? "Salvando..." : mode === "create" ? "Criar unidade" : "Salvar unidade"}
      </Button>
      {mode === "edit" && unit && (
        <Button
          type="button"
          variant="destructive"
          disabled={loading}
          onClick={handleDelete}
          className="w-full rounded-2xl font-bold"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir unidade
        </Button>
      )}
    </form>
  );
}

interface EditorLessonPanelProps extends PanelProps {
  trackId: string;
  unitId: string;
  lesson?: EditorPathLesson;
  mode: "create" | "edit";
  initialType?: "QUIZ" | "CODE";
}

export function EditorLessonPanel({
  trackId,
  unitId,
  lesson,
  mode,
  initialType = "QUIZ",
  onSuccess,
  onMessage,
}: EditorLessonPanelProps) {
  const router = useRouter();
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [type] = useState<"QUIZ" | "CODE">(lesson?.type ?? initialType);
  const [xpReward, setXpReward] = useState(lesson?.xpReward ?? 10);
  const [published, setPublished] = useState(lesson?.published ?? false);

  const initialQuestions =
    (lesson?.content?.questions as QuizQuestion[] | undefined) ?? [emptyQuizQuestion()];
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [instructions, setInstructions] = useState((lesson?.content?.instructions as string) ?? "");
  const [starterCode, setStarterCode] = useState((lesson?.content?.starterCode as string) ?? "");
  const [hint, setHint] = useState((lesson?.content?.hint as string) ?? "");
  const [contains, setContains] = useState((lesson?.solution?.contains as string) ?? "");
  const [loading, setLoading] = useState(false);

  function buildPayload() {
    if (type === "QUIZ") {
      return {
        title,
        type,
        xpReward,
        published,
        content: { questions },
        solution: { correctIndex: questions[0]?.correctIndex ?? 0 },
      };
    }
    const content: Record<string, unknown> = { instructions, starterCode };
    if (hint.trim()) content.hint = hint.trim();
    const solution = contains.trim() ? { contains: contains.trim() } : {};
    return { title, type, xpReward, published, content, solution };
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    onMessage?.(null);
    const url =
      mode === "create"
        ? `/api/professor/units/${unitId}/lessons`
        : `/api/professor/lessons/${lesson!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) {
        onMessage?.({ text: data.error ?? "Erro ao salvar", variant: "error" });
        return;
      }
      onMessage?.({ text: mode === "create" ? "Lição criada!" : "Lição salva!", variant: "success" });
      onSuccess();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!lesson || !window.confirm(`Excluir lição "${lesson.title}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/professor/lessons/${lesson.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        onMessage?.({ text: data.error ?? "Erro ao excluir", variant: "error" });
        return;
      }
      onSuccess();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish() {
    if (!lesson) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/professor/lessons/${lesson.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (!res.ok) {
        const data = await res.json();
        onMessage?.({ text: data.error ?? "Erro", variant: "error" });
        return;
      }
      setPublished(!published);
      onMessage?.({ text: published ? "Lição arquivada" : "Lição publicada", variant: "success" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-extrabold font-display text-lg">
          {mode === "create" ? `Nova lição ${type}` : "Editar lição"}
        </h3>
        <span className="text-xs font-bold uppercase bg-surface-variant px-2 py-0.5 rounded-lg">
          {type}
        </span>
      </div>

      <Field label="Título" value={title} onChange={setTitle} required />
      <div>
        <label className="block text-xs font-bold text-secondary uppercase mb-1">XP</label>
        <input
          type="number"
          min={1}
          value={xpReward}
          onChange={(e) => setXpReward(Number(e.target.value))}
          className="w-full rounded-xl border-2 border-surface-variant bg-surface px-3 py-2 font-medium"
        />
      </div>

      {type === "QUIZ" ? (
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="p-3 rounded-2xl border-2 border-surface-variant bg-surface-container-lowest space-y-2">
              <input
                type="text"
                value={q.question}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((item, i) =>
                      i === qIndex ? { ...item, question: e.target.value } : item
                    )
                  )
                }
                placeholder="Pergunta"
                className="w-full rounded-xl border-2 border-surface-variant bg-surface px-3 py-2 text-sm font-medium"
                required
              />
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctIndex === oIndex}
                    onChange={() =>
                      setQuestions((prev) =>
                        prev.map((item, i) =>
                          i === qIndex ? { ...item, correctIndex: oIndex } : item
                        )
                      )
                    }
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) =>
                      setQuestions((prev) =>
                        prev.map((item, i) =>
                          i === qIndex
                            ? {
                                ...item,
                                options: item.options.map((o, j) =>
                                  j === oIndex ? e.target.value : o
                                ),
                              }
                            : item
                        )
                      )
                    }
                    className="flex-1 rounded-xl border-2 border-surface-variant bg-surface px-3 py-1.5 text-sm"
                    required
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <Field label="Instruções" value={instructions} onChange={setInstructions} multiline required />
          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">Código inicial</label>
            <textarea
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
              rows={5}
              className="w-full rounded-xl border-2 border-surface-variant bg-surface px-3 py-2 font-mono text-xs"
              required
            />
          </div>
          <Field label="Validação (contains)" value={contains} onChange={setContains} />
          <Field label="Dica (opcional)" value={hint} onChange={setHint} />
        </div>
      )}

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        <span className="text-sm font-bold">Publicar lição</span>
      </label>

      <Button type="submit" disabled={loading} className="w-full block-shadow-primary rounded-2xl font-bold">
        {loading ? "Salvando..." : mode === "create" ? "Criar lição" : "Salvar lição"}
      </Button>

      {mode === "edit" && lesson && (
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={togglePublish}
            className="w-full rounded-2xl font-bold"
          >
            {published ? "Arquivar lição" : "Publicar lição"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
            className="w-full rounded-2xl font-bold"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir lição
          </Button>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  required?: boolean;
}) {
  const className =
    "w-full rounded-xl border-2 border-surface-variant bg-surface px-3 py-2 font-medium text-sm";
  return (
    <div>
      <label className="block text-xs font-bold text-secondary uppercase mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={className}
          required={required}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
          required={required}
        />
      )}
    </div>
  );
}
