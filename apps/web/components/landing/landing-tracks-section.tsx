import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const tracks = [
  {
    name: "HTML5",
    slug: "html",
    lessons: 12,
    progress: 85,
    stars: 1,
  },
  {
    name: "CSS3",
    slug: "css",
    lessons: 18,
    progress: 40,
    stars: 2,
  },
  {
    name: "JavaScript",
    slug: "javascript",
    lessons: 25,
    progress: 10,
    stars: 3,
  },
  {
    name: "Python",
    slug: "python",
    lessons: 20,
    progress: 0,
    stars: 2,
    href: "/login",
  },
] as const;

function StarRating({ filled }: { filled: number }) {
  return (
    <div className="mb-3 flex justify-center gap-0.5 text-tertiary">
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          className={cn("h-5 w-5", i < filled && "fill-current")}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function LandingTracksSection() {
  return (
    <section className="mx-auto max-w-container-max px-gutter py-16">
      <Reveal className="mb-16 text-center">
        <h2 className="mb-1 font-display text-4xl font-extrabold text-on-surface">
          Escolha sua Trilha
        </h2>
        <p className="text-lg font-medium text-on-surface-variant">
          Caminhos estruturados para você sair do zero ao primeiro emprego.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tracks.map((track) => (
          <Reveal key={track.slug}>
            <article className="landing-track-card rounded-2xl bg-surface p-6">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-lowest p-4 shadow-sm">
                <Image
                  src="/logo.png"
                  alt=""
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mb-3 text-center text-2xl font-extrabold">
                {track.name}
              </h3>
              <StarRating filled={track.stars} />
              <div className="mb-1 flex justify-between text-sm font-bold">
                <span className="text-on-surface-variant">
                  {track.lessons} Lições
                </span>
                <span className="text-primary">{track.progress}%</span>
              </div>
              <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full bg-primary-container"
                  style={{ width: `${track.progress}%` }}
                />
              </div>
              <Link
                href={"href" in track ? track.href : `/trilhas/${track.slug}`}
                className="block w-full rounded-full border-2 border-surface-variant bg-surface-container py-3 text-center text-sm font-bold transition-all hover:border-primary-container hover:bg-primary-container hover:text-on-primary"
              >
                Começar
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
