import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "database";
import { Button } from "@/components/ui/button";
import { ProfessorTrackCard } from "@/components/professor/professor-track-card";

export default async function ProfessorTracksPage() {
  const tracks = await prisma.track.findMany({
    orderBy: { order: "asc" },
    include: {
      units: {
        include: {
          lessons: { select: { published: true } },
        },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-primary">Trilhas</h1>
          <p className="text-secondary mt-1">Monte o currículo visualmente, como o aluno verá</p>
        </div>
        <Button asChild className="block-shadow-primary rounded-2xl font-bold">
          <Link href="/professor/trilhas/nova">
            <Plus className="h-4 w-4 mr-2" />
            Nova trilha
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tracks.map((track) => {
          const allLessons = track.units.flatMap((u) => u.lessons);
          return (
            <ProfessorTrackCard
              key={track.id}
              track={{
                id: track.id,
                title: track.title,
                description: track.description,
                slug: track.slug,
                icon: track.icon,
                published: track.published,
                colorPrimary: track.colorPrimary,
                colorDark: track.colorDark,
                colorLight: track.colorLight,
                colorMuted: track.colorMuted,
                colorOnPrimary: track.colorOnPrimary,
                unitCount: track.units.length,
                lessonCount: allLessons.length,
                publishedLessonCount: allLessons.filter((l) => l.published).length,
              }}
            />
          );
        })}
      </div>

      {tracks.length === 0 && (
        <div className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-10 text-center text-secondary">
          Nenhuma trilha cadastrada. Crie a primeira!
        </div>
      )}
    </div>
  );
}
