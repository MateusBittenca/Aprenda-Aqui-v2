import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "database";
import { UnitForm } from "@/components/professor/unit-form";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function NewUnitPage({ params }: PageProps) {
  const { trackId } = await params;
  const track = await prisma.track.findUnique({ where: { id: trackId } });
  if (!track) notFound();

  return (
    <div>
      <Link
        href={`/professor/trilhas/${trackId}`}
        className="text-sm font-bold text-secondary hover:text-primary mb-4 inline-block"
      >
        ← {track.title}
      </Link>
      <h1 className="text-3xl font-extrabold font-display text-primary mb-6">Nova unidade</h1>
      <UnitForm trackId={trackId} mode="create" />
    </div>
  );
}
