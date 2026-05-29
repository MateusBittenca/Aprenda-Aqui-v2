import { Router } from "express";
import { prisma } from "database";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const tracks = await prisma.track.findMany({
      orderBy: { order: "asc" },
      include: {
        units: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" }, select: { id: true, title: true, type: true, order: true, xpReward: true } },
          },
        },
        _count: { select: { lessons: true } },
      },
    });

    res.json(tracks);
  } catch {
    res.status(500).json({ error: "Erro ao buscar trilhas" });
  }
});

export default router;
