import { Reveal } from "./reveal";

const steps = [
  {
    number: 1,
    title: "Escolha uma trilha",
    description: "Selecione a linguagem que quer dominar hoje.",
  },
  {
    number: 2,
    title: "Complete lições",
    description: "Desafios curtos e interativos de 5 minutos.",
  },
  {
    number: 3,
    title: "Ganhe XP",
    description: "Acumule pontos e desbloqueie novos emblemas.",
  },
  {
    number: 4,
    title: "Suba no ranking",
    description: "Chegue ao topo da liga Diamante.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="mx-auto max-w-container-max px-gutter py-16">
      <Reveal className="mb-16 text-center">
        <h2 className="font-display text-4xl font-extrabold text-on-surface">
          Sua jornada simplificada
        </h2>
      </Reveal>

      <div className="relative">
        <div className="absolute top-10 left-0 z-0 hidden h-1 w-full md:block">
          <svg className="overflow-visible" height="8" width="100%">
            <line
              className="landing-dashed-line"
              stroke="rgb(var(--color-outline-variant))"
              strokeDasharray="12 8"
              strokeWidth="4"
              x1="10%"
              x2="90%"
              y1="4"
              y2="4"
            />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-4">
          {steps.map((step) => (
            <Reveal key={step.number} className="space-y-3 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-primary-container text-4xl font-black text-white shadow-lg">
                {step.number}
              </div>
              <h4 className="text-xl font-bold">{step.title}</h4>
              <p className="text-on-surface-variant">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
