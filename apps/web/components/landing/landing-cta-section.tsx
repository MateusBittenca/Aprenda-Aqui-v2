import Link from "next/link";
import { Reveal } from "./reveal";

export function LandingCtaSection() {
  return (
    <section className="mx-auto my-16 max-w-container-max px-gutter">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl bg-primary-container p-16 text-center text-on-primary-container">
          <div className="absolute top-0 left-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
          <div className="absolute right-0 bottom-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-white/10" />

          <h2 className="mb-3 font-display text-3xl font-black text-white drop-shadow-md md:text-5xl">
            Sua jornada começa hoje.
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg opacity-90">
            Junte-se a milhares de estudantes e transforme seu futuro através da
            programação de um jeito que você nunca viu.
          </p>

          <div className="flex flex-col items-center gap-6">
            <Link
              href="/login"
              className="landing-bouncy-button rounded-2xl bg-white px-16 py-6 text-2xl font-extrabold text-primary transition-all hover:scale-105"
            >
              Criar conta grátis
            </Link>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-6 py-1 text-sm font-bold">
              <span
                className="inline-block h-3 w-3 animate-pulse rounded-full bg-green-400"
                aria-hidden
              />
              🟢 1.243 pessoas estudando agora
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
