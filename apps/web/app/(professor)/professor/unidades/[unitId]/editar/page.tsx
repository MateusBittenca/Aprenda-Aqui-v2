import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "database";
import { UnitForm } from "@/components/professor/unit-form";

interface PageProps {
  params: Promise<{ unitId: string }>;
}

export default async function EditUnitPage({ params }: PageProps) {
  const { unitId } = await params;
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { track: true },
  });
  if (!unit) notFound();

  return (
    <div>
      <Link
        href={`/professor/unidades/${unitId}`}
        className="text-sm font-bold text-secondary hover:text-primary mb-4 inline-block"
      >
        ← Voltar
      </Link>
      <h1 className="text-3xl font-extrabold font-display text-primary mb-6">Editar unidade</h1>
      <UnitForm trackId={unit.trackId} unitId={unitId} mode="edit" initial={unit} />
    </div>
  );
}
