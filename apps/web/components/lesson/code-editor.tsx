"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { editor } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";

export type CodeEditorMode = "HTML" | "CSS" | "JS";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[200px] items-center justify-center bg-secondary text-on-secondary/60 text-sm font-mono">
      Carregando editor...
    </div>
  ),
});

function modeToLanguage(mode: CodeEditorMode): string {
  if (mode === "CSS") return "css";
  if (mode === "JS") return "javascript";
  return "html";
}

function defineTheme(monaco: Monaco) {
  monaco.editor.defineTheme("aprenda-aqui", {
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
  });
}

const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineHeight: 22,
  fontFamily: "'Courier New', Courier, monospace",
  fontLigatures: false,
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  insertSpaces: true,
  wordWrap: "on",
  padding: { top: 12, bottom: 12 },
  // Autocomplete estilo VS Code
  quickSuggestions: {
    other: true,
    comments: false,
    strings: true,
  },
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: "on",
  tabCompletion: "on",
  wordBasedSuggestions: "currentDocument",
  snippetSuggestions: "top",
  suggest: {
    showKeywords: true,
    showSnippets: true,
    showClasses: true,
    showFunctions: true,
    showVariables: true,
    showProperties: true,
    showMethods: true,
    showWords: true,
    preview: true,
    filterGraceful: true,
    localityBonus: true,
  },
  bracketPairColorization: { enabled: true },
  autoClosingBrackets: "always",
  autoClosingQuotes: "always",
  autoIndent: "full",
  formatOnPaste: true,
  formatOnType: true,
  cursorBlinking: "smooth",
  smoothScrolling: true,
  renderLineHighlight: "line",
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
};

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  mode: CodeEditorMode;
  className?: string;
}

export function CodeEditor({ value, onChange, mode, className }: CodeEditorProps) {
  const language = useMemo(() => modeToLanguage(mode), [mode]);

  function handleBeforeMount(monaco: Monaco) {
    defineTheme(monaco);
  }

  return (
    <div className={className ?? "h-full min-h-[200px] w-full"}>
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        theme="aprenda-aqui"
        options={EDITOR_OPTIONS}
        beforeMount={handleBeforeMount}
        onChange={(next) => onChange(next ?? "")}
      />
    </div>
  );
}
