import { prisma, DEFAULT_EDITOR_THEME_KEY } from "database";
import { normalizeEditorThemeKey } from "@/lib/editor-themes";

export interface StoreState {
  gems: number;
  streakFreezes: number;
  xpBoostExpiresAt: string | null;
  activeEditorThemeKey: string;
  ownedItemKeys: string[];
}

export async function getStoreStateForUser(userId: string): Promise<StoreState | null> {
  const [user, inventory] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        gems: true,
        streakFreezes: true,
        xpBoostExpiresAt: true,
        activeEditorThemeKey: true,
      },
    }),
    prisma.userInventoryItem.findMany({
      where: { userId },
      select: { itemKey: true },
    }),
  ]);

  if (!user) return null;

  return {
    gems: user.gems,
    streakFreezes: user.streakFreezes,
    xpBoostExpiresAt: user.xpBoostExpiresAt ? user.xpBoostExpiresAt.toISOString() : null,
    activeEditorThemeKey: normalizeEditorThemeKey(
      user.activeEditorThemeKey ?? DEFAULT_EDITOR_THEME_KEY
    ),
    ownedItemKeys: inventory.map((i: { itemKey: string }) =>
      normalizeEditorThemeKey(i.itemKey)
    ),
  };
}
