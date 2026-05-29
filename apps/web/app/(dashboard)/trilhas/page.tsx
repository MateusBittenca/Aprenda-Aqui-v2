import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma, Lesson, Track, Unit } from "database";
import { authOptions } from "@/lib/auth";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonIconBadge, TrackIconBadge } from "@/lib/track-icons";
import { getTrackTheme } from "@/lib/track-theme";

type TrackWithUnits = Track & {
  units: (Unit & { lessons: Lesson[] })[];
};

export const dynamic = "force-dynamic";

export default async function TrilhasPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const tracks: TrackWithUnits[] = await prisma.track.findMany({
    orderBy: { order: "asc" },
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  const completedIds = new Set<string>();
  if (userId) {
    const progress = await prisma.userProgress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    });
    progress.forEach((p: { lessonId: string }) => completedIds.add(p.lessonId));
  }

  return (
    <div>
      <h1 className="text-4xl font-black text-on-background mb-2 font-display">
        Trilhas de Aprendizado
      </h1>
      <p className="text-on-surface-variant mb-8">
        Escolha uma trilha e siga o caminho estilo Duolingo!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tracks.map((track) => {
          const theme = getTrackTheme(track);
          const allLessons = track.units.flatMap((u: TrackWithUnits["units"][number]) => u.lessons);
          const completedCount = allLessons.filter((l: Lesson) => completedIds.has(l.id)).length;
          const totalCount = allLessons.length;
          const progressPct =
            totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <Link
              key={track.id}
              href={`/trilhas/${track.slug}`}
              style={theme.cssVars}
              className={cn(
                "track-themed track-card group card-elevation rounded-4xl p-6 border-4 border-surface-variant transition-all block-shadow-card bouncy-transition"
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
                    <h2 className="track-title text-2xl font-extrabold font-display">
                      {track.title}
                    </h2>
                    <p className="text-sm text-on-surface-variant line-clamp-2">
                      {track.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="track-chevron h-6 w-6 text-outline shrink-0 transition-colors" />
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-on-surface-variant">Progresso</span>
                  <span className="track-text font-bold">
                    {completedCount}/{totalCount} lições
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="track-progress-bar h-full rounded-full progress-glow transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {allLessons.slice(0, 5).map((lesson: Lesson) => {
                  const done = completedIds.has(lesson.id);
                  return (
                    <span
                      key={lesson.id}
                      className={cn(
                        "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold border",
                        done
                          ? "track-badge-done"
                          : "bg-surface-container border-surface-variant text-on-surface-variant"
                      )}
                    >
                      <LessonIconBadge
                        type={lesson.type}
                        title={lesson.title}
                        completed={done}
                        size="xs"
                      />
                      <span className="truncate max-w-[100px]">{lesson.title}</span>
                    </span>
                  );
                })}
                {allLessons.length > 5 && (
                  <span className="text-xs font-bold text-outline self-center">
                    +{allLessons.length - 5}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
