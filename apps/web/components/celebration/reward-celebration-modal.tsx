"use client";

import { ModalPortal } from "@/components/ui/modal-portal";
import { cn } from "@/lib/utils";
import {
  RewardClaimCelebration,
  type RewardClaimCelebrationProps,
} from "@/components/celebration/reward-claim-celebration";

interface RewardCelebrationModalProps extends RewardClaimCelebrationProps {
  open: boolean;
  zIndex?: number;
}

export function RewardCelebrationModal({
  open,
  zIndex = 200,
  ...celebrationProps
}: RewardCelebrationModalProps) {
  if (!open) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-on-background/85 backdrop-blur-md"
        style={{ zIndex }}
        role="dialog"
        aria-modal="true"
        aria-live="polite"
      >
        <div
          className={cn(
            "card-elevation relative w-full max-w-md rounded-4xl border-2 border-surface-container-highest bg-surface overflow-hidden pointer-events-auto",
            "scale-[1.02] border-primary/20 shadow-2xl"
          )}
        >
          <RewardClaimCelebration {...celebrationProps} />
        </div>
      </div>
    </ModalPortal>
  );
}
