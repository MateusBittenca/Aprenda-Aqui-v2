/** Gemas concedidas por lição com base no XP (usado no seed e como fallback). */
export function gemsForXp(xpReward: number): number {
  return Math.max(1, Math.floor(xpReward / 2));
}
