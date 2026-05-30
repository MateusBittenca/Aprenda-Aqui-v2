import { cn, formatNumber } from "@/lib/utils";

interface ProfileWeeklyProgressProps {
  days: { label: string; xp: number }[];
}

const DAY_NAMES: Record<string, string> = {
  DOM: "Dom",
  SEG: "Seg",
  TER: "Ter",
  QUA: "Qua",
  QUI: "Qui",
  SEX: "Sex",
  SAB: "Sáb",
};

const CHART_HEIGHT_PX = 140;
const EMPTY_BAR_PX = 8;

export function ProfileWeeklyProgress({ days }: ProfileWeeklyProgressProps) {
  const maxXp = Math.max(...days.map((d) => d.xp), 0);
  const hasAnyXp = maxXp > 0;

  const bestDay = days.reduce(
    (best, day) => (day.xp > best.xp ? day : best),
    days[0] ?? { label: "—", xp: 0 }
  );

  function getBarHeight(xp: number): number {
    if (xp <= 0) return EMPTY_BAR_PX;
    if (!hasAnyXp) return EMPTY_BAR_PX;
    return Math.max(Math.round((xp / maxXp) * CHART_HEIGHT_PX), 20);
  }

  return (
    <section className="bg-white dark:bg-surface-container-low rounded-4xl border-2 border-surface-variant block-shadow-card p-6 flex flex-col min-h-[280px]">
      <h3 className="text-xl font-extrabold text-on-background font-display mb-4">
        Progresso semanal
      </h3>

      {!hasAnyXp ? (
        <div className="flex-1 flex items-center justify-center px-4 text-center">
          <p className="text-sm text-on-surface-variant font-medium">
            Nenhum XP registrado nos últimos 7 dias. Complete uma lição para começar!
          </p>
        </div>
      ) : (
        <div
          className="flex items-end justify-between gap-1 sm:gap-2 px-0.5"
          style={{ height: CHART_HEIGHT_PX }}
          role="img"
          aria-label="Gráfico de XP dos últimos 7 dias"
        >
          {days.map((day) => {
            const barHeight = getBarHeight(day.xp);
            const hasXp = day.xp > 0;

            return (
              <div
                key={day.label}
                className="flex flex-col items-center justify-end flex-1 h-full gap-2 min-w-0"
              >
                <span className="text-[10px] font-bold text-on-surface-variant tabular-nums leading-none">
                  {hasXp ? formatNumber(day.xp) : ""}
                </span>
                <div
                  className={cn(
                    "w-full max-w-9 rounded-t-xl transition-all duration-500",
                    hasXp
                      ? "bg-primary-container border-b-4 border-primary"
                      : "bg-surface-container-high rounded-lg"
                  )}
                  style={{ height: barHeight }}
                  title={hasXp ? `${formatNumber(day.xp)} XP` : "Sem XP"}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between gap-1 mt-3 px-0.5">
        {days.map((day) => (
          <span
            key={`${day.label}-lbl`}
            className="flex-1 text-center text-[10px] font-bold text-secondary uppercase min-w-0 truncate"
          >
            {DAY_NAMES[day.label] ?? day.label}
          </span>
        ))}
      </div>

      <div className="mt-5 pt-5 border-t-2 border-surface-variant">
        <div className="flex justify-between items-center gap-2">
          <p className="font-bold text-on-background text-sm">Melhor dia</p>
          <p className="text-primary font-black text-sm text-right">
            {bestDay.xp > 0
              ? `${DAY_NAMES[bestDay.label] ?? bestDay.label} · ${formatNumber(bestDay.xp)} XP`
              : "—"}
          </p>
        </div>
      </div>
    </section>
  );
}
