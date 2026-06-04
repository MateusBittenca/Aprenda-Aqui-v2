import { revalidatePath } from "next/cache";
import type { Track } from "@prisma/client";

export function revalidateProfessorContent(track?: Pick<Track, "slug"> | null) {
  revalidatePath("/trilhas");
  revalidatePath("/dashboard", "layout");
  if (track?.slug) {
    revalidatePath(`/trilhas/${track.slug}`);
  }
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR.test(value);
}

export interface QuizQuestionInput {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface TrackInput {
  title?: string;
  description?: string;
  slug?: string;
  icon?: string;
  order?: number;
  colorPrimary?: string;
  colorDark?: string;
  colorLight?: string;
  colorMuted?: string;
  colorOnPrimary?: string;
  published?: boolean;
}

export interface UnitInput {
  title?: string;
  description?: string | null;
  order?: number;
  pathOffset?: number;
}

export interface LessonInput {
  title?: string;
  type?: "QUIZ" | "CODE";
  order?: number;
  xpReward?: number;
  published?: boolean;
  content?: Record<string, unknown>;
  solution?: Record<string, unknown> | null;
}

export function validateTrackInput(
  body: TrackInput,
  partial = false
): { ok: true; data: TrackInput } | { ok: false; error: string } {
  const data: TrackInput = {};

  if (body.title !== undefined) {
    const title = body.title.trim();
    if (!title) return { ok: false, error: "Título é obrigatório" };
    data.title = title;
  } else if (!partial) {
    return { ok: false, error: "Título é obrigatório" };
  }

  if (body.description !== undefined) {
    data.description = body.description.trim();
  } else if (!partial) {
    return { ok: false, error: "Descrição é obrigatória" };
  }

  if (body.slug !== undefined) {
    const slug = slugify(body.slug);
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return { ok: false, error: "Slug inválido" };
    }
    data.slug = slug;
  } else if (!partial) {
    return { ok: false, error: "Slug é obrigatório" };
  }

  if (body.icon !== undefined) {
    const icon = body.icon.trim();
    if (!icon) return { ok: false, error: "Ícone é obrigatório" };
    data.icon = icon;
  } else if (!partial) {
    return { ok: false, error: "Ícone é obrigatório" };
  }

  if (body.order !== undefined) {
    if (!Number.isInteger(body.order) || body.order < 0) {
      return { ok: false, error: "Ordem inválida" };
    }
    data.order = body.order;
  }

  const colorFields = [
    "colorPrimary",
    "colorDark",
    "colorLight",
    "colorMuted",
    "colorOnPrimary",
  ] as const;

  for (const field of colorFields) {
    if (body[field] !== undefined) {
      if (!isValidHexColor(body[field]!)) {
        return { ok: false, error: `Cor ${field} inválida` };
      }
      data[field] = body[field];
    }
  }

  if (body.published !== undefined) {
    data.published = Boolean(body.published);
  }

  return { ok: true, data };
}

export function validateUnitInput(
  body: UnitInput,
  partial = false
): { ok: true; data: UnitInput } | { ok: false; error: string } {
  const data: UnitInput = {};

  if (body.title !== undefined) {
    const title = body.title.trim();
    if (!title) return { ok: false, error: "Título é obrigatório" };
    data.title = title;
  } else if (!partial) {
    return { ok: false, error: "Título é obrigatório" };
  }

  if (body.description !== undefined) {
    data.description = body.description?.trim() || null;
  }

  if (body.order !== undefined) {
    if (!Number.isInteger(body.order) || body.order < 0) {
      return { ok: false, error: "Ordem inválida" };
    }
    data.order = body.order;
  }

  if (body.pathOffset !== undefined) {
    if (!Number.isInteger(body.pathOffset)) {
      return { ok: false, error: "pathOffset inválido" };
    }
    data.pathOffset = body.pathOffset;
  }

  return { ok: true, data };
}

