"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  CONTRIBUTION_LEVEL_CLASS,
  formatContributionTooltip,
  type ContributionGraphData,
  type ContributionLevel,
} from "@/lib/contribution-graph";

const ROW_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const VISIBLE_ROW_LABELS = new Set([0, 2, 4, 6]);

interface ContributionGraphProps {
  data: ContributionGraphData;
  className?: string;
}

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

export function ContributionGraph({ data, className }: ContributionGraphProps) {
  const monthLabels = useMemo(() => getMonthLabels(data.weeks), [data.weeks]);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="flex flex-col justify-between py-[18px] shrink-0 text-[10px] font-bold text-navy/40 leading-none">
          {ROW_LABELS.map((label, row) => (
            <span
              key={label}
              className={cn("h-3 flex items-center", !VISIBLE_ROW_LABELS.has(row) && "opacity-0")}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-4 mb-1">
            {monthLabels.map(({ label, index }) => (
              <span
                key={`${label}-${index}`}
                className="absolute text-[10px] font-bold text-navy/40 capitalize"
                style={{ left: `${index * 14}px` }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {data.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => {
                  if (!day.date) {
                    return (
                      <div
                        key={`empty-${weekIndex}-${dayIndex}`}
                        className="h-3 w-3 rounded-[3px] opacity-0"
                        aria-hidden
                      />
                    );
                  }

                  const level = day.level as ContributionLevel;

                  return (
                    <div
                      key={day.date}
                      className={cn(
                        "h-3 w-3 rounded-[3px] transition-all cursor-default",
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

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-[10px] font-bold text-navy/50">
        <span>Menos</span>
        {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
          <div
            key={level}
            className={cn("h-3 w-3 rounded-[3px]", CONTRIBUTION_LEVEL_CLASS[level])}
          />
        ))}
        <span>Mais</span>
      </div>
    </div>
  );
}
