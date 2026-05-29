import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MASCOT } from "@/lib/mascot";
import { getTrackTheme } from "@/lib/track-theme";
import { cn } from "@/lib/utils";

interface ContinueLearningProps {
  lesson: {
    lessonId: string;
    title: string;
    trackTitle: string;
    trackSlug: string;
    unitTitle: string;
    type: string;
    colorPrimary: string;
    colorDark: string;
    colorLight: string;
    colorMuted: string;
    colorOnPrimary: string;
  } | null;
}

export function ContinueLearning({ lesson }: ContinueLearningProps) {
  if (!lesson) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold text-on-background mb-6 font-display">
          Continuar Aprendendo
        </h2>
        <div className="card-elevation rounded-4xl p-8 border-2 border-surface-container-highest text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image src={MASCOT.default} alt="Mascote" fill className="object-contain" />
          </div>
          <p className="text-on-surface-variant mb-4">
            Você ainda não iniciou nenhuma lição. Explore as trilhas para começar!
          </p>
          <Button asChild>
            <Link href="/trilhas">Ver Trilhas</Link>
          </Button>
        </div>
      </section>
    );
  }

  const lessonHref = `/licoes/${lesson.lessonId}`;
  const theme = getTrackTheme(lesson);

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-extrabold text-on-background mb-6 font-display">
        Continuar Aprendendo
      </h2>
      <div
        className={cn(
          "track-themed card-elevation rounded-4xl overflow-hidden flex flex-col md:flex-row border-2 border-surface-container-highest"
        )}
        style={theme.cssVars}
      >
        <div className="md:w-1/3 h-48 md:h-auto bg-secondary relative overflow-hidden flex items-center justify-center">
          <div className="track-continue-gradient absolute inset-0" />
          <div className="relative w-28 h-28 z-10">
            <Image src={MASCOT.thinking} alt="Mascote" fill className="object-contain" />
          </div>
        </div>
        <div className="md:w-2/3 p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="track-continue-tag px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide">
              {lesson.trackTitle}
            </span>
            {lesson.unitTitle && (
              <span className="text-outline text-[10px] font-medium">
                • {lesson.unitTitle}
              </span>
            )}
          </div>
          <h3 className="text-xl font-extrabold text-on-background mb-2 font-display">
            {lesson.title}
          </h3>
          <p className="text-on-surface-variant text-sm mb-6">
            {lesson.type === "QUIZ"
              ? "Complete o quiz para ganhar XP e avançar na trilha."
              : "Escreva código no editor e veja o resultado em tempo real."}
          </p>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href={lessonHref}>
                {lesson.type === "QUIZ" ? "Iniciar Quiz" : "Abrir Editor"}
              </Link>
            </Button>
            <Link
              href={`/trilhas/${lesson.trackSlug}`}
              className="track-link text-secondary font-bold text-sm transition-colors"
            >
              Ver Trilha
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
