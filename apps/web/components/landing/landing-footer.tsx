import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Termos de Uso" },
  { href: "#", label: "Privacidade" },
  { href: "#", label: "Ajuda" },
  { href: "#", label: "Contato" },
];

export function LandingFooter() {
  return (
    <footer
      id="comunidade"
      className="mt-16 w-full border-t-2 border-outline-variant bg-surface-container-highest dark:bg-surface-container-high"
    >
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-6 px-gutter py-10 md:flex-row md:gap-0">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <div className="text-2xl font-black text-primary dark:text-primary-fixed">
            Aprenda Aqui!
          </div>
          <p className="text-on-surface-variant dark:text-on-surface-variant">
            © 2024 Aprenda Aqui! - Transformando código em aventura.
          </p>
        </div>
        <div className="flex gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-on-surface-variant transition-colors hover:text-primary dark:hover:text-primary-fixed"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
