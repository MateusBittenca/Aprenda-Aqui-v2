import Image from "next/image";
import { Reveal } from "./reveal";

const testimonials = [
  {
    name: "Lucas Silva",
    track: "Trilha de Python",
    quote:
      "Aprender Python parecia impossível, mas a forma como os desafios são apresentados aqui me manteve engajado todos os dias.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKIy5hEsTsi61zRyPpopYcIpN_kyGqJc82XuqgbIOFWD5W5qjdlN38nNAEDSf1E2yC1I7mwsL_0ea5lM2gZD4zxaoCzZY-PTN5hLn5RM1HPOOn4J-nd6g8b-OkJYGuTYw_TKk5oS8tF3NCroc8PBetOacweM32nJJovKvWdsfyu150mb5ESZzAnyKFPqcc-dVNyiRs_CpTvGdJlJfjKRscRO6FQB-HHGnQ5Y0EwzRpSAej4nyQIbnFYc3r_b5r6eugABnlbwAstg0",
  },
  {
    name: "Ana Costa",
    track: "Trilha de JS",
    quote:
      "As lições curtas encaixam perfeitamente na minha rotina corrida. Consegui meu primeiro estágio graças à base que construí aqui!",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxfquRKVECb9lCYvULORTKvDM0aK-AOkwjq6tH8H65aKldELmLb8vfJKNh0rIOsNOyXHb_H17DM0_O7paWnUud9ZB_XZrgzUNimDd1rNwG0g6lEwAXgpu-MVFGHGmzLzi5iOeUJ8AwqaTzqSkpCV3EKeyq7GQms8CRuIgwsjC_Rz2jORqa3Wp5M33fBuXpSMHtKLG6KaVwcK8mlk7LpT_pWr8xjAx2p8KWihdcpHKUKSHRmCCIEsA09XUvjq1CeqTKDdiiME3170w",
  },
  {
    name: "Márcio Lima",
    track: "Trilha de HTML/CSS",
    quote:
      "O sistema de ranking me motiva a nunca parar. Ver meu progresso visualmente é o que me faz voltar todos os dias.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC_FFyoJOrk5jef2qZWHVaWqPQkuSQxEQBMEX9X6GNyyaiN-l8b5b3omeYjmH2bJNMKN8T47jjd1QDQwSr7i_lUqsvqhDZdJHnRyTOY1WKu-wIuIRzj17vPcOzwQg8Ypu-UxZSFaucQlk29a4-CTMSlSiTp67-6zyopOgodUYUV38Gbf1PIGQTFqy0ZGvRcrqn4e6Z44hm-SpvoUoKlfPhmWFUC_d5eG6I2O-hLIoZnZ0RupGfXlKTTM8CfHQCB7WdYEtmUm3-Yz-o",
  },
];

export function LandingTestimonials() {
  return (
    <section className="bg-[#F0FFF0] py-16 dark:bg-surface-container-low">
      <div className="mx-auto max-w-container-max px-gutter">
        <Reveal className="mb-16 text-center">
          <h2 className="font-display text-4xl font-extrabold text-on-surface">
            Histórias de Sucesso
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Reveal key={item.name}>
              <article className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-10 shadow-sm dark:bg-surface">
                <div className="mb-6 flex items-center gap-6">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full bg-surface-container object-cover"
                  />
                  <div>
                    <div className="text-xl font-bold">{item.name}</div>
                    <div className="text-sm font-bold text-primary">
                      {item.track}
                    </div>
                  </div>
                </div>
                <p className="italic text-on-surface-variant">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
