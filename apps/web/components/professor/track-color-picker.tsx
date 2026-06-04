"use client";

import { cn } from "@/lib/utils";
import {
  TRACK_COLOR_PRESETS,
  colorsMatchPreset,
  type TrackColorPreset,
} from "@/lib/track-options";

interface TrackColors {
  colorPrimary: string;
  colorDark: string;
  colorLight: string;
  colorMuted: string;
  colorOnPrimary: string;
}

interface TrackColorPickerProps {
  value: TrackColors;
  onChange: (colors: TrackColors) => void;
}

export function TrackColorPicker({ value, onChange }: TrackColorPickerProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-secondary uppercase mb-2">Paleta de cores</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {TRACK_COLOR_PRESETS.map((preset) => {
          const selected = colorsMatchPreset(value, preset);
          return (
            <ColorPresetButton
              key={preset.name}
              preset={preset}
              selected={selected}
              onClick={() =>
                onChange({
                  colorPrimary: preset.colorPrimary,
                  colorDark: preset.colorDark,
                  colorLight: preset.colorLight,
                  colorMuted: preset.colorMuted,
                  colorOnPrimary: preset.colorOnPrimary,
                })
              }
            />
          );
        })}
      </div>

      <details className="mt-3 group">
        <summary className="text-xs font-bold text-secondary uppercase cursor-pointer hover:text-primary">
          Ajuste fino de cores
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(
            [
              ["Primária", "colorPrimary"],
              ["Escura", "colorDark"],
              ["Clara", "colorLight"],
              ["Muted", "colorMuted"],
              ["Texto", "colorOnPrimary"],
            ] as const
          ).map(([label, key]) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="color"
                value={value[key]}
                onChange={(e) => onChange({ ...value, [key]: e.target.value })}
                className="h-9 w-9 rounded-lg border-2 border-surface-variant cursor-pointer shrink-0"
              />
              <span className="text-[10px] font-bold text-secondary">{label}</span>
            </div>
          ))}
        </div>
      </details>

      <div
        className="mt-3 rounded-2xl p-3 text-center font-bold text-sm border-2 border-surface-variant"
        style={{ backgroundColor: value.colorPrimary, color: value.colorOnPrimary }}
      >
        Preview da trilha
      </div>
    </div>
  );
}

function ColorPresetButton({
  preset,
  selected,
  onClick,
}: {
  preset: TrackColorPreset;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 p-2 rounded-xl border-2 bouncy-transition text-left",
        selected
          ? "border-primary bg-primary-container ring-2 ring-primary/20"
          : "border-surface-variant hover:border-primary/50"
      )}
    >
      <span className="flex -space-x-1 shrink-0">
        <span
          className="w-5 h-5 rounded-full border-2 border-surface-variant"
          style={{ backgroundColor: preset.colorPrimary }}
        />
        <span
          className="w-5 h-5 rounded-full border-2 border-surface-variant"
          style={{ backgroundColor: preset.colorLight }}
        />
        <span
          className="w-5 h-5 rounded-full border-2 border-surface-variant"
          style={{ backgroundColor: preset.colorDark }}
        />
      </span>
      <span className="text-xs font-bold truncate">{preset.name}</span>
    </button>
  );
}
