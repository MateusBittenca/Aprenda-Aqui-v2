import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Box,
  Braces,
  Cpu,
  Database,
  FileCode,
  Gamepad2,
  Globe,
  Image,
  Layers,
  Layout,
  Lock,
  Monitor,
  Music,
  Palette,
  Puzzle,
  Rocket,
  Server,
  Smartphone,
  Star,
  Terminal,
  Wrench,
  Zap,
} from "lucide-react";

export interface TrackIconOption {
  key: string;
  label: string;
  Icon: LucideIcon;
}

/** Ícones disponíveis para trilhas — key salva no banco, Icon usado na UI */
export const TRACK_ICON_OPTIONS: TrackIconOption[] = [
  { key: "code", label: "Código", Icon: FileCode },
  { key: "palette", label: "Paleta", Icon: Palette },
  { key: "braces", label: "Chaves", Icon: Braces },
  { key: "terminal", label: "Terminal", Icon: Terminal },
  { key: "layers", label: "Camadas", Icon: Layers },
  { key: "database", label: "Banco", Icon: Database },
  { key: "globe", label: "Web", Icon: Globe },
  { key: "rocket", label: "Foguete", Icon: Rocket },
  { key: "book", label: "Livro", Icon: BookOpen },
  { key: "cpu", label: "Processador", Icon: Cpu },
  { key: "zap", label: "Raio", Icon: Zap },
  { key: "star", label: "Estrela", Icon: Star },
  { key: "puzzle", label: "Quebra-cabeça", Icon: Puzzle },
  { key: "layout", label: "Layout", Icon: Layout },
  { key: "box", label: "Caixa", Icon: Box },
  { key: "server", label: "Servidor", Icon: Server },
  { key: "smartphone", label: "Mobile", Icon: Smartphone },
  { key: "monitor", label: "Desktop", Icon: Monitor },
  { key: "wrench", label: "Ferramentas", Icon: Wrench },
  { key: "gamepad", label: "Jogos", Icon: Gamepad2 },
  { key: "music", label: "Música", Icon: Music },
  { key: "image", label: "Imagem", Icon: Image },
  { key: "lock", label: "Segurança", Icon: Lock },
];

export const TRACK_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  TRACK_ICON_OPTIONS.map(({ key, Icon }) => [key, Icon])
);

export interface TrackColorPreset {
  name: string;
  colorPrimary: string;
  colorDark: string;
  colorLight: string;
  colorMuted: string;
  colorOnPrimary: string;
}

export const TRACK_COLOR_PRESETS: TrackColorPreset[] = [
  {
    name: "Verde",
    colorPrimary: "#58CC02",
    colorDark: "#1f5100",
    colorLight: "#87fe45",
    colorMuted: "#2b6c00",
    colorOnPrimary: "#ffffff",
  },
  {
    name: "Laranja",
    colorPrimary: "#fb923c",
    colorDark: "#c2410c",
    colorLight: "#fdba74",
    colorMuted: "#ea580c",
    colorOnPrimary: "#ffffff",
  },
  {
    name: "Azul",
    colorPrimary: "#3b82f6",
    colorDark: "#1d4ed8",
    colorLight: "#93c5fd",
    colorMuted: "#2563eb",
    colorOnPrimary: "#ffffff",
  },
  {
    name: "Amarelo",
    colorPrimary: "#eab308",
    colorDark: "#a16207",
    colorLight: "#fde047",
    colorMuted: "#ca8a04",
    colorOnPrimary: "#422006",
  },
  {
    name: "Roxo",
    colorPrimary: "#a855f7",
    colorDark: "#581c87",
    colorLight: "#d8b4fe",
    colorMuted: "#7e22ce",
    colorOnPrimary: "#ffffff",
  },
  {
    name: "Rosa",
    colorPrimary: "#ec4899",
    colorDark: "#9d174d",
    colorLight: "#f9a8d4",
    colorMuted: "#db2777",
    colorOnPrimary: "#ffffff",
  },
  {
    name: "Vermelho",
    colorPrimary: "#ef4444",
    colorDark: "#991b1b",
    colorLight: "#fca5a5",
    colorMuted: "#dc2626",
    colorOnPrimary: "#ffffff",
  },
  {
    name: "Teal",
    colorPrimary: "#14b8a6",
    colorDark: "#0f766e",
    colorLight: "#5eead4",
    colorMuted: "#0d9488",
    colorOnPrimary: "#ffffff",
  },
  {
    name: "Ciano",
    colorPrimary: "#06b6d4",
    colorDark: "#0e7490",
    colorLight: "#67e8f9",
    colorMuted: "#0891b2",
    colorOnPrimary: "#ffffff",
  },
  {
    name: "Índigo",
    colorPrimary: "#6366f1",
    colorDark: "#3730a3",
    colorLight: "#a5b4fc",
    colorMuted: "#4f46e5",
    colorOnPrimary: "#ffffff",
  },
  {
    name: "Esmeralda",
    colorPrimary: "#10b981",
    colorDark: "#047857",
    colorLight: "#6ee7b7",
    colorMuted: "#059669",
    colorOnPrimary: "#ffffff",
  },
  {
    name: "Grafite",
    colorPrimary: "#64748b",
    colorDark: "#1e293b",
    colorLight: "#94a3b8",
    colorMuted: "#475569",
    colorOnPrimary: "#ffffff",
  },
];

export const DEFAULT_TRACK_COLORS: Omit<TrackColorPreset, "name"> = {
  colorPrimary: TRACK_COLOR_PRESETS[0].colorPrimary,
  colorDark: TRACK_COLOR_PRESETS[0].colorDark,
  colorLight: TRACK_COLOR_PRESETS[0].colorLight,
  colorMuted: TRACK_COLOR_PRESETS[0].colorMuted,
  colorOnPrimary: TRACK_COLOR_PRESETS[0].colorOnPrimary,
};

export function colorsMatchPreset(
  colors: Omit<TrackColorPreset, "name">,
  preset: TrackColorPreset
): boolean {
  return (
    colors.colorPrimary.toLowerCase() === preset.colorPrimary.toLowerCase() &&
    colors.colorDark.toLowerCase() === preset.colorDark.toLowerCase()
  );
}
