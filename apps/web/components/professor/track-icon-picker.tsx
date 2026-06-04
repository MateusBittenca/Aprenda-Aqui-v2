"use client";

import { cn } from "@/lib/utils";
import { TRACK_ICON_OPTIONS } from "@/lib/track-options";

interface TrackIconPickerProps {
  value: string;
  onChange: (iconKey: string) => void;
  accentColor?: string;
}

export function TrackIconPicker({ value, onChange, accentColor }: TrackIconPickerProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-secondary uppercase mb-2">Ícone</label>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {TRACK_ICON_OPTIONS.map(({ key, label, Icon }) => {
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={selected}
              onClick={() => onChange(key)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 bouncy-transition",
                selected
                  ? "border-primary bg-primary-container ring-2 ring-primary/30"
                  : "border-surface-variant bg-surface hover:border-primary/50"
              )}
            >
              <span
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  selected ? "bg-primary/15" : "bg-surface-container-highest"
                )}
                style={selected && accentColor ? { color: accentColor } : undefined}
              >
                <Icon
                  className={cn("h-5 w-5", !selected && "text-on-surface-variant")}
                  strokeWidth={2.5}
                />
              </span>
              <span className="text-[10px] font-bold text-secondary leading-tight text-center line-clamp-1">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
