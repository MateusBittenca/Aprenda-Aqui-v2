import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { prisma } from "database";
import { Button } from "@/components/ui/button";
import { PublishedBadge } from "@/components/professor/professor-ui";
import { LessonRowActions } from "@/components/professor/lesson-row-actions";

interface PageProps {
  params: Promise<{ unitId: string }>;
}

export default async function UnitDetailPage({ params }: PageProps) {
  const { unitId } = await params;
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: {
      track: true,
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!unit) notFound();

  return (
    <div>
      <Link
        href={`/professor/trilhas/${unit.trackId}`}
        className="text-sm font-bold text-secondary hover:text-primary mb-4 inline-block"
      >
        ← {unit.track.title}
      </Link>

      <h1 className="text-3xl font-extrabold font-display text-primary mb-2">{unit.title}</h1>
      {unit.description && <p className="text-secondary mb-6">{unit.description}</p>}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold font-display">Lições</h2>
        <Button asChild size="sm" className="rounded-xl font-bold block-shadow-primary">
          <Link href={`/professor/licoes/nova?trackId=${unit.trackId}&unitId=${unitId}`}>
            <Plus className="h-4 w-4 mr-1" />
            Nova lição
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {unit.lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase bg-surface-variant px-2 py-0.5 rounded-lg">
                  {lesson.type}
                </span>
                <PublishedBadge published={lesson.published} />
              </div>
              <p className="text-lg font-extrabold">{lesson.title}</p>
              <p className="text-xs font-bold text-secondary uppercase mt-1">
                Ordem {lesson.order} · {lesson.xpReward} XP
              </p>
            </div>
            <LessonRowActions
              lessonId={lesson.id}
              title={lesson.title}
              published={lesson.published}
              isFirst={index === 0}
              isLast={index === unit.lessons.length - 1}
            />
          </div>
        ))}

        {unit.lessons.length === 0 && (
          <div className="block-shadow-card rounded-4xl border-2 border-surface-variant p-8 text-center text-secondary">
            Nenhuma lição nesta unidade.
          </div>
        )}
      </div>
    </div>
  );
}
