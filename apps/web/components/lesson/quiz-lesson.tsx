"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  acknowledgeLevelCelebration,
  navigateAfterLessonComplete,
  submitLessonCompletion,
} from "@/lib/lesson-completion";
import type { LevelUpPayload } from "@/lib/level-rewards";
import { LevelUpCelebration } from "@/components/levels/level-up-celebration";
import { RewardCelebrationModal } from "@/components/celebration/reward-celebration-modal";
import { useLessonLives } from "@/hooks/use-lesson-lives";
import { LessonHeader } from "./lesson-header";
import { LessonFooter } from "./lesson-footer";
import { MascotTip } from "./mascot-tip";
import { OutOfLivesModal } from "./out-of-lives-modal";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizLessonProps {
  lessonId: string;
  trackTitle: string;
  questions: QuizQuestion[];
  hint?: string;
  xpReward: number;
  gemsReward: number;
  trackSlug: string;
  initialGems: number;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizLesson({
  lessonId,
  trackTitle,
  questions,
  hint,
  xpReward,
  gemsReward,
  trackSlug,
  initialGems,
}: QuizLessonProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [footerState, setFooterState] = useState<"idle" | "correct" | "incorrect">("idle");
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState(false);
  const pendingLevelUpRef = useRef<LevelUpPayload | null>(null);
  const pendingRewardsRef = useRef<{ xp: number; gems: number } | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpPayload | null>(null);
  const [celebration, setCelebration] = useState<{ xp: number; gems: number } | null>(null);

  const {
    lives,
    gems,
    gemCost,
    outOfLives,
    refilling,
    refillError,
    canAffordRefill,
    loseLife,
    restoreLives,
  } = useLessonLives(initialGems);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant">Esta lição não tem perguntas ainda.</p>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progress = ((currentIndex + (footerState === "correct" ? 1 : 0)) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const lessonBlocked = outOfLives;

  async function completeLesson(correctIndex: number) {
    setCompleting(true);
    setCompleteError(false);

    try {
      const result = await submitLessonCompletion(lessonId, correctIndex);

      if (!result.ok) {
        setCompleteError(true);
        setCompleting(false);
        return;
      }

      const xp = result.xpEarned ?? xpReward;
      const gemsEarned = result.gemsEarned ?? gemsReward;

      if (result.levelUp) {
        pendingLevelUpRef.current = result.levelUp;
      }

      if (xp <= 0 && gemsEarned <= 0) {
        navigateAfterLessonComplete(router, trackSlug, lessonId, { xp, gems: gemsEarned });
        setCompleting(false);
        return;
      }

      setCelebration({ xp, gems: gemsEarned });
      setCompleting(false);
    } catch (err) {
      console.error("[quiz] erro de rede", err);
      setCompleteError(true);
      setCompleting(false);
    }
  }

  async function handleRefill() {
    const restored = await restoreLives();
    if (restored) {
      setFooterState("idle");
      setSelectedIndex(null);
    }
  }

  function handleCheck() {
    if (lessonBlocked) return;

    if (footerState === "correct") {
      if (isLastQuestion) {
        completeLesson(question.correctIndex);
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedIndex(null);
        setFooterState("idle");
      }
      return;
    }

    if (footerState === "incorrect") {
      setFooterState("idle");
      setSelectedIndex(null);
      return;
    }

    if (selectedIndex === null) return;

    if (selectedIndex === question.correctIndex) {
      setFooterState("correct");
    } else {
      loseLife();
      setFooterState("incorrect");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <LessonHeader progress={progress} lives={lives} />

      <main
        className={cn(
          "flex-grow pt-16 pb-24 flex flex-col items-center px-4",
          lessonBlocked && "pointer-events-none opacity-60"
        )}
      >
        <div className="w-full max-w-4xl mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">
              {trackTitle} • {currentIndex + 1}/{questions.length}
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight font-display">
              {question.question}
            </h2>
            <MascotTip
              tip={hint ?? "Leia a pergunta com atenção antes de escolher!"}
              variant="thinking"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => {
              const isSelected = selectedIndex === index;
              const letter = LETTERS[index] ?? String(index + 1);
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (footerState !== "idle" || lessonBlocked) return;
                    setSelectedIndex(index);
                  }}
                  disabled={lessonBlocked}
                  className={cn(
                    "flex items-center gap-4 p-4 bg-surface border-2 rounded-2xl block-shadow-card bouncy-transition text-left hover:bg-surface-container-low",
                    isSelected
                      ? "border-secondary bg-secondary-container/10 block-shadow-card-selected"
                      : "border-surface-container-highest"
                  )}
                >
                  <span
                    className={cn(
                      "w-10 h-10 flex items-center justify-center border-2 rounded-lg font-bold shrink-0",
                      isSelected
                        ? "border-secondary-container bg-secondary-container/20"
                        : "border-surface-container-highest"
                    )}
                  >
                    {letter}
                  </span>
                  <span className="font-bold text-on-surface-variant font-mono text-sm">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <LessonFooter
        state={footerState}
        canCheck={selectedIndex !== null && !lessonBlocked}
        feedbackTitle={
          footerState === "correct"
            ? "Muito bem! 🎉"
            : footerState === "incorrect"
              ? "Opa, quase lá!"
              : undefined
        }
        feedbackMessage={
          completeError
            ? "Não foi possível salvar seu progresso. Tente novamente."
            : footerState === "correct"
              ? isLastQuestion
                ? `Você concluiu a lição e ganhou +${xpReward} XP!`
                : "Continue assim!"
              : footerState === "incorrect"
                ? `A resposta correta é: ${question.options[question.correctIndex]}`
                : undefined
        }
        buttonLabel={
          completing
            ? "Salvando..."
            : footerState === "correct" && isLastQuestion
              ? "VER RESULTADO"
              : footerState === "incorrect"
                ? "TENTAR DE NOVO"
                : undefined
        }
        onCheck={handleCheck}
      />

      <OutOfLivesModal
        open={outOfLives}
        gems={gems}
        gemCost={gemCost}
        trackSlug={trackSlug}
        refilling={refilling}
        error={refillError}
        canAffordRefill={canAffordRefill}
        onRefill={handleRefill}
      />

      <RewardCelebrationModal
        open={celebration !== null}
        variant="lesson"
        title="Lição concluída!"
        subtitle={trackTitle}
        gems={celebration?.gems ?? 0}
        xp={celebration?.xp ?? 0}
        ctaLabel="Continuar"
        zIndex={200}
        onComplete={() => {
          if (!celebration) return;
          pendingRewardsRef.current = celebration;
          setCelebration(null);

          const pending = pendingLevelUpRef.current;
          if (pending) {
            setLevelUp(pending);
            return;
          }

          const rewards = pendingRewardsRef.current;
          pendingRewardsRef.current = null;
          if (rewards) {
            navigateAfterLessonComplete(router, trackSlug, lessonId, rewards);
          }
        }}
      />

      {levelUp && (
        <LevelUpCelebration
          open
          levelUp={levelUp}
          onContinue={async () => {
            await acknowledgeLevelCelebration();
            pendingLevelUpRef.current = null;
            setLevelUp(null);
            const rewards = pendingRewardsRef.current;
            pendingRewardsRef.current = null;
            if (rewards) {
              navigateAfterLessonComplete(router, trackSlug, lessonId, rewards);
            } else {
              const params = new URLSearchParams({ completed: lessonId });
              router.push(`/trilhas/${trackSlug}?${params.toString()}`);
              router.refresh();
            }
          }}
        />
      )}
    </div>
  );
}
