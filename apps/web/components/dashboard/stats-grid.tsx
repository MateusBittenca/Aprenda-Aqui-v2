import { Star, CheckCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { ContributionGraphData } from "@/lib/contribution-graph";
import { ContributionGraph } from "./contribution-graph";

interface StatsGridProps {
  contributionGraph: ContributionGraphData;
  xpTotal: number;
  lessonsCompleted: number;
}

export function StatsGrid({
  contributionGraph,
  xpTotal,
  lessonsCompleted,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 sm:mb-8">
      <div className="md:col-span-8 card-elevation rounded-3xl p-4 sm:p-6 border border-navy/5">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-start gap-2 sm:gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-navy mb-1">
              Momentum de Aprendizado
            </h2>
            <p className="text-navy/60 text-sm leading-snug">
              {contributionGraph.activeDays}{" "}
              {contributionGraph.activeDays === 1 ? "dia ativo" : "dias ativos"} no último ano
              {contributionGraph.totalXpInPeriod > 0 && (
                <>
                  {" "}
                  · {formatNumber(contributionGraph.totalXpInPeriod)} XP
                </>
              )}
            </p>
          </div>
          <span className="self-start px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full shrink-0">
            Últimos 52 semanas
          </span>
        </div>

        <ContributionGraph data={contributionGraph} />
      </div>

      <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
        <div className="card-elevation rounded-3xl p-4 sm:p-6 border border-navy/5 flex items-center gap-3 sm:gap-4 md:hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
            <Star className="h-6 w-6 sm:h-7 sm:w-7 text-primary fill-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-navy/60 text-xs font-bold uppercase tracking-wider">
              XP Total
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-navy">{formatNumber(xpTotal)}</h3>
          </div>
        </div>

        <div className="card-elevation rounded-3xl p-4 sm:p-6 border border-navy/5 flex items-center gap-3 sm:gap-4 md:hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 dark:bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-navy/60 text-xs font-bold uppercase tracking-wider">
              Lições Concluídas
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-navy">{lessonsCompleted}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
