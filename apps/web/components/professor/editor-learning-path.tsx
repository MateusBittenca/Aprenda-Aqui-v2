"use client";

import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EditorPathLessonNode, EditorPathNode } from "@/lib/track-editor-path";
import { PathNodeLessonIcon } from "@/lib/track-icons";
import { getTrackTheme, type TrackColorSource, type TrackTheme } from "@/lib/track-theme";

export type EditorSelection =
  | { type: "track" }
  | { type: "unit"; unitId: string }
  | { type: "lesson"; lessonId: string; unitId: string }
  | { type: "new-unit" }
  | { type: "new-lesson"; unitId: string; lessonType: "QUIZ" | "CODE" };

interface EditorLearningPathProps {
  nodes: EditorPathNode[];
  trackIcon?: string;
  trackSlug?: string;
  trackColors?: TrackColorSource;
  theme?: TrackTheme;
  selection: EditorSelection | null;
  onSelect: (selection: EditorSelection) => void;
  onReorderLesson: (lessonId: string, direction: "up" | "down") => void;
  onAddUnit: () => void;
  onAddLesson: (unitId: string, lessonType: "QUIZ" | "CODE") => void;
  onSelectUnit: (unitId: string) => void;
}

function isLessonSelected(
  selection: EditorSelection | null,
  lessonId: string
): boolean {
  return selection?.type === "lesson" && selection.lessonId === lessonId;
}

function isUnitSelected(selection: EditorSelection | null, unitId: string): boolean {
  return selection?.type === "unit" && selection.unitId === unitId;
}

