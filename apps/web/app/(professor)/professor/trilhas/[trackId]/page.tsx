import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { prisma } from "database";
import { Button } from "@/components/ui/button";
import { PublishedBadge } from "@/components/professor/professor-ui";
import { UnitRowActions } from "@/components/professor/unit-row-actions";
import { TrackActions } from "@/components/professor/track-actions";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function TrackDetailPage({ params }: PageProps) {
  const { trackId } = await params;
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    include: {
      units: {
        orderBy: { order: "asc" },
        include: { _count: { select: { lessons: true } } },
      },
    },
  });

  if (!track) notFound();

  return (
    <div>
      <Link
        href="/professor/trilhas"
        className="text-sm font-bold text-secondary hover:text-primary mb-4 inline-block"
      >
        ← Trilhas
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold font-display text-primary">{track.title}</h1>
            <PublishedBadge published={track.published} />
          </div>
          <p className="text-secondary">{track.description}</p>
        </div>
        <TrackActions trackId={track.id} published={track.published} title={track.title} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold font-display">Unidades</h2>
        <Button asChild size="sm" className="rounded-xl font-bold block-shadow-primary">
          <Link href={`/professor/trilhas/${trackId}/unidades/nova`}>
            <Plus className="h-4 w-4 mr-1" />
            Nova unidade
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {track.units.map((unit, index) => (
          <div
            key={unit.id}
            className="block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <Link
                href={`/professor/unidades/${unit.id}`}
                className="text-lg font-extrabold hover:text-primary transition-colors"
              >
                {unit.title}
              </Link>
              {unit.description && (
                <p className="text-sm text-secondary mt-1">{unit.description}</p>
              )}
              <p className="text-xs font-bold text-secondary uppercase mt-2">
                {unit._count.lessons} lições · Ordem {unit.order}
              </p>
            </div>
            <UnitRowActions
              unitId={unit.id}
              trackId={trackId}
              title={unit.title}
              isFirst={index === 0}
              isLast={index === track.units.length - 1}
            />
          </div>
        ))}

        {track.units.length === 0 && (
          <div className="block-shadow-card rounded-4xl border-2 border-surface-variant p-8 text-center text-secondary">
            Nenhuma unidade. Adicione a primeira!
          </div>
        )}
      </div>
    </div>
  );
}
