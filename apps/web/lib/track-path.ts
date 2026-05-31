export type LessonType = "QUIZ" | "CODE";

interface PathLesson {
  id: string;
  title: string;
  type: LessonType;
  xpReward: number;
  order: number;
}

interface PathUnit {
  id: string;
  title: string;
  pathOffset: number;
  lessons: PathLesson[];
}

export type LessonPathStatus = "completed" | "current" | "locked";
export type PathChestStatus = "locked" | "available" | "claimed";

export interface PathLessonNode {
  kind: "lesson";
  id: string;
  title: string;
  type: LessonType;
  xpReward: number;
  status: LessonPathStatus;
  href: string;
  offsetX: number;
  unitTitle: string | null;
  isLast: boolean;
  justCompleted: boolean;
}

export interface PathChestNode {
  kind: "chest";
  id: string;
  title: string;
  xpReward: number;
  gemsReward: number;
  status: PathChestStatus;
  offsetX: number;
}

export type PathNode = PathLessonNode | PathChestNode;

type UnitWithLessons = PathUnit;

export interface TrackChestPlacement {
  id: string;
  afterLessonId: string;
  title: string;
  xpReward: number;
  gemsReward: number;
  order: number;
}

const ZIGZAG_OFFSETS = [0, 64, -48, 32, 0, -32, 48, -64];

export function buildTrackPath(
  units: UnitWithLessons[],
  completedIds: Set<string>,
  claimedChestIds: Set<string>,
  chests: TrackChestPlacement[],
  justCompletedId?: string
): PathNode[] {
  const chestsByLesson = new Map<string, TrackChestPlacement[]>();
  for (const chest of chests) {
    const list = chestsByLesson.get(chest.afterLessonId) ?? [];
    list.push(chest);
    chestsByLesson.set(chest.afterLessonId, list);
  }
  chestsByLesson.forEach((list) => {
    list.sort((a: TrackChestPlacement, b: TrackChestPlacement) => a.order - b.order);
  });

  const flat: { lesson: PathLesson; unit: UnitWithLessons; indexInUnit: number }[] = [];

  for (const unit of units) {
    unit.lessons.forEach((lesson: PathLesson, indexInUnit: number) => {
      flat.push({ lesson, unit, indexInUnit });
    });
  }

  let foundCurrent = false;
  const nodes: PathNode[] = [];

  flat.forEach(({ lesson, unit, indexInUnit }, globalIndex) => {
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

    nodes.push({
      kind: "lesson",
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
    });

    const unitChests = chestsByLesson.get(lesson.id);
    if (unitChests) {
      for (const chest of unitChests) {
        let chestStatus: PathChestStatus;
        if (claimedChestIds.has(chest.id)) {
          chestStatus = "claimed";
        } else if (done) {
          chestStatus = "available";
        } else {
          chestStatus = "locked";
        }

        nodes.push({
          kind: "chest",
          id: chest.id,
          title: chest.title,
          xpReward: chest.xpReward,
          gemsReward: chest.gemsReward,
          status: chestStatus,
          offsetX: offsetX + (indexInUnit % 2 === 0 ? 24 : -24),
        });
      }
    }
  });

  return nodes;
}

/** @deprecated Use buildTrackPath */
export function buildLessonPath(
  units: UnitWithLessons[],
  completedIds: Set<string>,
  justCompletedId?: string
): PathLessonNode[] {
  return buildTrackPath(units, completedIds, new Set(), [], justCompletedId).filter(
    (n): n is PathLessonNode => n.kind === "lesson"
  );
}

export function countLessonsToRanking(nodes: PathNode[]): number {
  const remaining = nodes.filter(
    (n) => n.kind === "lesson" && n.status !== "completed"
  ).length;
  return Math.min(remaining, 2);
}
