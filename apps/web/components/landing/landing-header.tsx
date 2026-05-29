import Image from "next/image";
import Link from "next/link";
import { Rocket } from "lucide-react";

const navLinks = [
  { href: "/trilhas", label: "Trilhas" },
  { href: "/ranking", label: "Ranking" },
  { href: "#comunidade", label: "Comunidade" },
];

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-surface-variant bg-surface shadow-sm dark:border-outline-variant dark:bg-background">
      <nav className="mx-auto flex max-w-container-max items-center justify-between px-gutter py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-3xl font-extrabold text-primary dark:text-primary-fixed"
        >
          <Image
            src="/logo.png"
            alt="Logo Aprenda Aqui"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span>Aprenda Aqui!</span>
        </Link>

        <div className="hidden items-center gap-16 text-sm font-bold tracking-wide md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-on-surface-variant transition-colors hover:text-primary dark:hover:text-primary-fixed"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden text-sm font-bold text-primary transition-opacity hover:opacity-90 dark:text-primary-fixed md:block"
          >
            Entrar
          </Link>
          <Link
            href="/login"
            className="landing-bouncy-button flex items-center gap-2 rounded-full bg-primary-container px-6 py-1 text-sm font-bold text-on-primary-container transition-all hover:opacity-90"
          >
            <Rocket className="h-4 w-4" aria-hidden />
            Começar Grátis
          </Link>
        </div>
      </nav>
    </header>
  );
}
