import Image from "next/image";
import { MASCOT } from "@/lib/mascot";

interface MascotTipProps {
  tip: string;
  variant?: "default" | "thinking";
}

export function MascotTip({ tip, variant = "default" }: MascotTipProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    lg: "w-48 md:w-56",
  };

  const src = variant === "thinking" ? MASCOT.thinking : MASCOT.tip;

  if (variant === "thinking") {
    return (
      <div className={`relative ${sizeClasses.lg} aspect-square self-center md:self-start`}>
        <Image
          src={src}
          alt="Mascote pensando"
          fill
          className="object-contain drop-shadow-xl"
          priority
        />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant shadow-sm">
      <div className={`relative ${sizeClasses.sm} shrink-0`}>
        <Image src={src} alt="Dica do robô" fill className="object-contain" />
      </div>
      <div className="flex-1">
        <span className="text-xs font-bold text-outline uppercase tracking-wider">
          Dica do Robô
        </span>
        <p className="text-sm text-on-surface-variant italic">&quot;{tip}&quot;</p>
      </div>
    </div>
  );
}
