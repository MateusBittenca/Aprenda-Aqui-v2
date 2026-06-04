import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "database";
import { LessonForm } from "@/components/professor/lesson-form";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function EditLessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { unit: true },
  });
  if (!lesson || !lesson.unitId) notFound();

  return (
    <div>
      <Link
        href={`/professor/unidades/${lesson.unitId}`}
        className="text-sm font-bold text-secondary hover:text-primary mb-4 inline-block"
      >
        ← Voltar
      </Link>
      <h1 className="text-3xl font-extrabold font-display text-primary mb-6">Editar lição</h1>
      <LessonForm
        unitId={lesson.unitId}
        lessonId={lessonId}
        mode="edit"
        initial={{
          title: lesson.title,
          type: lesson.type,
          order: lesson.order,
          xpReward: lesson.xpReward,
          published: lesson.published,
          content: lesson.content as Record<string, unknown>,
          solution: lesson.solution as Record<string, unknown> | null,
        }}
      />
    </div>
  );
}
