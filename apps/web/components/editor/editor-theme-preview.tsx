import { EDITOR_THEMES } from "@/lib/editor-themes";
import { cn } from "@/lib/utils";

interface EditorThemePreviewProps {
  themeKey: string;
  className?: string;
}

export function EditorThemePreview({ themeKey, className }: EditorThemePreviewProps) {
  const theme = EDITOR_THEMES[themeKey];
  const background = theme?.preview.background ?? "#1c1f4a";
  const accents = theme?.preview.accents ?? ["#ffffff", "#ffffff", "#ffffff"];

  return (
    <div
      className={cn(
        "relative flex aspect-video w-full flex-col justify-center gap-2 overflow-hidden rounded-2xl p-4",
        className
      )}
      style={{ backgroundColor: background }}
    >
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
      </div>
      <div className="h-2 w-1/2 rounded-full" style={{ backgroundColor: accents[0] }} />
      <div className="h-2 w-3/4 rounded-full" style={{ backgroundColor: accents[1] }} />
      <div className="h-2 w-2/3 rounded-full" style={{ backgroundColor: accents[2] }} />
    </div>
  );
}
