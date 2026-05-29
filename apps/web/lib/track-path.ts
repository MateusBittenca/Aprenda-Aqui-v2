import type { Lesson, Unit } from "database";

export type LessonPathStatus = "completed" | "current" | "locked";

export interface PathLessonNode {
  id: string;
  title: string;
  type: Lesson["type"];
  xpReward: number;
  status: LessonPathStatus;
  href: string;
  offsetX: number;
  unitTitle: string | null;
  isLast: boolean;
  justCompleted: boolean;
}

type UnitWithLessons = Unit & { lessons: Lesson[] };

const ZIGZAG_OFFSETS = [0, 64, -48, 32, 0, -32, 48, -64];

export function buildLessonPath(
  units: UnitWithLessons[],
  completedIds: Set<string>,
  justCompletedId?: string
): PathLessonNode[] {
  const flat: { lesson: Lesson; unit: UnitWithLessons; indexInUnit: number }[] = [];

  for (const unit of units) {
    unit.lessons.forEach((lesson: Lesson, indexInUnit: number) => {
      flat.push({ lesson, unit, indexInUnit });
    });
  }

  let foundCurrent = false;

  return flat.map(({ lesson, unit, indexInUnit }, globalIndex) => {
    const done = completedIds.has(lesson.id);
    const prevLesson = globalIndex > 0 ? flat[globalIndex - 1].lesson : null;
    const prevDone = !prevLesson || completedIds.has(prevLesson.id);

    let status: LessonPathStatus;
    if (done) {
      status = "completed";
    } else if (!prevDone) {
      status = "locked";
    } else if (!foundCurrent) {
      status = "current";
      foundCurrent = true;
    } else {
      status = "locked";
    }

    const prevUnit = globalIndex > 0 ? flat[globalIndex - 1].unit : null;
    const showUnitTitle = !prevUnit || prevUnit.id !== unit.id;

    const offsetX =
      unit.pathOffset !== 0
        ? unit.pathOffset + (indexInUnit % 2 === 0 ? 0 : indexInUnit * 8)
        : ZIGZAG_OFFSETS[globalIndex % ZIGZAG_OFFSETS.length];

    return {
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      xpReward: lesson.xpReward,
      status,
      href: status === "locked" ? "#" : `/licoes/${lesson.id}`,
      offsetX,
      unitTitle: showUnitTitle ? unit.title : null,
      isLast: globalIndex === flat.length - 1,
      justCompleted: lesson.id === justCompletedId,
    };
  });
}

export function countLessonsToRanking(nodes: PathLessonNode[]): number {
  const remaining = nodes.filter((n) => n.status !== "completed").length;
  return Math.min(remaining, 2);
}
