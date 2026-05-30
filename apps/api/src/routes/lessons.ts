import { Router } from "express";
import { prisma } from "database";
import { AuthRequest } from "../middleware/auth";
import { updateStreak } from "../services/gamification";

const router = Router();

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        track: { select: { title: true, slug: true } },
        unit: { select: { title: true } },
      },
    });

    if (!lesson) {
      return res.status(404).json({ error: "Lição não encontrada" });
    }

    const progress = await prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId: req.userId as string, lessonId: lesson.id } },
    });

    // Não expõe `solution` para o cliente
    const { solution: _solution, ...lessonData } = lesson as typeof lesson & { solution: unknown };
    void _solution;

    res.json({ ...lessonData, completed: progress?.completed ?? false });
  } catch {
    res.status(500).json({ error: "Erro ao buscar lição" });
  }
});

router.post("/:id/complete", async (req: AuthRequest, res) => {
  try {
    const userId = req.userId as string;
    const lessonId = req.params.id as string;

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return res.status(404).json({ error: "Lição não encontrada" });
    }

    const existing = await prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId: userId as string, lessonId: lessonId as string } },
    });

    if (existing?.completed) {
      return res.json({ alreadyCompleted: true, xpEarned: 0, gemsEarned: 0 });
    }

    await prisma.$transaction([
      prisma.userProgress.create({
        data: { userId, lessonId, xpEarned: lesson.xpReward, completed: true },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          xpTotal: { increment: lesson.xpReward },
          gems: { increment: lesson.gemsReward },
        },
      }),
    ]);

    await updateStreak(userId);

    res.json({ xpEarned: lesson.xpReward, gemsEarned: lesson.gemsReward, success: true });
  } catch {
    res.status(500).json({ error: "Erro ao concluir lição" });
  }
});

export default router;
