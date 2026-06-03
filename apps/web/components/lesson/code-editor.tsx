"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { editor } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import {
  DEFAULT_EDITOR_THEME_KEY,
  getMonacoThemeName,
  listEditorThemes,
} from "@/lib/editor-themes";

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

function defineThemes(monaco: Monaco) {
  for (const theme of listEditorThemes()) {
    monaco.editor.defineTheme(getMonacoThemeName(theme.key), theme.data);
  }
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
  themeKey?: string;
}

export function CodeEditor({
  value,
  onChange,
  mode,
  className,
  themeKey = DEFAULT_EDITOR_THEME_KEY,
}: CodeEditorProps) {
  const language = useMemo(() => modeToLanguage(mode), [mode]);
  const activeTheme = useMemo(() => getMonacoThemeName(themeKey), [themeKey]);

  function handleBeforeMount(monaco: Monaco) {
    defineThemes(monaco);
  }

  function handleMount(_editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    monaco.editor.setTheme(activeTheme);
  }

  return (
    <div className={className ?? "h-full min-h-[200px] w-full"}>
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        theme={activeTheme}
        options={EDITOR_OPTIONS}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        onChange={(next) => onChange(next ?? "")}
      />
    </div>
  );
}
