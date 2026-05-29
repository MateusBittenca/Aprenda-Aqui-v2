import type { CSSProperties } from "react";

export interface TrackColorSource {
  slug: string;
  colorPrimary: string;
  colorDark: string;
  colorLight: string;
  colorMuted: string;
  colorOnPrimary: string;
}

export const trackColorSelect = {
  slug: true,
  colorPrimary: true,
  colorDark: true,
  colorLight: true,
  colorMuted: true,
  colorOnPrimary: true,
} as const;

const DEFAULT_COLORS: TrackColorSource = {
  slug: "default",
  colorPrimary: "#58CC02",
  colorDark: "#1f5100",
  colorLight: "#87fe45",
  colorMuted: "#2b6c00",
  colorOnPrimary: "#ffffff",
};

function hexToRgbChannels(hex: string): string {
  const normalized = hex.replace("#", "").trim();
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  if ([r, g, b].some((n) => Number.isNaN(n))) {
    return "88 204 2";
  }

  return `${r} ${g} ${b}`;
}

export function buildTrackCssVars(colors: TrackColorSource): CSSProperties {
  return {
    "--track-primary": hexToRgbChannels(colors.colorPrimary),
    "--track-dark": hexToRgbChannels(colors.colorDark),
    "--track-light": hexToRgbChannels(colors.colorLight),
    "--track-muted": hexToRgbChannels(colors.colorMuted),
    "--track-on-primary": hexToRgbChannels(colors.colorOnPrimary),
  } as CSSProperties;
}

export interface TrackTheme {
  slug: string;
  cssVars: CSSProperties;
  pathStroke: string;
  className: "track-themed";
}

export function getTrackTheme(track?: Partial<TrackColorSource> | null): TrackTheme {
  const colors: TrackColorSource = {
    ...DEFAULT_COLORS,
    ...track,
    slug: track?.slug ?? DEFAULT_COLORS.slug,
  };

  return {
    slug: colors.slug,
    cssVars: buildTrackCssVars(colors),
    pathStroke: colors.colorPrimary,
    className: "track-themed",
  };
}
