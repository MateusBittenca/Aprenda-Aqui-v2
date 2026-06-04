"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/professor/professor-ui";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface LessonFormProps {
  unitId: string;
  trackId: string;
  lessonId?: string;
  mode: "create" | "edit";
  initial?: {
    title: string;
    type: "QUIZ" | "CODE";
    order: number;
    xpReward: number;
    published: boolean;
    content: Record<string, unknown>;
    solution: Record<string, unknown> | null;
  };
}

const emptyQuizQuestion = (): QuizQuestion => ({
  question: "",
  options: ["", ""],
  correctIndex: 0,
});

export function LessonForm({ unitId, trackId, lessonId, mode, initial }: LessonFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState<"QUIZ" | "CODE">(initial?.type ?? "QUIZ");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [xpReward, setXpReward] = useState(initial?.xpReward ?? 10);
  const [published, setPublished] = useState(initial?.published ?? false);

  const initialQuestions =
    (initial?.content?.questions as QuizQuestion[] | undefined) ?? [emptyQuizQuestion()];
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);

  const [instructions, setInstructions] = useState(
    (initial?.content?.instructions as string) ?? ""
  );
  const [starterCode, setStarterCode] = useState(
    (initial?.content?.starterCode as string) ?? ""
  );
  const [hint, setHint] = useState((initial?.content?.hint as string) ?? "");
  const [contains, setContains] = useState(
    (initial?.solution?.contains as string) ?? ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q))
    );
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.map((o, j) => (j === oIndex ? value : o)) }
          : q
      )
    );
  }

  function addOption(qIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, ""] } : q))
    );
  }

  function removeOption(qIndex: number, oIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = q.options.filter((_, j) => j !== oIndex);
        let correctIndex = q.correctIndex;
        if (correctIndex >= options.length) correctIndex = options.length - 1;
        if (oIndex < correctIndex) correctIndex -= 1;
        return { ...q, options, correctIndex: Math.max(0, correctIndex) };
      })
    );
  }

  function buildPayload() {
    if (type === "QUIZ") {
      const content = { questions };
      const solution = { correctIndex: questions[0]?.correctIndex ?? 0 };
      return { title, type, order, xpReward, published, content, solution };
    }
    const content: Record<string, unknown> = { instructions, starterCode };
    if (hint.trim()) content.hint = hint.trim();
    const solution = contains.trim() ? { contains: contains.trim() } : {};
    return { title, type, order, xpReward, published, content, solution };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = buildPayload();
    const url =
      mode === "create"
        ? `/api/professor/units/${unitId}/lessons`
        : `/api/professor/lessons/${lessonId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar lição");
        return;
      }
      router.push(`/professor/unidades/${unitId}`);
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

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "QUIZ" | "CODE")}
              disabled={mode === "edit"}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
            >
              <option value="QUIZ">Quiz</option>
              <option value="CODE">Código</option>
            </select>
          </div>
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
            <label className="block text-sm font-bold text-secondary mb-1">XP</label>
            <input
              type="number"
              min={1}
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-bold">Publicar lição</span>
        </label>
      </div>

      {type === "QUIZ" ? (
        <div className="space-y-4">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold">Pergunta {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="text-error rounded-xl"
                    onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qIndex))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                placeholder="Texto da pergunta"
                required
                className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
              />
              <div className="space-y-2">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctIndex === oIndex}
                      onChange={() => updateQuestion(qIndex, { correctIndex: oIndex })}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Opção ${oIndex + 1}`}
                      required
                      className="flex-1 rounded-2xl border-2 border-surface-variant bg-surface px-4 py-2 font-medium"
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-error text-sm font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-xl font-bold"
                  onClick={() => addOption(qIndex)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Opção
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            className="rounded-2xl font-bold"
            onClick={() => setQuestions((prev) => [...prev, emptyQuizQuestion()])}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar pergunta
          </Button>
        </div>
      ) : (
        <div className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Instruções</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              rows={3}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Código inicial</label>
            <textarea
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
              required
              rows={8}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Dica (opcional)</label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">
              Validação (solution.contains)
            </label>
            <input
              type="text"
              value={contains}
              onChange={(e) => setContains(e.target.value)}
              placeholder="Texto que o código do aluno deve conter"
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface px-4 py-3 font-medium"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="block-shadow-primary rounded-2xl font-bold">
          {loading ? "Salvando..." : mode === "create" ? "Criar lição" : "Salvar alterações"}
        </Button>
        <Button type="button" variant="secondary" asChild className="rounded-2xl font-bold">
          <Link href={`/professor/unidades/${unitId}`}>Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
