import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "database";
import { LessonForm } from "@/components/professor/lesson-form";

interface PageProps {
  searchParams: Promise<{ trackId?: string; unitId?: string }>;
}

export default async function NewLessonPage({ searchParams }: PageProps) {
  const { trackId, unitId } = await searchParams;
  if (!trackId || !unitId) notFound();

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { track: true },
  });
  if (!unit || unit.trackId !== trackId) notFound();

  return (
    <div>
      <Link
        href={`/professor/unidades/${unitId}`}
        className="text-sm font-bold text-secondary hover:text-primary mb-4 inline-block"
      >
        ← {unit.title}
      </Link>
      <h1 className="text-3xl font-extrabold font-display text-primary mb-6">Nova lição</h1>
      <LessonForm unitId={unitId} mode="create" />
    </div>
  );
}