export function validateQuizContent(
  content: Record<string, unknown>,
  solution: Record<string, unknown> | null | undefined
): { ok: true } | { ok: false; error: string } {
  const questions = content.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    return { ok: false, error: "Quiz precisa de pelo menos uma pergunta" };
  }

  for (const q of questions) {
    if (typeof q !== "object" || q === null) {
      return { ok: false, error: "Pergunta inválida" };
    }
    const question = q as QuizQuestionInput;
    if (!question.question?.trim()) {
      return { ok: false, error: "Texto da pergunta é obrigatório" };
    }
    if (!Array.isArray(question.options) || question.options.length < 2) {
      return { ok: false, error: "Cada pergunta precisa de pelo menos 2 opções" };
    }
    if (
      !Number.isInteger(question.correctIndex) ||
      question.correctIndex < 0 ||
      question.correctIndex >= question.options.length
    ) {
      return { ok: false, error: "Índice correto inválido" };
    }
  }

  const firstQuestion = questions[0] as QuizQuestionInput;
  const correctIndex =
    typeof solution?.correctIndex === "number"
      ? solution.correctIndex
      : firstQuestion.correctIndex;

  if (correctIndex !== firstQuestion.correctIndex) {
    return { ok: false, error: "solution.correctIndex deve coincidir com a primeira pergunta" };
  }

  return { ok: true };
}

export function validateCodeContent(
  content: Record<string, unknown>,
  solution: Record<string, unknown> | null | undefined
): { ok: true } | { ok: false; error: string } {
  if (typeof content.instructions !== "string" || !content.instructions.trim()) {
    return { ok: false, error: "Instruções são obrigatórias" };
  }
  if (typeof content.starterCode !== "string") {
    return { ok: false, error: "Código inicial é obrigatório" };
  }
  if (
    solution?.contains !== undefined &&
    typeof solution.contains !== "string"
  ) {
    return { ok: false, error: "solution.contains deve ser uma string" };
  }
  return { ok: true };
}

export function validateLessonInput(
  body: LessonInput,
  partial = false
): { ok: true; data: LessonInput } | { ok: false; error: string } {
  const data: LessonInput = {};

  if (body.title !== undefined) {
    const title = body.title.trim();
    if (!title) return { ok: false, error: "Título é obrigatório" };
    data.title = title;
  } else if (!partial) {
    return { ok: false, error: "Título é obrigatório" };
  }

  if (body.type !== undefined) {
    if (body.type !== "QUIZ" && body.type !== "CODE") {
      return { ok: false, error: "Tipo de lição inválido" };
    }
    data.type = body.type;
  } else if (!partial) {
    return { ok: false, error: "Tipo é obrigatório" };
  }

  if (body.order !== undefined) {
    if (!Number.isInteger(body.order) || body.order < 0) {
      return { ok: false, error: "Ordem inválida" };
    }
    data.order = body.order;
  }

  if (body.xpReward !== undefined) {
    if (!Number.isInteger(body.xpReward) || body.xpReward < 1) {
      return { ok: false, error: "XP inválido" };
    }
    data.xpReward = body.xpReward;
  }

  if (body.published !== undefined) {
    data.published = Boolean(body.published);
  }

  if (body.content !== undefined) {
    data.content = body.content;
  }

  if (body.solution !== undefined) {
    data.solution = body.solution;
  }

  const type = data.type ?? body.type;
  const content = data.content ?? body.content;
  const solution = data.solution ?? body.solution;

  if (!partial && type && content) {
    if (type === "QUIZ") {
      const quizResult = validateQuizContent(content, solution);
      if (!quizResult.ok) return quizResult;
      if (!solution || typeof (solution as { correctIndex?: unknown }).correctIndex !== "number") {
        data.solution = {
          correctIndex: (content.questions as QuizQuestionInput[])[0].correctIndex,
        };
      }
    } else if (type === "CODE") {
      const codeResult = validateCodeContent(content, solution);
      if (!codeResult.ok) return codeResult;
    }
  }

  return { ok: true, data };
}
