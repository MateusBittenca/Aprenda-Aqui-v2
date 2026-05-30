interface QuizContent {
  questions?: Array<{ question: string; options: string[]; correctIndex: number }>;
}

interface SolutionShape {
  contains?: string;
  correctIndex?: number;
}

export function validateQuizAnswer(
  content: QuizContent,
  solution: SolutionShape | null,
  answer: unknown
): boolean {
  const questions = content.questions ?? [];
  if (questions.length === 0) return false;
  const selectedIndex = typeof answer === "number" ? answer : -1;
  const expected = solution?.correctIndex ?? questions[0]?.correctIndex ?? -1;
  return selectedIndex === expected;
}

export function validateCodeAnswer(
  solution: SolutionShape | null,
  answer: unknown
): boolean {
  if (!solution?.contains) {
    return typeof answer === "string" && answer.trim().length > 0;
  }
  const code = typeof answer === "string" ? answer.trim().toLowerCase() : "";
  return code.includes(solution.contains.replace(/<[^>]+>/g, "").trim().toLowerCase());
}
