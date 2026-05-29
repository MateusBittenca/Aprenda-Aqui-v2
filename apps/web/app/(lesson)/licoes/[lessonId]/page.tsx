import { notFound } from "next/navigation";
import { prisma } from "database";
import { QuizLesson } from "@/components/lesson/quiz-lesson";
import { CodeLesson } from "@/components/lesson/code-lesson";

interface LessonPageProps {
  params: { lessonId: string };
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface LessonContent {
  questions?: QuizQuestion[];
  starterCode?: string;
  instructions?: string;
}

type LessonMode = "HTML" | "CSS" | "JS";

function inferMode(trackSlug: string, instructions?: string): LessonMode {
  const slug = trackSlug.toLowerCase();
  if (slug.includes("css")) return "CSS";
  if (slug.includes("js") || slug.includes("javascript")) return "JS";
  if (instructions?.toLowerCase().includes("css")) return "CSS";
  if (instructions?.toLowerCase().includes("javascript") || instructions?.toLowerCase().includes("função")) return "JS";
  return "HTML";
}

export default async function LessonPage({ params }: LessonPageProps) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      track: { select: { slug: true, title: true } },
    },
  });

  if (!lesson) {
    notFound();
  }

  const content = lesson.content as LessonContent;

  if (lesson.type === "QUIZ") {
    return (
      <QuizLesson
        lessonId={lesson.id}
        trackTitle={lesson.track.title}
        questions={content.questions ?? []}
        hint="Leia a pergunta com atenção antes de escolher!"
        xpReward={lesson.xpReward}
        trackSlug={lesson.track.slug}
      />
    );
  }

  const mode = inferMode(lesson.track.slug, content.instructions);

  return (
    <CodeLesson
      lessonId={lesson.id}
      title={lesson.title}
      instructions={
        content.instructions ?? `Complete o exercício: ${lesson.title}`
      }
      starterCode={content.starterCode ?? ""}
      hint="Escreva o código, clique em RODAR e depois em VERIFICAR!"
      xpReward={lesson.xpReward}
      trackSlug={lesson.track.slug}
      mode={mode}
    />
  );
}
