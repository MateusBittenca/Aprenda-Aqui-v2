export type StoreItemCategory = "powerup" | "theme";

export type StoreItemEffect = "streak_freeze" | "xp_boost" | "editor_theme";

export interface StoreItem {
  key: string;
  name: string;
  description: string;
  category: StoreItemCategory;
  effect: StoreItemEffect;
  priceGems: number;
  featured?: boolean;
  /** Power-ups consumíveis: quantidade adicionada por compra. */
  quantity?: number;
  /** Bônus de XP: duração do efeito em milissegundos. */
  boostDurationMs?: number;
  /** Multiplicador de XP aplicado enquanto o bônus está ativo. */
  xpMultiplier?: number;
}

export const XP_BOOST_MULTIPLIER = 2;
export const XP_BOOST_DURATION_MS = 2 * 60 * 60 * 1000;

/** Chave do tema padrão do editor, grátis e sempre disponível. */
export const DEFAULT_EDITOR_THEME_KEY = "aprenda-aqui";

export const STORE_ITEMS: StoreItem[] = [
  {
    key: "streak_freeze",
    name: "Protetor de Ofensiva",
    description:
      "Mantém sua ofensiva mesmo se você esquecer de praticar por um dia. É usado automaticamente quando necessário.",
    category: "powerup",
    effect: "streak_freeze",
    priceGems: 200,
    featured: true,
    quantity: 1,
  },
  {
    key: "xp_boost_2h",
    name: "Bônus de XP (2h)",
    description:
      "Ganhe o dobro de XP em todas as lições durante duas horas seguidas a partir da compra.",
    category: "powerup",
    effect: "xp_boost",
    priceGems: 100,
    featured: true,
    boostDurationMs: XP_BOOST_DURATION_MS,
    xpMultiplier: XP_BOOST_MULTIPLIER,
  },
  {
    key: "theme-synthwave",
    name: "Tema Dark Synthwave",
    description:
      "Transforme o editor de código com luzes neon e uma paleta retrô futurista.",
    category: "theme",
    effect: "editor_theme",
    priceGems: 150,
    featured: true,
  },
  {
    key: "theme-dracula",
    name: "Tema Drácula",
    description: "O clássico tema escuro de tons roxos, favorito dos desenvolvedores.",
    category: "theme",
    effect: "editor_theme",
    priceGems: 120,
  },
  {
    key: "theme-ocean",
    name: "Tema Oceano",
    description: "Tons profundos de azul para programar com a mente tranquila.",
    category: "theme",
    effect: "editor_theme",
    priceGems: 120,
  },
  {
    key: "theme-solar",
    name: "Tema Solar",
    description: "Um tema claro e quente, perfeito para ambientes bem iluminados.",
    category: "theme",
    effect: "editor_theme",
    priceGems: 100,
  },
];

export function getStoreItem(key: string): StoreItem | undefined {
  return STORE_ITEMS.find((item) => item.key === key);
}

export function getStoreItemsByCategory(category: StoreItemCategory): StoreItem[] {
  return STORE_ITEMS.filter((item) => item.category === category);
}

export function getFeaturedStoreItems(): StoreItem[] {
  return STORE_ITEMS.filter((item) => item.featured);
}

/** Todas as chaves de tema vendidas na loja (sem o tema padrão grátis). */
export function getThemeItemKeys(): string[] {
  return STORE_ITEMS.filter((item) => item.effect === "editor_theme").map((item) => item.key);
}
