import {
  Check,
  Code2,
  FileCode,
  HelpCircle,
  Link2,
  List,
  Tags,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TRACK_ICON_MAP } from "@/lib/track-options";

type LessonType = "QUIZ" | "CODE";

const SLUG_ICON_MAP: Record<string, LucideIcon> = {
  html: FileCode,
  css: TRACK_ICON_MAP.palette ?? FileCode,
  javascript: TRACK_ICON_MAP.braces ?? FileCode,
};

export function resolveTrackIcon(iconKey?: string | null, slug?: string): LucideIcon {
  if (iconKey && TRACK_ICON_MAP[iconKey]) return TRACK_ICON_MAP[iconKey];
  if (slug && SLUG_ICON_MAP[slug]) return SLUG_ICON_MAP[slug];
  return FileCode;
}

export function resolveLessonIcon(type: LessonType, title?: string): LucideIcon {
  const normalized = title?.toLowerCase() ?? "";

  if (normalized.includes("lista")) return List;
  if (normalized.includes("link") || normalized.includes("âncora")) return Link2;
  if (normalized.includes("tag")) return Tags;
  if (normalized.includes("função") || normalized.includes("arrow") || normalized.includes("array")) {
    return TRACK_ICON_MAP.braces ?? FileCode;
  }

  return type === "QUIZ" ? HelpCircle : Code2;
}

const TRACK_BOX = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
} as const;

const TRACK_ICON_SIZE = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-11 w-11",
} as const;

interface TrackIconBadgeProps {
  iconKey?: string | null;
  slug?: string;
  size?: keyof typeof TRACK_BOX;
  className?: string;
}

export function TrackIconBadge({
  iconKey,
  slug,
  size = "md",
  className,
}: TrackIconBadgeProps) {
  const Icon = resolveTrackIcon(iconKey, slug);

  return (
    <div
      className={cn(
        "track-icon-badge rounded-full flex items-center justify-center shrink-0",
        TRACK_BOX[size],
        className
      )}
    >
      <Icon className={TRACK_ICON_SIZE[size]} strokeWidth={2.5} />
    </div>
  );
}

interface LessonIconBadgeProps {
  type: LessonType;
  title?: string;
  completed?: boolean;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const LESSON_ICON_SIZE = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-5 w-5",
} as const;

export function LessonIconBadge({
  type,
  title,
  completed = false,
  size = "xs",
  className,
}: LessonIconBadgeProps) {
  const Icon = resolveLessonIcon(type, title);
  const boxSize = size === "md" ? "h-6 w-6" : size === "sm" ? "h-5 w-5" : "h-5 w-5";

  if (completed) {
    return (
      <span
        className={cn(
          "track-badge-icon-done inline-flex shrink-0 items-center justify-center rounded-full",
          boxSize,
          className
        )}
        aria-label="Lição concluída"
      >
        <Check className={cn(LESSON_ICON_SIZE[size])} strokeWidth={3} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md bg-surface-container-highest/80",
        boxSize,
        className
      )}
    >
      <Icon className={cn(LESSON_ICON_SIZE[size], "text-on-surface-variant")} strokeWidth={2.5} />
    </span>
  );
}

interface PathNodeIconProps {
  type: LessonType;
  title?: string;
  status: "completed" | "current" | "locked";
  iconKey?: string | null;
  slug?: string;
  className?: string;
}

export function PathNodeLessonIcon({
  type,
  title,
  status,
  iconKey,
  slug,
  className,
}: PathNodeIconProps) {
  const LessonIcon = resolveLessonIcon(type, title);
  const TrackIcon = resolveTrackIcon(iconKey, slug);

  if (status === "completed") {
    return <Check className={cn("h-10 w-10", className)} strokeWidth={3} />;
  }

  if (status === "current" && type === "QUIZ") {
    return <HelpCircle className={cn("h-11 w-11", className)} strokeWidth={2.5} />;
  }

  if (status === "current" && type === "CODE") {
    return <Code2 className={cn("h-11 w-11", className)} strokeWidth={2.5} />;
  }

  if (status === "current") {
    return <TrackIcon className={cn("h-10 w-10", className)} strokeWidth={2.5} />;
  }

  return <LessonIcon className={cn("h-9 w-9", className)} strokeWidth={2.5} />;
}
