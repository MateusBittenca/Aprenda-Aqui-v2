import { cn } from "@/lib/utils";

export type TreasureChestVariant = "closed" | "open" | "claimed";

interface TreasureChestIconProps {
  variant?: TreasureChestVariant;
  className?: string;
}

/** Ícone de baú no estilo tátil/gamificado da plataforma. */
export function TreasureChestIcon({
  variant = "closed",
  className,
}: TreasureChestIconProps) {
  const isOpen = variant === "open" || variant === "claimed";

  return (
    <svg
      viewBox="0 0 64 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <ellipse cx="32" cy="52" rx="20" ry="3.5" className="fill-current opacity-20" />

      {/* Corpo do baú */}
      <rect
        x="11"
        y="28"
        width="42"
        height="20"
        rx="3"
        className="fill-current"
      />
      <rect
        x="11"
        y="34"
        width="42"
        height="4"
        className="fill-black/15"
      />
      <rect x="14" y="31" width="36" height="2" rx="1" className="fill-white/25" />

      {/* Fecho central */}
      {!isOpen && (
        <>
          <rect x="28" y="30" width="8" height="10" rx="1.5" className="fill-black/20" />
          <circle cx="32" cy="35" r="2" className="fill-white/40" />
        </>
      )}

      {/* Tampa */}
      {isOpen ? (
        <>
          <path
            d="M11 28 L11 20 C11 16 16 12 32 11 C48 12 53 16 53 20 L53 28 Z"
            className="fill-current opacity-40"
          />
          <path
            d="M14 14 L32 8 L50 14 L48 22 L16 22 Z"
            className="fill-current"
          />
          <path d="M16 22 L48 22 L46 26 L18 26 Z" className="fill-white/20" />
          {variant === "claimed" ? (
            <path
              d="M28 32 L32 38 L36 32 Z"
              className="fill-white/90 stroke-white/90"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          ) : (
            <>
              <circle cx="26" cy="33" r="1.5" className="fill-secondary" />
              <circle cx="32" cy="35" r="2" className="fill-secondary" />
              <circle cx="38" cy="33" r="1.5" className="fill-secondary" />
            </>
          )}
        </>
      ) : (
        <>
          <path
            d="M11 28 C11 22 18 16 32 14 C46 16 53 22 53 28 Z"
            className="fill-current opacity-90"
          />
          <path
            d="M14 18 L32 12 L50 18"
            className="stroke-white/30"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Cantos metálicos */}
      <circle cx="14" cy="40" r="1.5" className="fill-white/35" />
      <circle cx="50" cy="40" r="1.5" className="fill-white/35" />
    </svg>
  );
}
