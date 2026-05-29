import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface CompleteLessonResult {
  ok: boolean;
  alreadyCompleted?: boolean;
  xpEarned?: number;
}

export async function submitLessonCompletion(
  lessonId: string,
  answer: unknown
): Promise<CompleteLessonResult> {
  const res = await fetch(`/api/lessons/${lessonId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });

  const data = await res.json().catch(() => ({}));

  return {
    ok: res.ok || !!data.alreadyCompleted,
    alreadyCompleted: data.alreadyCompleted,
    xpEarned: data.xpEarned,
  };
}

export function navigateAfterLessonComplete(
  router: AppRouterInstance,
  trackSlug: string,
  lessonId: string,
  xp: number
) {
  router.push(`/trilhas/${trackSlug}?completed=${lessonId}&xp=${xp}`);
  router.refresh();
}
