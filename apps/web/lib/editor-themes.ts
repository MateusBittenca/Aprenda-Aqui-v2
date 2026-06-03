import type { editor } from "monaco-editor";

export const DEFAULT_EDITOR_THEME_KEY = "aprenda-aqui";

/** Monaco só aceita letras, números e hífens em defineTheme/setTheme. */
export function normalizeEditorThemeKey(key: string): string {
  return key.trim().replace(/_/g, "-");
}

/** Variantes de chave gravadas no inventário (compras antigas usavam underscore). */
export function getThemeInventoryLookupKeys(key: string): string[] {
  const normalized = normalizeEditorThemeKey(key);
  const legacyUnderscore = normalized.replace(/-/g, "_");
  const trimmed = key.trim();
  return [...new Set([trimmed, normalized, legacyUnderscore].filter(Boolean))];
}

export function getMonacoThemeName(key: string): string {
  return normalizeEditorThemeKey(getEditorThemeData(key).key);
}

export interface EditorThemeDefinition {
  /** Chave persistida (catálogo/DB) e nome registrado no Monaco. */
  key: string;
  /** Nome exibido na loja / configurações. */
  name: string;
  /** Cores de destaque para o preview do card na loja. */
  preview: {
    background: string;
    accents: string[];
  };
  data: editor.IStandaloneThemeData;
}

