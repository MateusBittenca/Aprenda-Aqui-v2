"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTrackTheme } from "@/lib/track-theme";
import { TrackIconBadge } from "@/lib/track-icons";
import {
  buildEditorTrackPath,
  type EditorTrackData,
} from "@/lib/track-editor-path";
import {
  EditorLearningPath,
  type EditorSelection,
} from "@/components/professor/editor-learning-path";
import {
  EditorTrackPanel,
  EditorUnitPanel,
  EditorLessonPanel,
} from "@/components/professor/editor-panels";
import { PublishedBadge, StatusBanner } from "@/components/professor/professor-ui";
import { Button } from "@/components/ui/button";

interface TrackVisualEditorProps {
  initialTrack: EditorTrackData;
}

export function TrackVisualEditor({ initialTrack }: TrackVisualEditorProps) {
  const router = useRouter();
  const [selection, setSelection] = useState<EditorSelection>({ type: "track" });
  const [previewPatch, setPreviewPatch] = useState<Partial<EditorTrackData>>({});
  const [message, setMessage] = useState<{ text: string; variant: "success" | "error" } | null>(
    null
  );
  const [mobilePanelOpen, setMobilePanelOpen] = useState(true);

  const track = useMemo(
    () => ({ ...initialTrack, ...previewPatch }),
    [initialTrack, previewPatch]
  );

  const nodes = useMemo(() => buildEditorTrackPath(track.units), [track.units]);
  const theme = getTrackTheme(track);

  const selectedLesson = useMemo(() => {
    if (selection.type !== "lesson") return undefined;
    for (const unit of track.units) {
      const lesson = unit.lessons.find((l) => l.id === selection.lessonId);
      if (lesson) return lesson;
    }
    return undefined;
  }, [selection, track.units]);

  const selectedUnit = useMemo(() => {
    if (selection.type === "unit") {
      return track.units.find((u) => u.id === selection.unitId);
    }
    if (selection.type === "lesson") {
      return track.units.find((u) => u.id === selection.unitId);
    }
    if (selection.type === "new-lesson") {
      return track.units.find((u) => u.id === selection.unitId);
    }
    return undefined;
  }, [selection, track.units]);

  const handleSuccess = useCallback(() => {
    setPreviewPatch({});
    if (selection.type === "new-unit" || selection.type === "new-lesson") {
      setSelection({ type: "track" });
    }
    router.refresh();
  }, [selection.type, router]);

  const handlePreviewChange = useCallback((patch: Partial<EditorTrackData>) => {
    setPreviewPatch(patch);
  }, []);

  async function handleReorderLesson(lessonId: string, direction: "up" | "down") {
    setMessage(null);
    const res = await fetch(`/api/professor/lessons/${lessonId}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage({ text: data.error ?? "Erro ao reordenar", variant: "error" });
      return;
    }
    router.refresh();
  }

  async function handlePublishTrack() {
    setMessage(null);
    const res = await fetch(`/api/professor/tracks/${track.id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !track.published }),
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage({ text: data.error ?? "Erro ao publicar", variant: "error" });
      return;
    }
    setMessage({
      text: track.published ? "Trilha arquivada" : "Trilha publicada",
      variant: "success",
    });
    router.refresh();
  }

  function renderPanel() {
    if (selection.type === "track") {
      return (
        <EditorTrackPanel
          track={track}
          onPreviewChange={handlePreviewChange}
          onSuccess={handleSuccess}
          onMessage={setMessage}
        />
      );
    }
    if (selection.type === "new-unit") {
      return (
        <EditorUnitPanel
          trackId={track.id}
          mode="create"
          onSuccess={handleSuccess}
          onMessage={setMessage}
        />
      );
    }
    if (selection.type === "unit" && selectedUnit) {
      return (
        <EditorUnitPanel
          trackId={track.id}
          unit={selectedUnit}
          mode="edit"
          onSuccess={() => {
            setSelection({ type: "track" });
            handleSuccess();
          }}
          onMessage={setMessage}
        />
      );
    }
    if (selection.type === "new-lesson") {
      return (
        <EditorLessonPanel
          trackId={track.id}
          unitId={selection.unitId}
          mode="create"
          initialType={selection.lessonType}
          onSuccess={handleSuccess}
          onMessage={setMessage}
        />
      );
    }
    if (selection.type === "lesson" && selectedLesson) {
      return (
        <EditorLessonPanel
          trackId={track.id}
          unitId={selection.unitId}
          lesson={selectedLesson}
          mode="edit"
          onSuccess={handleSuccess}
          onMessage={setMessage}
        />
      );
    }
    return (
      <div className="text-center text-secondary py-8">
        <Settings2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm font-bold">Clique em um nó do caminho para editar</p>
      </div>
    );
  }

  const publishedLessons = track.units.reduce(
    (acc, u) => acc + u.lessons.filter((l) => l.published).length,
    0
  );
  const totalLessons = track.units.reduce((acc, u) => acc + u.lessons.length, 0);

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div
        className={cn(
          "block-shadow-card rounded-4xl border-2 border-surface-variant p-6 bouncy-transition",
          theme.className
        )}
        style={theme.cssVars}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <TrackIconBadge iconKey={track.icon} slug={track.slug} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="track-title text-2xl md:text-3xl font-black font-display">
                  {track.title}
                </h1>
                <PublishedBadge published={track.published} />
              </div>
              <p className="track-text text-sm md:text-base">{track.description}</p>
              <p className="text-xs font-bold text-secondary uppercase mt-2">
                {track.units.length} unidades · {totalLessons} lições · {publishedLessons}{" "}
                publicadas
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-xl font-bold"
              onClick={() => {
                setSelection({ type: "track" });
                setMobilePanelOpen(true);
              }}
            >
              <Settings2 className="h-4 w-4 mr-1" />
              Configurar
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-xl font-bold"
              onClick={handlePublishTrack}
            >
              {track.published ? "Arquivar" : "Publicar"}
            </Button>
            {track.published && (
              <Button asChild variant="secondary" size="sm" className="rounded-xl font-bold">
                <Link href={`/trilhas/${track.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ver como aluno
                </Link>
              </Button>
            )}
            <Button asChild variant="secondary" size="sm" className="rounded-xl font-bold">
              <Link href="/professor/trilhas">← Trilhas</Link>
            </Button>
          </div>
        </div>
      </div>

      {message && (
        <StatusBanner
          message={message.text}
          variant={message.variant}
          onDismiss={() => setMessage(null)}
        />
      )}

      {/* Two-column editor */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Preview column */}
        <div className="xl:col-span-3 block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-4 md:p-8 min-h-[500px]">
          <p className="text-xs font-bold text-secondary uppercase tracking-wide text-center mb-4">
            Preview do caminho
          </p>
          <EditorLearningPath
            nodes={nodes}
            trackIcon={track.icon}
            trackSlug={track.slug}
            trackColors={track}
            theme={theme}
            selection={selection}
            onSelect={(sel) => {
              setSelection(sel);
              setMobilePanelOpen(true);
            }}
            onReorderLesson={handleReorderLesson}
            onAddUnit={() => {
              setSelection({ type: "new-unit" });
              setMobilePanelOpen(true);
            }}
            onAddLesson={(unitId, lessonType) => {
              setSelection({ type: "new-lesson", unitId, lessonType });
              setMobilePanelOpen(true);
            }}
            onSelectUnit={(unitId) => {
              setSelection({ type: "unit", unitId });
              setMobilePanelOpen(true);
            }}
          />
        </div>

        {/* Side panel — desktop always visible, mobile toggle */}
        <div className="xl:col-span-2">
          <div className="xl:sticky xl:top-6">
            <button
              type="button"
              className="xl:hidden w-full mb-3 py-2 rounded-xl border-2 border-surface-variant font-bold text-sm"
              onClick={() => setMobilePanelOpen((v) => !v)}
            >
              {mobilePanelOpen ? "Ocultar painel" : "Abrir painel de edição"}
            </button>
            <div
              className={cn(
                "block-shadow-card rounded-4xl border-2 border-surface-variant bg-surface-container-lowest p-5 md:p-6 max-h-[calc(100vh-8rem)] overflow-y-auto",
                !mobilePanelOpen && "hidden xl:block"
              )}
            >
              {renderPanel()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
