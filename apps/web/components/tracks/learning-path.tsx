"use client";

import Link from "next/link";
import { Lock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PathLessonNode } from "@/lib/track-path";
import { PathNodeLessonIcon } from "@/lib/track-icons";
import { getTrackTheme, type TrackColorSource, type TrackTheme } from "@/lib/track-theme";

interface LearningPathProps {
  nodes: PathLessonNode[];
  trackIcon?: string;
  trackSlug?: string;
  trackColors?: TrackColorSource;
  theme?: TrackTheme;
}

function PathNodeIcon({
  node,
  trackIcon,
  trackSlug,
}: {
  node: PathLessonNode;
  trackIcon?: string;
  trackSlug?: string;
}) {
  if (node.status === "locked") {
    if (node.isLast) {
      return <Trophy className="h-10 w-10" />;
    }
    return <Lock className="h-9 w-9" />;
  }

  if (node.isLast && node.status !== "completed") {
    return <Trophy className="h-11 w-11" />;
  }

  return (
    <PathNodeLessonIcon
      type={node.type}
      title={node.title}
      status={node.status}
      iconKey={trackIcon}
      slug={trackSlug}
    />
  );
}

export function LearningPath({
  nodes,
  trackIcon,
  trackSlug,
  trackColors,
  theme: themeProp,
}: LearningPathProps) {
  const theme = themeProp ?? getTrackTheme(trackColors ?? { slug: trackSlug ?? "default" });
  const pathHeight = Math.max(nodes.length * 140, 400);

  return (
    <div
      className={cn("relative w-full max-w-sm flex flex-col items-center gap-16 py-8 mx-auto", theme.className)}
      style={theme.cssVars}
    >
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full -z-10 opacity-20 pointer-events-none"
        fill="none"
        viewBox="0 0 200 800"
        style={{ height: pathHeight }}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M100 0 C150 100, 50 150, 100 250 C150 350, 50 400, 100 500 C150 600, 50 650, 100 750"
          stroke={theme.pathStroke}
          strokeDasharray="16 16"
          strokeWidth="8"
        />
      </svg>

      {nodes.map((node) => (
        <div
          key={node.id}
          className="w-full flex flex-col items-center"
          style={{ transform: `translateX(${node.offsetX}px)` }}
        >
          {node.unitTitle && (
            <div className="mb-6 px-4 py-2 bg-surface border-2 border-surface-variant rounded-xl font-black text-xs uppercase tracking-widest text-secondary shadow-sm">
              {node.unitTitle}
            </div>
          )}

          <Link
            href={node.href}
            aria-disabled={node.status === "locked"}
            onClick={(e) => {
              if (node.status === "locked") e.preventDefault();
            }}
            className={cn(
              "path-node relative z-10 group",
              node.status === "locked" && "pointer-events-none"
            )}
          >
            <div
              className={cn(
                "rounded-full flex items-center justify-center transition-transform",
                node.status === "completed" && "track-node-completed w-24 h-24 shadow-xl",
                node.status === "current" && "track-node-current w-32 h-32 shadow-2xl pulse-highlight",
                node.status === "locked" &&
                  cn(
                    "w-24 h-24 border-b-8 opacity-50 grayscale",
                    node.isLast
                      ? "bg-tertiary-container border-on-tertiary-fixed-variant"
                      : "bg-surface-container-highest border-surface-dim text-secondary"
                  ),
                node.justCompleted && "track-node-ring ring-4 ring-offset-2"
              )}
            >
              <PathNodeIcon node={node} trackIcon={trackIcon} trackSlug={trackSlug} />
            </div>

            <div
              className={cn(
                "absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap max-w-[180px] truncate",
                node.status === "current"
                  ? "track-node-current-label font-black text-sm shadow-lg -bottom-4"
                  : "bg-surface border-2 border-surface-variant text-on-background"
              )}
            >
              {node.status === "current" ? node.title.toUpperCase() : node.title}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
