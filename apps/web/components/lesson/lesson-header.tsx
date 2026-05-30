"use client";

import Link from "next/link";
import { X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_LIVES } from "@/lib/lesson-lives";

interface LessonHeaderProps {
  progress: number;
  lives?: number;
  exitHref?: string;
}

export function LessonHeader({
  progress,
  lives = MAX_LIVES,
  exitHref = "/dashboard",
}: LessonHeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full bg-surface z-50 h-16 px-4 md:px-10 flex items-center">
      <div className="max-w-[1200px] w-full mx-auto flex items-center gap-4 md:gap-6">
        <Link
          href={exitHref}
          className="p-1 hover:bg-surface-container rounded-lg transition-all duration-100"
        >
          <X className="h-8 w-8 text-outline" />
        </Link>

        <div className="flex-grow h-2 bg-surface-container-highest rounded-full overflow-hidden relative">
          <div
            className="h-full bg-primary-container relative transition-all duration-300 bouncy-transition"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-1/2 progress-glow" />
          </div>
        </div>

        <div className="flex items-center gap-0.5 px-2" aria-label={`${lives} de ${MAX_LIVES} vidas`}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "h-6 w-6 transition-colors duration-200",
                i < lives ? "fill-error text-error" : "text-surface-container-highest"
              )}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
