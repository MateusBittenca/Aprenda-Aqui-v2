"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  navigateAfterLessonComplete,
  submitLessonCompletion,
} from "@/lib/lesson-completion";
import { LessonHeader } from "./lesson-header";
import { LessonFooter } from "./lesson-footer";
import { MascotTip } from "./mascot-tip";

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
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const MAX_LIVES = 5;

export function QuizLesson({
  lessonId,
  trackTitle,
  questions,
  hint,
  xpReward,
  gemsReward,
  trackSlug,
}: QuizLessonProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [footerState, setFooterState] = useState<"idle" | "correct" | "incorrect">("idle");
  const [lives, setLives] = useState(MAX_LIVES);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState(false);
  const [gameOver, setGameOver] = useState(false);

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
      const gems = result.gemsEarned ?? gemsReward;
      navigateAfterLessonComplete(router, trackSlug, lessonId, { xp, gems });
    } catch (err) {
      console.error("[quiz] erro de rede", err);
      setCompleteError(true);
      setCompleting(false);
    }
  }

  function handleCheck() {
    if (gameOver) return;

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
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameOver(true);
      }
      setFooterState("incorrect");
    }
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-6 p-8 text-center">
        <div className="text-6xl">💔</div>
        <h2 className="text-3xl font-black font-display text-on-background">Sem vidas!</h2>
        <p className="text-on-surface-variant">Você ficou sem vidas nesta lição.</p>
        <button
          onClick={() => router.push("/trilhas")}
          className="mt-4 px-8 py-3 bg-primary-container text-on-primary-container font-bold rounded-full block-shadow-primary bouncy-transition"
        >
          Voltar às Trilhas
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <LessonHeader progress={progress} lives={lives} />

      <main className="flex-grow pt-16 pb-24 flex flex-col items-center px-4">
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
                    if (footerState !== "idle") return;
                    setSelectedIndex(index);
                  }}
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
        canCheck={selectedIndex !== null}
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
    </div>
  );
}
