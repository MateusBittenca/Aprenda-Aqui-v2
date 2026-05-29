import { PrismaClient, LessonType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function getWeekStart(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function main() {
  await prisma.userProgress.deleteMany();
  await prisma.leaderboardEntry.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.track.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo123", 10);

  const demoUser = await prisma.user.create({
    data: {
      name: "Alex Dev",
      email: "demo@aprendaqui.com.br",
      passwordHash,
      xpTotal: 0,
      streakAtual: 3,
      ultimaAtividade: new Date(),
    },
  });

  const tracksData = [
    {
      title: "HTML",
      slug: "html",
      icon: "code",
      description: "Aprenda a estruturar páginas web com HTML5.",
      order: 1,
      colorPrimary: "#fb923c",
      colorDark: "#c2410c",
      colorLight: "#fdba74",
      colorMuted: "#ea580c",
      colorOnPrimary: "#ffffff",
      units: [
        {
          title: "Fundamentos",
          order: 1,
          pathOffset: 0,
          lessons: [
            {
              title: "O que é HTML?",
              type: LessonType.QUIZ,
              order: 1,
              xpReward: 10,
              content: {
                questions: [
                  {
                    question: "O que significa HTML?",
                    options: [
                      "HyperText Markup Language",
                      "High Tech Modern Language",
                      "Home Tool Markup Language",
                    ],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Tags básicas",
              type: LessonType.QUIZ,
              order: 2,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual tag define um parágrafo?",
                    options: ["<p>", "<div>", "<span>"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Primeira página",
              type: LessonType.CODE,
              order: 3,
              xpReward: 20,
              content: {
                instructions: "Crie um título h1 com o texto 'Olá, Mundo!'",
                starterCode: "<!DOCTYPE html>\n<html>\n<head></head>\n<body>\n  \n</body>\n</html>",
              },
              solution: { contains: "<h1>Olá, Mundo!</h1>" },
            },
          ],
        },
        {
          title: "Estrutura",
          order: 2,
          pathOffset: 16,
          lessons: [
            {
              title: "Head e Body",
              type: LessonType.QUIZ,
              order: 1,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Onde ficam os metadados da página?",
                    options: ["<head>", "<body>", "<footer>"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Listas e links",
              type: LessonType.CODE,
              order: 2,
              xpReward: 20,
              content: {
                instructions: "Crie uma lista não ordenada com 3 itens",
                starterCode: "<ul>\n  \n</ul>",
              },
              solution: { contains: "<li>" },
            },
          ],
        },
      ],
    },
    {
      title: "CSS",
      slug: "css",
      icon: "palette",
      description: "Estilize suas páginas com CSS moderno.",
      order: 2,
      colorPrimary: "#3b82f6",
      colorDark: "#1d4ed8",
      colorLight: "#93c5fd",
      colorMuted: "#2563eb",
      colorOnPrimary: "#ffffff",
      units: [
        {
          title: "Seletores",
          order: 1,
          pathOffset: 0,
          lessons: [
            {
              title: "Introdução ao CSS",
              type: LessonType.QUIZ,
              order: 1,
              xpReward: 10,
              content: {
                questions: [
                  {
                    question: "Como aplicar CSS inline?",
                    options: ['style="..."', 'css="..."', 'class="..."'],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Cores e fontes",
              type: LessonType.CODE,
              order: 2,
              xpReward: 20,
              content: {
                instructions: "Defina a cor do texto como #58CC02",
                starterCode: "p {\n  \n}",
              },
              solution: { contains: "color" },
            },
          ],
        },
        {
          title: "Layout",
          order: 2,
          pathOffset: -12,
          lessons: [
            {
              title: "Flexbox básico",
              type: LessonType.QUIZ,
              order: 1,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual propriedade ativa flexbox?",
                    options: ["display: flex", "position: flex", "layout: flex"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Centralizar conteúdo",
              type: LessonType.CODE,
              order: 2,
              xpReward: 25,
              content: {
                instructions: "Centralize um div com flexbox",
                starterCode: ".container {\n  display: flex;\n  \n}",
              },
              solution: { contains: "justify-content" },
            },
          ],
        },
      ],
    },
    {
      title: "JavaScript",
      slug: "javascript",
      icon: "braces",
      description: "Domine a linguagem da web interativa.",
      order: 3,
      colorPrimary: "#eab308",
      colorDark: "#a16207",
      colorLight: "#fde047",
      colorMuted: "#ca8a04",
      colorOnPrimary: "#422006",
      units: [
        {
          title: "Variáveis",
          order: 1,
          pathOffset: 0,
          lessons: [
            {
              title: "let, const e var",
              type: LessonType.QUIZ,
              order: 1,
              xpReward: 10,
              content: {
                questions: [
                  {
                    question: "Qual declara constante?",
                    options: ["const", "let", "var"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Tipos de dados",
              type: LessonType.QUIZ,
              order: 2,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "typeof 42 retorna?",
                    options: ["number", "integer", "float"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
          ],
        },
        {
          title: "Funções",
          order: 2,
          pathOffset: 12,
          lessons: [
            {
              title: "Arrow functions",
              type: LessonType.QUIZ,
              order: 1,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Sintaxe de arrow function?",
                    options: ["() => {}", "function => {}", "=> function {}"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Soma de números",
              type: LessonType.CODE,
              order: 2,
              xpReward: 25,
              content: {
                instructions: "Crie uma função soma(a, b) que retorna a + b",
                starterCode: "function soma(a, b) {\n  \n}",
              },
              solution: { contains: "return a + b" },
            },
            {
              title: "Arrays e map",
              type: LessonType.CODE,
              order: 3,
              xpReward: 30,
              content: {
                instructions: "Use .map() para dobrar cada número do array",
                starterCode: "const nums = [1, 2, 3];\nconst doubled = nums.map(/* ... */);",
              },
              solution: { contains: "n * 2" },
            },
          ],
        },
      ],
    },
  ];

  const allLessons: { id: string; xpReward: number }[] = [];

  for (const trackData of tracksData) {
    const { units, ...trackFields } = trackData;
    const track = await prisma.track.create({ data: trackFields });

    for (const unitData of units) {
      const { lessons, ...unitFields } = unitData;
      const unit = await prisma.unit.create({
        data: { ...unitFields, trackId: track.id },
      });

      for (const lessonData of lessons) {
        const lesson = await prisma.lesson.create({
          data: {
            ...lessonData,
            trackId: track.id,
            unitId: unit.id,
          },
        });
        allLessons.push({ id: lesson.id, xpReward: lesson.xpReward });
      }
    }
  }

  const weekStart = getWeekStart();
  const completedLessons = allLessons.slice(0, 8);
  let demoXpTotal = 0;

  for (let i = 0; i < completedLessons.length; i++) {
    const lesson = completedLessons[i];
    demoXpTotal += lesson.xpReward;

    const completedAt = new Date(weekStart);
    completedAt.setDate(completedAt.getDate() + (i % 7));
    completedAt.setHours(10 + i, 0, 0, 0);

    await prisma.userProgress.create({
      data: {
        userId: demoUser.id,
        lessonId: lesson.id,
        xpEarned: lesson.xpReward,
        completedAt,
      },
    });
  }

  await prisma.user.update({
    where: { id: demoUser.id },
    data: { xpTotal: demoXpTotal },
  });

  console.log("Seed concluído!");
  console.log("Usuário demo: demo@aprendaqui.com.br / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
