import { prisma } from "database";

function getWeekStart(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekEnd(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 7);
  return end;
}

export async function getUserWeeklyXp(userId: string, weekStart = getWeekStart()): Promise<number> {
  const weekEnd = getWeekEnd(weekStart);

  const result = await prisma.userProgress.aggregate({
    where: {
      userId,
      completedAt: { gte: weekStart, lt: weekEnd },
    },
    _sum: { xpEarned: true },
  });

  return result._sum.xpEarned ?? 0;
}

// Uma única query agregada em vez de 7 round-trips
export async function getWeeklyXpData(userId: string) {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const progress = await prisma.userProgress.findMany({
    where: { userId, completedAt: { gte: sevenDaysAgo } },
    select: { completedAt: true, xpEarned: true },
  });

  const dayLabels = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
  const xpByDay = new Map<string, number>();

  progress.forEach((p: { completedAt: Date; xpEarned: number }) => {
    const d = new Date(p.completedAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    xpByDay.set(key, (xpByDay.get(key) ?? 0) + p.xpEarned);
  });

  const days: { label: string; xp: number; dateKey: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    // Adiciona índice para tornar label única quando a semana cruza dias iguais
    days.push({
      label: dayLabels[d.getDay()],
      xp: xpByDay.get(key) ?? 0,
      dateKey: key,
    });
  }

  return days.map(({ label, xp }) => ({ label, xp }));
}

export async function addXp(userId: string, amount: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { xpTotal: { increment: amount } },
  });
}

export async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!user.ultimaAtividade) {
    await prisma.user.update({
      where: { id: userId },
      data: { streakAtual: 1, ultimaAtividade: now },
    });
    return;
  }

  const lastActivity = new Date(user.ultimaAtividade);
  const lastDay = new Date(
    lastActivity.getFullYear(),
    lastActivity.getMonth(),
    lastActivity.getDate()
  );

  const diffDays = Math.floor(
    (today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return;

  const newStreak = diffDays === 1 ? user.streakAtual + 1 : 1;

  await prisma.user.update({
    where: { id: userId },
    data: { streakAtual: newStreak, ultimaAtividade: now },
  });
}

export function calculateLevel(xpTotal: number): number {
  return Math.floor(xpTotal / 1000) + 1;
}

export function xpToNextLevel(xpTotal: number): number {
  return calculateLevel(xpTotal) * 1000 - xpTotal;
}
