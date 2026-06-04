import { notFound } from "next/navigation";
import { prisma } from "database";
import { serializeTrackForEditor } from "@/lib/track-editor-path";
import { TrackVisualEditor } from "@/components/professor/track-visual-editor";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function TrackEditorPage({ params }: PageProps) {
  const { trackId } = await params;
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!track) notFound();

  const editorTrack = serializeTrackForEditor(track);

  return (
    <div className="max-w-[1400px] mx-auto -mx-2 lg:-mx-4">
      <TrackVisualEditor initialTrack={editorTrack} />
    </div>
  );
}
