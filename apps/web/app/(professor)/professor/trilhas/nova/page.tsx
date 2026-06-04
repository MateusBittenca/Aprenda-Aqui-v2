import Link from "next/link";
import { TrackForm } from "@/components/professor/track-form";

export default function NewTrackPage() {
  return (
    <div>
      <Link
        href="/professor/trilhas"
        className="text-sm font-bold text-secondary hover:text-primary mb-4 inline-block"
      >
        ← Voltar
      </Link>
      <h1 className="text-3xl font-extrabold font-display text-primary mb-6">Nova trilha</h1>
      <TrackForm mode="create" />
    </div>
  );
}
