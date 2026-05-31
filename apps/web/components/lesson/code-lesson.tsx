"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  acknowledgeLevelCelebration,
  navigateAfterLessonComplete,
  submitLessonCompletion,
} from "@/lib/lesson-completion";
import type { LevelUpPayload } from "@/lib/level-rewards";
import { LevelUpCelebration } from "@/components/levels/level-up-celebration";
import { validateCodeAnswer } from "@/lib/lesson-validation";
import { useLessonLives } from "@/hooks/use-lesson-lives";
import { LessonHeader } from "./lesson-header";
import { LessonFooter } from "./lesson-footer";
import { MascotTip } from "./mascot-tip";
import { CodeEditor } from "./code-editor";
import { OutOfLivesModal } from "./out-of-lives-modal";

type LessonMode = "HTML" | "CSS" | "JS";

interface CodeLessonProps {
  lessonId: string;
  title: string;
  instructions: string;
  starterCode: string;
  hint?: string;
  xpReward: number;
  gemsReward: number;
  trackSlug: string;
  initialGems: number;
  validationContains?: string | null;
  mode?: LessonMode;
}

function buildPreviewDoc(code: string, mode: LessonMode): string {
  if (mode === "CSS") {
    return `<!DOCTYPE html><html><head><style>${code}</style></head><body><div class="preview-target" style="padding:16px;font-family:sans-serif">Texto de exemplo para ver o estilo</div></body></html>`;
  }
  if (mode === "JS") {
    return `<!DOCTYPE html><html><body><script>
      const _log = [];
      const _orig = console.log;
      console.log = (...a) => { _log.push(a.map(String).join(' ')); _orig(...a); };
      try { ${code} } catch(e) { _log.push('Erro: ' + e.message); }
      document.write('<pre style="font-family:monospace;padding:16px">' + _log.join('\\n') + '</pre>');
    <\/script></body></html>`;
  }
  return `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:16px}</style></head><body>${code}</body></html>`;
}

function getFilename(mode: LessonMode) {
  return mode === "CSS" ? "styles.css" : mode === "JS" ? "script.js" : "index.html";
}

