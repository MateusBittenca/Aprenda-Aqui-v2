/** Espelho do enum Prisma — sem importar @prisma/client no client. */
export type LeagueTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

export const LeagueTier = {
  BRONZE: "BRONZE",
  SILVER: "SILVER",
  GOLD: "GOLD",
  PLATINUM: "PLATINUM",
  DIAMOND: "DIAMOND",
} as const satisfies Record<LeagueTier, LeagueTier>;
