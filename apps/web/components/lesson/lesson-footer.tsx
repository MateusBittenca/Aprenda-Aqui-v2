"use client";

import { cn } from "@/lib/utils";

type FooterState = "idle" | "correct" | "incorrect";

interface LessonFooterProps {
  state: FooterState;
  canCheck: boolean;
  feedbackTitle?: string;
  feedbackMessage?: string;
  buttonLabel?: string;
  onCheck: () => void;
}

export function LessonFooter({
  state,
  canCheck,
  feedbackTitle,
  feedbackMessage,
  buttonLabel,
  onCheck,
}: LessonFooterProps) {
  const label =
    buttonLabel ??
    (state === "correct" ? "CONTINUAR" : state === "incorrect" ? "OK" : "VERIFICAR");

  return (
    <footer
      className={cn(
        "sticky bottom-0 w-full border-t-2 border-surface-container-highest py-4 md:py-6 px-4 z-50 transition-colors duration-300",
        state === "correct" && "bg-primary-container/20",
        state === "incorrect" && "bg-error-container",
        state === "idle" && "bg-surface-container-lowest"
      )}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          className={cn(
            "flex flex-col transition-opacity duration-300",
            state !== "idle" ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <span
            className={cn(
              "font-bold text-lg",
              state === "incorrect" ? "text-error" : "text-primary"
            )}
          >
            {feedbackTitle}
          </span>
          {feedbackMessage && (
            <span className="text-on-surface-variant text-sm">{feedbackMessage}</span>
          )}
        </div>

        <button
          onClick={onCheck}
          disabled={!canCheck && state === "idle"}
          className={cn(
            "w-full md:w-64 h-14 font-bold text-lg rounded-2xl transition-all duration-200",
            state === "idle" &&
              (canCheck
                ? "bg-primary-container text-on-primary-container block-shadow-primary cursor-pointer"
                : "bg-surface-container-highest text-on-surface/30 block-shadow-card cursor-not-allowed"),
            state === "correct" &&
              "bg-primary-container text-on-primary-container block-shadow-primary cursor-pointer",
            state === "incorrect" &&
              "bg-error text-on-error shadow-[0_4px_0_#93000a] cursor-pointer"
          )}
        >
          {label}
        </button>
      </div>
    </footer>
  );
}
