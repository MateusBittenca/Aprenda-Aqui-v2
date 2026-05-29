"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "./reveal";

export function LandingHero() {
  const [xpWidth, setXpWidth] = useState("0%");

  useEffect(() => {
    const timer = setTimeout(() => setXpWidth("75%"), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mx-auto flex max-w-container-max flex-col items-center gap-16 px-gutter py-16 md:flex-row md:py-16">
      <Reveal className="flex-1 space-y-6 text-center md:text-left">
        <h1 className="font-display text-5xl font-black leading-tight text-primary md:text-[64px]">
          Aprenda a programar.
          <br />
          <span className="text-secondary">Um desafio por vez.</span>
        </h1>
        <p className="mx-auto max-w-lg text-lg font-medium text-on-surface-variant md:mx-0">
          Domine as tecnologias mais requisitadas do mercado com uma metodologia
          prática, divertida e totalmente gamificada.
        </p>

        <div className="mx-auto max-w-md space-y-1 md:mx-0">
          <div className="flex items-end justify-between text-sm font-bold">
            <span className="text-primary">Sua evolução diária</span>
            <span className="text-on-surface-variant">750 / 1000 XP</span>
          </div>
          <div className="h-6 w-full overflow-hidden rounded-full border-2 border-surface-variant bg-surface-container">
            <div
              className="relative h-full rounded-full bg-primary-container transition-[width] duration-[1500ms] ease-[cubic-bezier(0.65,0,0.35,1)] progress-glow"
              style={{ width: xpWidth }}
            >
              <div className="absolute inset-0 h-1/2 bg-white/20" />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Link
            href="/login"
            className="landing-pulse-cta landing-bouncy-button mx-auto flex w-fit items-center gap-3 rounded-2xl bg-primary-container px-16 py-6 text-xl font-bold text-on-primary-container md:mx-0"
          >
            Iniciar Jornada
            <ArrowRight className="h-6 w-6" aria-hidden />
          </Link>
        </div>
      </Reveal>

      <Reveal className="flex flex-1 justify-center">
        <div className="relative">
          <div className="absolute -z-10 h-full w-full scale-150 rounded-full bg-primary/5 blur-3xl" />
          <Image
            src="/mascot/robot.png"
            alt="Mascote Aprenda Aqui"
            width={450}
            height={450}
            className="landing-floating-mascot h-auto w-full max-w-[450px] object-contain"
            priority
          />
        </div>
      </Reveal>
    </section>
  );
}
