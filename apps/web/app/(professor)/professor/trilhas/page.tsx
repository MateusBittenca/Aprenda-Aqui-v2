import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "database";
import { Button } from "@/components/ui/button";
import { PublishedBadge } from "@/components/professor/professor-ui";
import { TrackActions } from "@/components/professor/track-actions";

export default async function ProfessorTracksPage() {
  const tracks = await prisma.track.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { units: true, lessons: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-primary">Trilhas</h1>
          <p className="text-secondary mt-1">Gerencie o currículo da plataforma</p>
        </div>
        <Button asChild className="block-shadow-primary rounded-2xl font-bold">
          <Link href="/professor/trilhas/nova">
            <Plus className="h-4 w-4 mr-2" />
            Nova trilha
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Link
                    href={`/professor/trilhas/${track.id}`}
                    className="text-xl font-extrabold font-display hover:text-primary transition-colors"
                  >
                    {track.title}
                  </Link>
                  <PublishedBadge published={track.published} />
                </div>
                <p className="text-sm text-secondary mb-2">{track.description}</p>
                <div className="flex flex-wrap gap-3 text-xs font-bold text-secondary uppercase">
                  <span>/{track.slug}</span>
                  <span>{track._count.units} unidades</span>
                  <span>{track._count.lessons} lições</span>
                  <span>Ordem: {track.order}</span>
                </div>
              </div>
              <TrackActions
                trackId={track.id}
                published={track.published}
                title={track.title}
              />
            </div>
          </div>
        ))}

        {tracks.length === 0 && (
          <div className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-10 text-center text-secondary">
            Nenhuma trilha cadastrada. Crie a primeira!
          </div>
        )}
      </div>
    </div>
  );
}
