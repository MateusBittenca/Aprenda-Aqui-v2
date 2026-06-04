import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "database";
import { TrackForm } from "@/components/professor/track-form";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function EditTrackPage({ params }: PageProps) {
  const { trackId } = await params;
  const track = await prisma.track.findUnique({ where: { id: trackId } });
  if (!track) notFound();

  return (
    <div>
      <Link
        href={`/professor/trilhas/${trackId}`}
        className="text-sm font-bold text-secondary hover:text-primary mb-4 inline-block"
      >
        ← Voltar
      </Link>
      <h1 className="text-3xl font-extrabold font-display text-primary mb-6">
        Editar trilha
      </h1>
      <TrackForm mode="edit" trackId={trackId} initial={track} />
    </div>
  );
}
