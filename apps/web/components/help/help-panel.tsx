"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Gem,
  HelpCircle,
  Map,
  MessageCircle,
  Search,
  Trophy,
  User,
} from "lucide-react";
import { MASCOT } from "@/lib/mascot";
import {
  HELP_CATEGORIES,
  HELP_FAQS,
  type HelpCategoryId,
} from "@/lib/help-content";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  conta: User,
  trilhas: Map,
  gamificacao: Trophy,
  recompensas: Gem,
} as const;

const CATEGORY_STYLES: Record<
  HelpCategoryId,
  { hover: string; icon: string }
> = {
  conta: {
    hover: "hover:bg-secondary-container/40",
    icon: "text-secondary",
  },
  trilhas: {
    hover: "hover:bg-primary-container/15",
    icon: "text-primary",
  },
  gamificacao: {
    hover: "hover:bg-tertiary-container/25",
    icon: "text-tertiary",
  },
  recompensas: {
    hover: "hover:bg-error-container/30",
    icon: "text-error",
  },
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function HelpPanel() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<HelpCategoryId | null>(
    null
  );
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    const q = normalize(query.trim());

    return HELP_FAQS.filter((faq) => {
      const matchesCategory =
        activeCategory === null || faq.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      const haystack = normalize(`${faq.question} ${faq.answer}`);
      return haystack.includes(q);
    });
  }, [query, activeCategory]);

  function toggleFaq(id: string) {
    setOpenFaqId((current) => (current === id ? null : id));
  }

  function selectCategory(id: HelpCategoryId) {
    setActiveCategory((current) => (current === id ? null : id));
    setOpenFaqId(null);
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <HelpCircle className="text-primary h-8 w-8" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-on-background font-display tracking-tight">
            Central de Ajuda
          </h1>
          <p className="text-on-surface-variant mt-1 font-medium">
            Encontre respostas sobre trilhas, XP, gemas e sua conta.
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-surface-container-lowest p-6 md:p-10 rounded-4xl border-2 border-surface-variant block-shadow-card mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full text-center md:text-left space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-primary font-display leading-tight">
              Como podemos ajudar?
            </h2>
            <p className="text-on-surface-variant font-medium">
              Pesquise por lições, ranking, gemas ou dúvidas sobre sua conta.
            </p>
            <div className="relative max-w-xl mx-auto md:mx-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar por uma dúvida..."
                className="w-full py-4 pl-12 pr-4 bg-surface-container rounded-xl border-2 border-surface-variant focus:border-secondary focus:ring-0 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="relative shrink-0">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <Image
                src={MASCOT.default}
                alt="Mascote Aprenda Aqui"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <span className="absolute -top-2 -right-2 bg-primary-container text-on-primary-container px-3 py-1.5 rounded-lg border-b-4 border-primary font-black text-sm block-shadow-primary">
              Oi! 👋
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-lg font-extrabold text-secondary uppercase tracking-wider mb-4">
          Categorias
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {HELP_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];
            const styles = CATEGORY_STYLES[category.id];
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.id)}
                className={cn(
                  "bg-surface-container p-5 rounded-3xl border-2 block-shadow-card flex flex-col items-center text-center gap-3 transition-all bouncy-transition",
                  styles.hover,
                  isActive
                    ? "border-primary-container ring-2 ring-primary-container/30"
                    : "border-surface-variant"
                )}
              >
                <div className="w-14 h-14 bg-white dark:bg-surface-container-lowest rounded-full grid place-items-center">
                  <Icon className={cn("h-7 w-7", styles.icon)} />
                </div>
                <div>
                  <p className="font-bold text-on-background text-sm leading-tight">
                    {category.title}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1 hidden sm:block">
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {activeCategory && (
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="mt-3 text-sm font-bold text-primary hover:underline"
          >
            Limpar filtro de categoria
          </button>
        )}
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-2xl font-black text-on-background font-display text-center mb-6">
          Perguntas frequentes
        </h2>

        {filteredFaqs.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 rounded-4xl border-2 border-surface-variant text-center">
            <p className="font-bold text-on-background">Nenhum resultado encontrado</p>
            <p className="text-sm text-on-surface-variant mt-2">
              Tente outro termo ou remova o filtro de categoria.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="bg-surface-container-lowest border-2 border-surface-variant rounded-3xl block-shadow-card overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-3xl"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-on-background text-base md:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-secondary shrink-0 transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-on-surface-variant leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-secondary-container/30 p-8 md:p-10 rounded-4xl border-2 border-secondary/20 text-center space-y-5">
        <h2 className="text-2xl font-black text-on-background font-display">
          Ainda com dúvidas?
        </h2>
        <p className="text-on-surface-variant font-medium max-w-xl mx-auto">
          Explore a comunidade para ver o que outros estudantes estão aprendendo ou
          ajuste suas preferências nas configurações.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href="mailto:suporte@aprendaqui.com.br"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-container text-on-primary-container font-black rounded-full border-b-4 border-primary block-shadow-primary bouncy-transition hover:brightness-110"
          >
            <MessageCircle className="h-5 w-5" />
            Falar com o suporte
          </a>
          <Link
            href="/comunidade"
            className="text-secondary font-bold underline underline-offset-4 hover:text-primary transition-colors"
          >
            Explorar a comunidade
          </Link>
        </div>
      </section>
    </div>
  );
}
