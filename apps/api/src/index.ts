import "./env";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth";
import usersRouter from "./routes/users";
import tracksRouter from "./routes/tracks";
import lessonsRouter from "./routes/lessons";

const app = express();
const PORT = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);

app.use(
  cors({
    origin: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/tracks", authMiddleware, tracksRouter);
app.use("/users", authMiddleware, usersRouter);
app.use("/lessons", authMiddleware, lessonsRouter);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`API Aprenda Aqui! rodando na porta ${PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Porta ${PORT} já está em uso. Encerre o processo anterior e tente novamente.`);
    process.exit(1);
  }

  throw error;
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
