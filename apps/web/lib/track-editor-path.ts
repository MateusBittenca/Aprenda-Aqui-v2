export type EditorLessonType = "QUIZ" | "CODE";

export interface EditorPathLesson {
  id: string;
  title: string;
  type: EditorLessonType;
  xpReward: number;
  order: number;
  published: boolean;
  unitId: string;
  content: Record<string, unknown>;
  solution: Record<string, unknown> | null;
}

export interface EditorPathUnit {
  id: string;
  title: string;
  description: string | null;
  order: number;
  pathOffset: number;
  lessons: EditorPathLesson[];
}

export interface EditorTrackData {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  order: number;
  published: boolean;
  colorPrimary: string;
  colorDark: string;
  colorLight: string;
  colorMuted: string;
  colorOnPrimary: string;
  units: EditorPathUnit[];
}

export interface EditorPathLessonNode {
  kind: "lesson";
  id: string;
  title: string;
  type: EditorLessonType;
  xpReward: number;
  published: boolean;
  unitId: string;
  offsetX: number;
  unitTitle: string | null;
  isLast: boolean;
  globalIndex: number;
  unitIndex: number;
  lessonIndex: number;
  isFirstInUnit: boolean;
  isLastInUnit: boolean;
}

export interface EditorPathAddUnitNode {
  kind: "add-unit";
  id: string;
  offsetX: number;
}

export interface EditorPathAddLessonNode {
  kind: "add-lesson";
  id: string;
  unitId: string;
  unitTitle: string;
  offsetX: number;
}

export type EditorPathNode =
  | EditorPathLessonNode
  | EditorPathAddUnitNode
  | EditorPathAddLessonNode;

const ZIGZAG_OFFSETS = [0, 64, -48, 32, 0, -32, 48, -64];

export function buildEditorTrackPath(units: EditorPathUnit[]): EditorPathNode[] {
  const nodes: EditorPathNode[] = [];
  let globalIndex = 0;

  units.forEach((unit, unitIndex) => {
    if (unit.lessons.length === 0) {
      const offsetX =
        unit.pathOffset !== 0
          ? unit.pathOffset
          : ZIGZAG_OFFSETS[globalIndex % ZIGZAG_OFFSETS.length];
      nodes.push({
        kind: "add-lesson",
        id: `add-lesson-${unit.id}`,
        unitId: unit.id,
        unitTitle: unit.title,
        offsetX,
      });
      globalIndex += 1;
      return;
    }

    unit.lessons.forEach((lesson, lessonIndex) => {
      const prevUnit = lessonIndex === 0 && unitIndex > 0 ? units[unitIndex - 1] : null;
      const showUnitTitle = lessonIndex === 0;

      const offsetX =
        unit.pathOffset !== 0
          ? unit.pathOffset + (lessonIndex % 2 === 0 ? 0 : lessonIndex * 8)
          : ZIGZAG_OFFSETS[globalIndex % ZIGZAG_OFFSETS.length];

      nodes.push({
        kind: "lesson",
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        xpReward: lesson.xpReward,
        published: lesson.published,
        unitId: unit.id,
        offsetX,
        unitTitle: showUnitTitle ? unit.title : null,
        isLast: false,
        globalIndex,
        unitIndex,
        lessonIndex,
        isFirstInUnit: lessonIndex === 0,
        isLastInUnit: lessonIndex === unit.lessons.length - 1,
      });
      globalIndex += 1;
    });
  });

  if (nodes.length > 0) {
    const lastLesson = [...nodes].reverse().find((n) => n.kind === "lesson");
    if (lastLesson && lastLesson.kind === "lesson") {
      lastLesson.isLast = true;
    }
  }

  nodes.push({
    kind: "add-unit",
    id: "add-unit-end",
    offsetX: ZIGZAG_OFFSETS[globalIndex % ZIGZAG_OFFSETS.length],
  });

  return nodes;
}

export function serializeTrackForEditor(track: {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  order: number;
  published: boolean;
  colorPrimary: string;
  colorDark: string;
  colorLight: string;
  colorMuted: string;
  colorOnPrimary: string;
  units: Array<{
    id: string;
    title: string;
    description: string | null;
    order: number;
    pathOffset: number;
    lessons: Array<{
      id: string;
      title: string;
      type: EditorLessonType;
      order: number;
      xpReward: number;
      published: boolean;
      content: unknown;
      solution: unknown;
    }>;
  }>;
}): EditorTrackData {
  return {
    id: track.id,
    title: track.title,
    description: track.description,
    slug: track.slug,
    icon: track.icon,
    order: track.order,
    published: track.published,
    colorPrimary: track.colorPrimary,
    colorDark: track.colorDark,
    colorLight: track.colorLight,
    colorMuted: track.colorMuted,
    colorOnPrimary: track.colorOnPrimary,
    units: track.units.map((unit) => ({
      id: unit.id,
      title: unit.title,
      description: unit.description,
      order: unit.order,
      pathOffset: unit.pathOffset,
      lessons: unit.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        order: lesson.order,
        xpReward: lesson.xpReward,
        published: lesson.published,
        unitId: unit.id,
        content: (lesson.content as Record<string, unknown>) ?? {},
        solution: (lesson.solution as Record<string, unknown> | null) ?? null,
      })),
    })),
  };
}