export function EditorLearningPath({
  nodes,
  trackIcon,
  trackSlug,
  trackColors,
  theme: themeProp,
  selection,
  onSelect,
  onReorderLesson,
  onAddUnit,
  onAddLesson,
  onSelectUnit,
}: EditorLearningPathProps) {
  const theme = themeProp ?? getTrackTheme(trackColors ?? { slug: trackSlug ?? "default" });
  const pathHeight = Math.max(nodes.length * 140, 400);
  const lessonNodes = nodes.filter((n): n is EditorPathLessonNode => n.kind === "lesson");

  const unitIdsWithLessons = new Set(lessonNodes.map((n) => n.unitId));

  return (
    <div
      className={cn(
        "relative w-full max-w-sm flex flex-col items-center gap-16 py-8 mx-auto",
        theme.className
      )}
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

      {nodes.map((node) => {
        if (node.kind === "add-unit") {
          return (
            <div
              key={node.id}
              className="w-full flex flex-col items-center"
              style={{ transform: `translateX(${node.offsetX}px)` }}
            >
              <button
                type="button"
                onClick={onAddUnit}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed border-surface-variant",
                  "bg-surface-container-lowest text-secondary font-bold text-sm uppercase tracking-wide",
                  "hover:border-primary hover:text-primary bouncy-transition",
                  selection?.type === "new-unit" && "border-primary text-primary ring-2 ring-primary/30"
                )}
              >
                <Plus className="h-4 w-4" />
                Nova unidade
              </button>
            </div>
          );
        }

        if (node.kind === "add-lesson") {
          return (
            <div
              key={node.id}
              className="w-full flex flex-col items-center"
              style={{ transform: `translateX(${node.offsetX}px)` }}
            >
              <button
                type="button"
                onClick={() => onSelectUnit(node.unitId)}
                className={cn(
                  "mb-4 px-4 py-2 bg-surface border-2 border-surface-variant rounded-xl font-black text-xs uppercase tracking-widest text-secondary shadow-sm bouncy-transition hover:border-primary hover:text-primary",
                  isUnitSelected(selection, node.unitId) &&
                    "border-primary text-primary ring-2 ring-primary/30"
                )}
              >
                {node.unitTitle}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onAddLesson(node.unitId, "QUIZ")}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold border-2 border-dashed border-surface-variant hover:border-primary hover:text-primary bouncy-transition"
                >
                  <Plus className="h-3 w-3" />
                  Quiz
                </button>
                <button
                  type="button"
                  onClick={() => onAddLesson(node.unitId, "CODE")}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold border-2 border-dashed border-surface-variant hover:border-primary hover:text-primary bouncy-transition"
                >
                  <Plus className="h-3 w-3" />
                  Código
                </button>
              </div>
            </div>
          );
        }

        const selected = isLessonSelected(selection, node.id);
        const unitSelected = isUnitSelected(selection, node.unitId);

        return (
          <div
            key={node.id}
            className="w-full flex flex-col items-center"
            style={{ transform: `translateX(${node.offsetX}px)` }}
          >
            {node.unitTitle && (
              <button
                type="button"
                onClick={() => onSelectUnit(node.unitId)}
                className={cn(
                  "mb-6 px-4 py-2 bg-surface border-2 border-surface-variant rounded-xl font-black text-xs uppercase tracking-widest text-secondary shadow-sm bouncy-transition hover:border-primary hover:text-primary",
                  unitSelected && "border-primary text-primary ring-2 ring-primary/30"
                )}
              >
                {node.unitTitle}
              </button>
            )}

            <div className="relative z-10 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onSelect({ type: "lesson", lessonId: node.id, unitId: node.unitId })
                }
                className={cn(
                  "path-node group relative",
                  !node.published && "opacity-70"
                )}
              >
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center transition-transform bouncy-transition",
                    "track-node-current w-28 h-28 shadow-xl",
                    !node.published && "border-2 border-dashed border-surface-variant",
                    selected && "ring-4 ring-primary ring-offset-2 scale-105"
                  )}
                >
                  <PathNodeLessonIcon
                    type={node.type}
                    title={node.title}
                    status="current"
                    iconKey={trackIcon}
                    slug={trackSlug}
                  />
                </div>

                <div
                  className={cn(
                    "absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap max-w-[200px] truncate",
                    selected
                      ? "track-node-current-label font-black text-sm shadow-lg -bottom-4"
                      : "bg-surface border-2 border-surface-variant text-on-background"
                  )}
                >
                  {node.title}
                </div>
              </button>

              <div className="flex items-center gap-1 mt-6">
                {!node.published && (
                  <span className="text-[10px] font-bold uppercase text-secondary bg-surface-variant px-2 py-0.5 rounded-full">
                    Rascunho
                  </span>
                )}
                {selected && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={node.isFirstInUnit && node.globalIndex === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderLesson(node.id, "up");
                      }}
                      className="p-1.5 rounded-lg border-2 border-surface-variant bg-surface hover:border-primary disabled:opacity-30"
                      aria-label="Mover para cima"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={node.isLast}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderLesson(node.id, "down");
                      }}
                      className="p-1.5 rounded-lg border-2 border-surface-variant bg-surface hover:border-primary disabled:opacity-30"
                      aria-label="Mover para baixo"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {node.isLastInUnit && unitIdsWithLessons.has(node.unitId) && (
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => onAddLesson(node.unitId, "QUIZ")}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-surface-variant bg-surface-container-lowest hover:border-primary hover:text-primary bouncy-transition",
                      selection?.type === "new-lesson" &&
                        selection.unitId === node.unitId &&
                        selection.lessonType === "QUIZ" &&
                        "border-primary text-primary"
                    )}
                  >
                    <Plus className="h-3 w-3" />
                    Quiz
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddLesson(node.unitId, "CODE")}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-surface-variant bg-surface-container-lowest hover:border-primary hover:text-primary bouncy-transition",
                      selection?.type === "new-lesson" &&
                        selection.unitId === node.unitId &&
                        selection.lessonType === "CODE" &&
                        "border-primary text-primary"
                    )}
                  >
                    <Plus className="h-3 w-3" />
                    Código
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {lessonNodes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-secondary text-sm mb-4">Comece adicionando uma unidade</p>
          <button
            type="button"
            onClick={onAddUnit}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-dashed border-primary text-primary font-bold bouncy-transition hover:bg-primary-container"
          >
            <Plus className="h-5 w-5" />
            Nova unidade
          </button>
        </div>
      )}
    </div>
  );
}
