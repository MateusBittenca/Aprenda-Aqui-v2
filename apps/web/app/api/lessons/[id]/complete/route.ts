import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyFriendsOfLessonActivity } from "@/lib/notifications";
import { validateCodeAnswer, validateQuizAnswer } from "@/lib/lesson-validation";
import { prisma, ActivityType } from "database";

interface QuizContent {
  questions?: Array<{ question: string; options: string[]; correctIndex: number }>;
}
interface CodeContent {
  starterCode?: string;
  instructions?: string;
}
interface SolutionShape {
  contains?: string;
  correctIndex?: number;
}

function calcStreak(currentStreak: number, ultimaAtividade: Date | null): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!ultimaAtividade) return 1;
  const last = new Date(ultimaAtividade);
  last.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return currentStreak;
  if (diff === 1) return currentStreak + 1;
  return 1;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = session.user.id;
  const lessonId = params.id;

  let body: { answer?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    // corpo vazio é permitido (lições sem validação de resposta)
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { track: { select: { slug: true, title: true } } },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lição não encontrada" }, { status: 404 });
  }

  const existing = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  if (existing?.completed) {
    return NextResponse.json({ alreadyCompleted: true, xpEarned: 0, gemsEarned: 0 });
  }

  const content = lesson.content as QuizContent & CodeContent;
  const solution = lesson.solution as SolutionShape | null;
  const isCorrect =
    lesson.type === "QUIZ"
      ? validateQuizAnswer(content, solution, body.answer)
      : validateCodeAnswer(solution, body.answer);

  if (!isCorrect) {
    return NextResponse.json({ correct: false }, { status: 422 });
  }

  // Buscar streak atual antes da transação
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { streakAtual: true, ultimaAtividade: true },
  });

  const newStreak = calcStreak(
    currentUser?.streakAtual ?? 0,
    currentUser?.ultimaAtividade ?? null
  );

  await prisma.$transaction([
    prisma.userProgress.create({
      data: { userId, lessonId, xpEarned: lesson.xpReward, completed: true },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        xpTotal: { increment: lesson.xpReward },
        gems: { increment: lesson.gemsReward },
        streakAtual: newStreak,
        ultimaAtividade: new Date(),
      },
    }),
    prisma.activityEvent.create({
      data: {
        userId,
        type: ActivityType.LESSON_COMPLETED,
        metadata: {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          trackTitle: lesson.track.title,
          xpEarned: lesson.xpReward,
          gemsEarned: lesson.gemsReward,
        },
      },
    }),
  ]);

  await notifyFriendsOfLessonActivity({
    userId,
    actorName: session.user.name ?? "Um amigo",
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    trackTitle: lesson.track.title,
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath("/trilhas");
  revalidatePath(`/trilhas/${lesson.track.slug}`);
  revalidatePath("/perfil");
  revalidatePath("/ranking");
  revalidatePath("/comunidade");
  revalidatePath("/", "layout");

  return NextResponse.json({
    correct: true,
    xpEarned: lesson.xpReward,
    gemsEarned: lesson.gemsReward,
    trackSlug: lesson.track.slug,
  });
}