export function CodeLesson({
  lessonId,
  title,
  instructions,
  starterCode,
  hint,
  xpReward,
  gemsReward,
  trackSlug,
  initialGems,
  validationContains = null,
  mode = "HTML",
}: CodeLessonProps) {
  const router = useRouter();
  const [code, setCode] = useState(starterCode);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [hasRun, setHasRun] = useState(false);
  const [footerState, setFooterState] = useState<"idle" | "correct" | "incorrect">("idle");
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState(false);
  const [levelUp, setLevelUp] = useState<LevelUpPayload | null>(null);
  const [pendingRewards, setPendingRewards] = useState<{ xp: number; gems: number } | null>(
    null
  );

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

  const progress = footerState === "correct" ? 100 : hasRun ? 75 : 45;
  const lessonBlocked = outOfLives;
  const solution = validationContains ? { contains: validationContains } : null;

  function runCode() {
    setPreviewSrc(buildPreviewDoc(code, mode));
    setHasRun(true);
  }

  async function completeLesson() {
    setCompleting(true);
    setCompleteError(false);

    try {
      const result = await submitLessonCompletion(lessonId, code);

      if (!result.ok) {
        if (result.incorrect) {
          loseLife();
        }
        setCompleteError(true);
        setCompleting(false);
        setFooterState("incorrect");
        return;
      }

      const xp = result.xpEarned ?? xpReward;
      const gemsEarned = result.gemsEarned ?? gemsReward;

      if (result.levelUp) {
        setPendingRewards({ xp, gems: gemsEarned });
        setLevelUp(result.levelUp);
        setCompleting(false);
        setFooterState("correct");
        return;
      }

      navigateAfterLessonComplete(router, trackSlug, lessonId, { xp, gems: gemsEarned });
    } catch (err) {
      console.error("[code] erro de rede", err);
      setCompleteError(true);
      setCompleting(false);
      setFooterState("incorrect");
    }
  }

  async function handleRefill() {
    const restored = await restoreLives();
    if (restored) {
      setFooterState("idle");
    }
  }

  function handleCheck() {
    if (lessonBlocked) return;

    if (footerState === "correct") {
      completeLesson();
      return;
    }

    if (footerState === "incorrect") {
      setFooterState("idle");
      return;
    }

    if (!hasRun) return;

    const isCorrect = validateCodeAnswer(solution, code);

    if (isCorrect) {
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
        <div className="w-full max-w-6xl mt-6 flex flex-col md:flex-row gap-6 items-stretch">
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-surface-container-low p-6 rounded-3xl border-2 border-surface-container-highest">
              <h2 className="text-2xl font-extrabold text-secondary mb-3">{title}</h2>
              <p
                className="text-lg text-on-surface-variant mb-4"
                dangerouslySetInnerHTML={{
                  __html: instructions.replace(
                    /`([^`]+)`/g,
                    '<code class="bg-surface-container-highest px-1 rounded font-bold">$1</code>'
                  ),
                }}
              />
              <MascotTip
                tip={hint ?? "Escreva o código e clique em RODAR para ver o resultado!"}
              />
            </div>
          </div>

          <div className="flex-[1.5] flex flex-col gap-4">
            <div className="flex flex-col bg-secondary rounded-3xl overflow-hidden block-shadow-secondary border-2 border-on-secondary-fixed h-72 md:h-80">
              <div className="flex items-center justify-between px-6 py-3 bg-on-secondary-fixed border-b border-secondary/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <div className="w-3 h-3 rounded-full bg-tertiary-fixed" />
                  <div className="w-3 h-3 rounded-full bg-primary-container" />
                  <span className="ml-2 text-xs font-bold text-on-secondary/50 font-mono tracking-widest">
                    {getFilename(mode)}
                  </span>
                </div>
                <button
                  onClick={runCode}
                  disabled={lessonBlocked}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary-container text-on-primary-container rounded-xl font-bold text-sm block-shadow-primary active:translate-y-1 hover:brightness-110 bouncy-transition disabled:opacity-50"
                >
                  <Play className="h-4 w-4 fill-current" />
                  RODAR
                </button>
              </div>

              <div className="flex-grow min-h-0 w-full">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  mode={mode}
                  className="h-full min-h-[220px]"
                />
              </div>
            </div>

            <div className="flex flex-col bg-surface-container-low rounded-3xl overflow-hidden border-2 border-surface-container-highest h-48">
              <div className="flex items-center gap-1 px-4 py-2 border-b border-surface-container-highest text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                <Terminal className="h-3.5 w-3.5" />
                {mode === "JS" ? "Console" : "Visualização"}
              </div>
              {hasRun && previewSrc ? (
                <iframe
                  srcDoc={previewSrc}
                  className="flex-grow w-full bg-white"
                  sandbox="allow-scripts"
                  title="preview"
                />
              ) : (
                <div className="flex-grow flex items-center justify-center text-on-surface-variant text-sm">
                  Clique em <strong className="mx-1">RODAR</strong> para ver o resultado
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <LessonFooter
        state={footerState}
        canCheck={hasRun && !lessonBlocked}
        feedbackTitle={
          footerState === "correct"
            ? "Muito bem! 🎉"
            : footerState === "incorrect"
              ? "Oops! Quase lá."
              : undefined
        }
        feedbackMessage={
          completeError
            ? "Não foi possível salvar seu progresso. Verifique o código e tente novamente."
            : footerState === "correct"
              ? `Código correto! +${xpReward} XP aguardando.`
              : footerState === "incorrect"
                ? "Verifique seu código e tente novamente."
                : undefined
        }
        buttonLabel={
          completing
            ? "Salvando..."
            : footerState === "correct"
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

      {levelUp && pendingRewards && (
        <LevelUpCelebration
          open
          levelUp={levelUp}
          onContinue={async () => {
            await acknowledgeLevelCelebration();
            navigateAfterLessonComplete(router, trackSlug, lessonId, pendingRewards);
            setLevelUp(null);
            setPendingRewards(null);
          }}
        />
      )}
    </div>
  );
}
