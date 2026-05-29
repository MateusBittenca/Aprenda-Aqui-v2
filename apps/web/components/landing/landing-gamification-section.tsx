"use client";

import { useState } from "react";
import { Reveal } from "./reveal";
import { useCountUp } from "./use-count-up";

const features = [
  {
    emoji: "🔥",
    title: "Ofensiva Imbatível",
    description:
      "Crie o hábito de estudar todos os dias e ganhe multiplicadores de recompensa.",
    colorClass: "text-primary",
    counterKey: "streak" as const,
  },
  {
    emoji: "⚡",
    title: "XP & Níveis",
    description:
      "Cada linha de código escrita te leva mais perto do próximo nível de maestria.",
    colorClass: "text-secondary",
    counterKey: "xp" as const,
  },
  {
    emoji: "🏆",
    title: "Ranking Global",
    description:
      "Suba nas ligas e mostre seu talento para toda a nossa comunidade.",
    colorClass: "text-tertiary",
    counterKey: "rank" as const,
  },
];

export function LandingGamificationSection() {
  const [animateCounters, setAnimateCounters] = useState(false);

  const streak = useCountUp(15, { enabled: animateCounters });
  const xp = useCountUp(12450, { enabled: animateCounters });
  const rank = useCountUp(12, {
    start: 100,
    enabled: animateCounters,
    prefix: "#",
  });

  const counters = { streak, xp, rank };

  return (
    <section className="overflow-hidden bg-surface-container-low py-16">
      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-16 px-gutter md:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal
            key={feature.title}
            className="space-y-3 text-center"
            onVisible={
              index === 0 ? () => setAnimateCounters(true) : undefined
            }
          >
            <div className="mb-6 text-[64px] drop-shadow-lg">{feature.emoji}</div>
            <h3 className="text-2xl font-extrabold">{feature.title}</h3>
            <p className="px-6 text-on-surface-variant">{feature.description}</p>
            <div
              className={`font-display text-[32px] font-black ${feature.colorClass}`}
            >
              {counters[feature.counterKey]}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
