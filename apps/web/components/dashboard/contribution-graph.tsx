"use client";

import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  CONTRIBUTION_LEVEL_CLASS,
  formatContributionTooltip,
  type ContributionGraphData,
  type ContributionLevel,
} from "@/lib/contribution-graph";

const ROW_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const VISIBLE_ROW_LABELS = new Set([0, 2, 4, 6]);

type GraphDensity = "compact" | "comfortable";

const DENSITY: Record<
  GraphDensity,
  {
    cell: string;
    colGap: string;
    rowGap: string;
    weekStep: number;
    label: string;
    rowLabelPy: string;
    rowLabelHeight: string;
  }
> = {
  compact: {
    cell: "h-3 w-3",
    colGap: "gap-[3px]",
    rowGap: "gap-[3px]",
    weekStep: 14,
    label: "text-[10px]",
    rowLabelPy: "py-[18px]",
    rowLabelHeight: "h-3",
  },
  comfortable: {
    cell: "h-3.5 w-3.5 sm:h-4 sm:w-4",
    colGap: "gap-1",
    rowGap: "gap-1",
    weekStep: 20,
    label: "text-xs",
    rowLabelPy: "py-[22px] sm:py-[24px]",
    rowLabelHeight: "h-3.5 sm:h-4",
  },
};

function getMonthLabels(weeks: ContributionGraphData["weeks"]): { label: string; index: number }[] {
  const labels: { label: string; index: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find((d) => d.date);
    if (!firstDay?.date) return;

    const month = new Date(`${firstDay.date}T12:00:00`).getMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      labels.push({
        index: weekIndex,
        label: new Intl.DateTimeFormat("pt-BR", { month: "short" })
          .format(new Date(`${firstDay.date}T12:00:00`))
          .replace(".", ""),
      });
    }
  });

  return labels;
}

function ContributionGraphGrid({
  weeks,
  density,
}: {
  weeks: ContributionGraphData["weeks"];
  density: GraphDensity;
}) {
  const styles = DENSITY[density];
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  return (
    <div className="flex gap-2 min-w-max">
      <div
        className={cn(
          "flex flex-col justify-between shrink-0 font-bold text-navy/50 dark:text-navy/40 leading-none",
          styles.label,
          styles.rowLabelPy
        )}
      >
        {ROW_LABELS.map((label, row) => (
          <span
            key={label}
            className={cn(
              styles.rowLabelHeight,
              "flex items-center",
              !VISIBLE_ROW_LABELS.has(row) && "opacity-0"
            )}
          >
            {label}
          </span>
        ))}
      </div>

      <div>
        <div className="relative h-5 mb-1.5">
          {monthLabels.map(({ label, index }) => (
            <span
              key={`${label}-${index}`}
              className={cn(
                "absolute font-bold text-navy/50 dark:text-navy/40 capitalize",
                styles.label
              )}
              style={{ left: `${index * styles.weekStep}px` }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className={cn("flex", styles.colGap)}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={cn("flex flex-col", styles.rowGap)}>
              {week.map((day, dayIndex) => {
                if (!day.date) {
                  return (
                    <div
                      key={`empty-${weekIndex}-${dayIndex}`}
                      className={cn(styles.cell, "rounded-[4px] opacity-0")}
                      aria-hidden
                    />
                  );
                }

                const level = day.level as ContributionLevel;

                return (
                  <div
                    key={day.date}
                    className={cn(
                      styles.cell,
                      "rounded-[4px] transition-colors cursor-default",
                      CONTRIBUTION_LEVEL_CLASS[level]
                    )}
                    title={formatContributionTooltip(day.date, day.xp)}
                    aria-label={formatContributionTooltip(day.date, day.xp)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GraphScrollArea({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="relative -mx-1">
      <div className="overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:thin]">
        <div className="snap-start px-1">{children}</div>
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent sm:hidden"
        aria-hidden
      />
      {hint ? (
        <p className="mt-2 text-center text-xs font-medium text-navy/50 sm:hidden">{hint}</p>
      ) : null}
    </div>
  );
}

interface ContributionGraphProps {
  data: ContributionGraphData;
  className?: string;
}

export function ContributionGraph({ data, className }: ContributionGraphProps) {
  const mobileWeeks = useMemo(() => data.weeks.slice(-12), [data.weeks]);

  return (
    <div className={cn("w-full", className)}>
      <div className="sm:hidden">
        <GraphScrollArea hint="Deslize para ver o histórico · últimas 12 semanas">
          <ContributionGraphGrid weeks={mobileWeeks} density="comfortable" />
        </GraphScrollArea>
      </div>

      <div className="hidden sm:block">
        <GraphScrollArea>
          <ContributionGraphGrid weeks={data.weeks} density="compact" />
        </GraphScrollArea>
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-end gap-2 text-xs font-bold text-navy/50">
        <span>Menos</span>
        {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
          <div
            key={level}
            className={cn("h-3.5 w-3.5 sm:h-3 sm:w-3 rounded-[4px]", CONTRIBUTION_LEVEL_CLASS[level])}
          />
        ))}
        <span>Mais</span>
      </div>
    </div>
  );
}