export const EDITOR_THEMES: Record<string, EditorThemeDefinition> = {
  "aprenda-aqui": {
    key: "aprenda-aqui",
    name: "Aprenda Aqui",
    preview: {
      background: "#575a89",
      accents: ["#ffdf92", "#87fe45", "#c0c2f7"],
    },
    data: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "tag", foreground: "ffdf92" },
        { token: "attribute.name", foreground: "c0c2f7" },
        { token: "attribute.value", foreground: "87fe45" },
        { token: "string", foreground: "87fe45" },
        { token: "keyword", foreground: "c0c2f7" },
        { token: "comment", foreground: "9ca3af", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#575a89",
        "editor.foreground": "#ffffff",
        "editor.lineHighlightBackground": "#4a4d7a",
        "editor.selectionBackground": "#58cc0244",
        "editor.inactiveSelectionBackground": "#58cc0222",
        "editorCursor.foreground": "#6be026",
        "editorLineNumber.foreground": "#ffffff55",
        "editorLineNumber.activeForeground": "#ffffff",
        "editorSuggestWidget.background": "#1c1f4a",
        "editorSuggestWidget.border": "#58cc02",
        "editorSuggestWidget.selectedBackground": "#58cc0233",
        "editorWidget.background": "#1c1f4a",
        "editorWidget.border": "#c6c8fd",
      },
    },
  },
  "theme-synthwave": {
    key: "theme-synthwave",
    name: "Dark Synthwave",
    preview: {
      background: "#1c1f4a",
      accents: ["#ff7edb", "#72f1b8", "#fede5d"],
    },
    data: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "tag", foreground: "ff7edb" },
        { token: "attribute.name", foreground: "fede5d" },
        { token: "attribute.value", foreground: "72f1b8" },
        { token: "string", foreground: "72f1b8" },
        { token: "keyword", foreground: "ff7edb", fontStyle: "bold" },
        { token: "comment", foreground: "8082c4", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#1c1f4a",
        "editor.foreground": "#f8f8f2",
        "editor.lineHighlightBackground": "#2a2e5e",
        "editor.selectionBackground": "#ff7edb44",
        "editor.inactiveSelectionBackground": "#ff7edb22",
        "editorCursor.foreground": "#fede5d",
        "editorLineNumber.foreground": "#ffffff44",
        "editorLineNumber.activeForeground": "#ff7edb",
        "editorSuggestWidget.background": "#241b54",
        "editorSuggestWidget.border": "#ff7edb",
        "editorSuggestWidget.selectedBackground": "#ff7edb33",
        "editorWidget.background": "#241b54",
        "editorWidget.border": "#ff7edb",
      },
    },
  },
  "theme-dracula": {
    key: "theme-dracula",
    name: "Drácula",
    preview: {
      background: "#282a36",
      accents: ["#bd93f9", "#50fa7b", "#ff79c6"],
    },
    data: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "tag", foreground: "ff79c6" },
        { token: "attribute.name", foreground: "50fa7b" },
        { token: "attribute.value", foreground: "f1fa8c" },
        { token: "string", foreground: "f1fa8c" },
        { token: "keyword", foreground: "ff79c6", fontStyle: "bold" },
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#282a36",
        "editor.foreground": "#f8f8f2",
        "editor.lineHighlightBackground": "#343746",
        "editor.selectionBackground": "#bd93f944",
        "editor.inactiveSelectionBackground": "#bd93f922",
        "editorCursor.foreground": "#f8f8f0",
        "editorLineNumber.foreground": "#6272a4",
        "editorLineNumber.activeForeground": "#f8f8f2",
        "editorSuggestWidget.background": "#21222c",
        "editorSuggestWidget.border": "#bd93f9",
        "editorSuggestWidget.selectedBackground": "#bd93f933",
        "editorWidget.background": "#21222c",
        "editorWidget.border": "#bd93f9",
      },
    },
  },
  "theme-ocean": {
    key: "theme-ocean",
    name: "Oceano",
    preview: {
      background: "#0f2b46",
      accents: ["#7fdbff", "#39cccc", "#ffd166"],
    },
    data: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "tag", foreground: "7fdbff" },
        { token: "attribute.name", foreground: "39cccc" },
        { token: "attribute.value", foreground: "ffd166" },
        { token: "string", foreground: "ffd166" },
        { token: "keyword", foreground: "7fdbff", fontStyle: "bold" },
        { token: "comment", foreground: "5a7a99", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#0f2b46",
        "editor.foreground": "#e6f1ff",
        "editor.lineHighlightBackground": "#163a5c",
        "editor.selectionBackground": "#7fdbff44",
        "editor.inactiveSelectionBackground": "#7fdbff22",
        "editorCursor.foreground": "#39cccc",
        "editorLineNumber.foreground": "#ffffff44",
        "editorLineNumber.activeForeground": "#7fdbff",
        "editorSuggestWidget.background": "#0b2238",
        "editorSuggestWidget.border": "#39cccc",
        "editorSuggestWidget.selectedBackground": "#7fdbff33",
        "editorWidget.background": "#0b2238",
        "editorWidget.border": "#39cccc",
      },
    },
  },
  "theme-solar": {
    key: "theme-solar",
    name: "Solar",
    preview: {
      background: "#fdf6e3",
      accents: ["#b58900", "#268bd2", "#859900"],
    },
    data: {
      base: "vs",
      inherit: true,
      rules: [
        { token: "tag", foreground: "268bd2" },
        { token: "attribute.name", foreground: "b58900" },
        { token: "attribute.value", foreground: "859900" },
        { token: "string", foreground: "859900" },
        { token: "keyword", foreground: "cb4b16", fontStyle: "bold" },
        { token: "comment", foreground: "93a1a1", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#fdf6e3",
        "editor.foreground": "#586e75",
        "editor.lineHighlightBackground": "#eee8d5",
        "editor.selectionBackground": "#268bd233",
        "editor.inactiveSelectionBackground": "#268bd218",
        "editorCursor.foreground": "#b58900",
        "editorLineNumber.foreground": "#93a1a1",
        "editorLineNumber.activeForeground": "#586e75",
        "editorSuggestWidget.background": "#eee8d5",
        "editorSuggestWidget.border": "#b58900",
        "editorSuggestWidget.selectedBackground": "#268bd222",
        "editorWidget.background": "#eee8d5",
        "editorWidget.border": "#b58900",
      },
    },
  },
};

export function getEditorThemeData(key: string): EditorThemeDefinition {
  const normalized = normalizeEditorThemeKey(key);
  return EDITOR_THEMES[normalized] ?? EDITOR_THEMES[DEFAULT_EDITOR_THEME_KEY]!;
}

export function listEditorThemes(): EditorThemeDefinition[] {
  return Object.values(EDITOR_THEMES);
}
