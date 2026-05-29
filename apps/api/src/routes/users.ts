import { Router } from "express";
import { prisma } from "database";
import { AuthRequest } from "../middleware/auth";
import {
  calculateLevel,
  getUserWeeklyXp,
  getWeeklyXpData,
  xpToNextLevel,
} from "../services/gamification";

const router = Router();

router.get("/me", async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        xpTotal: true,
        streakAtual: true,
        ultimaAtividade: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({
      ...user,
      level: calculateLevel(user.xpTotal),
      xpToNextLevel: xpToNextLevel(user.xpTotal),
    });
  } catch {
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

router.get("/me/stats", async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    const [user, lessonsCompleted, weeklyXp, allLessons, completedIds, xpWeekly] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { xpTotal: true, streakAtual: true },
        }),
        prisma.userProgress.count({ where: { userId, completed: true } }),
        getWeeklyXpData(userId),
        prisma.lesson.findMany({
          orderBy: [
            { track: { order: "asc" } },
            { unit: { order: "asc" } },
            { order: "asc" },
          ],
          include: { track: true, unit: true },
        }),
        prisma.userProgress.findMany({
          where: { userId, completed: true },
          select: { lessonId: true },
        }),
        getUserWeeklyXp(userId),
      ]);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const completedSet = new Set(completedIds.map((p: { lessonId: string }) => p.lessonId));
    // Retorna null se tudo foi concluído, em vez de repetir a última lição
    const nextLesson = allLessons.find((l: { id: string }) => !completedSet.has(l.id)) ?? null;

    res.json({
      xpTotal: user.xpTotal,
      streakAtual: user.streakAtual,
      lessonsCompleted,
      weeklyXp,
      xpWeekly,
      level: calculateLevel(user.xpTotal),
      xpToNextLevel: xpToNextLevel(user.xpTotal),
      continueLesson: nextLesson
        ? {
            lessonId: nextLesson.id,
            title: nextLesson.title,
            trackTitle: nextLesson.track.title,
            trackSlug: nextLesson.track.slug,
            unitTitle: nextLesson.unit?.title ?? "",
            type: nextLesson.type,
          }
        : null,
    });
  } catch {
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});

export default router;
