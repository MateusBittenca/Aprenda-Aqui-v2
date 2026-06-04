"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackIconBadge } from "@/lib/track-icons";
import { getTrackTheme } from "@/lib/track-theme";
import { PublishedBadge } from "@/components/professor/professor-ui";
import { Button } from "@/components/ui/button";

interface ProfessorTrackCardProps {
  track: {
    id: string;
    title: string;
    description: string;
    slug: string;
    icon: string;
    published: boolean;
    colorPrimary: string;
    colorDark: string;
    colorLight: string;
    colorMuted: string;
    colorOnPrimary: string;
    unitCount: number;
    lessonCount: number;
    publishedLessonCount: number;
  };
}

export function ProfessorTrackCard({ track }: ProfessorTrackCardProps) {
  const theme = getTrackTheme(track);
  const publishPct =
    track.lessonCount > 0
      ? Math.round((track.publishedLessonCount / track.lessonCount) * 100)
      : 0;

  return (
    <div
      style={theme.cssVars}
      className={cn(
        "track-themed group card-elevation rounded-4xl p-6 border-4 border-surface-variant block-shadow-card bouncy-transition"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <TrackIconBadge
            iconKey={track.icon}
            slug={track.slug}
            className="group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="track-title text-xl font-extrabold font-display">{track.title}</h2>
              <PublishedBadge published={track.published} />
            </div>
            <p className="text-sm text-on-surface-variant line-clamp-2">{track.description}</p>
          </div>
        </div>
        <ChevronRight className="track-chevron h-5 w-5 text-outline shrink-0" />
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-on-surface-variant">Conteúdo publicado</span>
          <span className="track-text font-bold">
            {track.publishedLessonCount}/{track.lessonCount} lições
          </span>
        </div>
        <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="track-progress-bar h-full rounded-full progress-glow transition-all"
            style={{ width: `${publishPct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs font-bold text-secondary uppercase">
          <span>/{track.slug}</span>
          <span>{track.unitCount} unidades</span>
        </div>
        <Button asChild size="sm" className="block-shadow-primary rounded-xl font-bold">
          <Link href={`/professor/trilhas/${track.id}`}>Editar trilha</Link>
        </Button>
      </div>
    </div>
  );
}
