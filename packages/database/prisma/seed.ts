import { PrismaClient, LessonType, ActivityType, NotificationType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { gemsForXp } from "../src/gems.ts";
import { syncLevelRewardsForUser } from "../src/sync-level-rewards.ts";

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
  await prisma.notification.deleteMany();
  await prisma.activityEvent.deleteMany();
  await prisma.userChestClaim.deleteMany();
  await prisma.userTitleUnlock.deleteMany();
  await prisma.trackChest.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.leaderboardEntry.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.track.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo123", 10);
  const professorPasswordHash = await bcrypt.hash("professor123", 10);

  const demoUser = await prisma.user.create({
    data: {
      name: "Alex Dev",
      email: "demo@aprendaqui.com.br",
      passwordHash,
      xpTotal: 0,
      streakAtual: 3,
      ultimaAtividade: new Date(),
      role: UserRole.STUDENT,
    },
  });

  await prisma.user.create({
    data: {
      name: "Prof. Aprenda",
      email: "professor@aprendaqui.com.br",
      passwordHash: professorPasswordHash,
      role: UserRole.TEACHER,
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
              title: "Títulos e hierarquia",
              type: LessonType.QUIZ,
              order: 3,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual tag representa o título principal da página?",
                    options: ["<h1>", "<title>", "<header>"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Primeira página",
              type: LessonType.CODE,
              order: 4,
              xpReward: 20,
              content: {
                instructions: "Crie um título h1 com o texto 'Olá, Mundo!'",
                starterCode: "<!DOCTYPE html>\n<html>\n<head></head>\n<body>\n  \n</body>\n</html>",
              },
              solution: { contains: "olá, mundo!" },
            },
            {
              title: "Parágrafos",
              type: LessonType.CODE,
              order: 5,
              xpReward: 20,
              content: {
                instructions: "Adicione um parágrafo com o texto 'Aprenda HTML com diversão!'",
                starterCode: "<h1>Minha página</h1>\n",
              },
              solution: { contains: "aprenda html com diversão" },
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
              title: "Meta e charset",
              type: LessonType.QUIZ,
              order: 2,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual meta tag define a codificação de caracteres?",
                    options: [
                      '<meta charset="UTF-8">',
                      '<meta name="viewport">',
                      '<meta http-equiv="refresh">',
                    ],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Listas não ordenadas",
              type: LessonType.CODE,
              order: 3,
              xpReward: 20,
              content: {
                instructions: "Crie uma lista não ordenada com 3 itens (use <li>)",
                starterCode: "<ul>\n  \n</ul>",
              },
              solution: { contains: "<li>" },
            },
            {
              title: "Criar um link",
              type: LessonType.CODE,
              order: 4,
              xpReward: 25,
              content: {
                instructions:
                  "Crie um link com <a href=\"https://example.com\"> que exiba o texto 'Saiba mais'",
                starterCode: "<p>Conteúdo da página</p>\n",
              },
              solution: { contains: 'href="https://example.com"' },
            },
            {
              title: "Listas ordenadas",
              type: LessonType.QUIZ,
              order: 5,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual tag cria uma lista numerada?",
                    options: ["<ol>", "<ul>", "<dl>"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
          ],
        },
        {
          title: "Texto e mídia",
          order: 3,
          pathOffset: -16,
          lessons: [
            {
              title: "Negrito e ênfase",
              type: LessonType.QUIZ,
              order: 1,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual tag semântica indica texto importante?",
                    options: ["<strong>", "<b>", "<big>"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Destacar texto",
              type: LessonType.CODE,
              order: 2,
              xpReward: 20,
              content: {
                instructions: "Envolva a palavra 'importante' com a tag <strong>",
                starterCode: "<p>Este conteúdo é importante para o estudo.</p>",
              },
              solution: { contains: "importante" },
            },
            {
              title: "Inserir imagens",
              type: LessonType.QUIZ,
              order: 3,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual tag insere uma imagem em HTML?",
                    options: ["<img>", "<image>", "<picture>"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Tag img na prática",
              type: LessonType.CODE,
              order: 4,
              xpReward: 25,
              content: {
                instructions:
                  'Adicione uma imagem com <img src="logo.png" alt="Logo do site">',
                starterCode: "<h1>Bem-vindo</h1>\n",
              },
              solution: { contains: 'alt="logo do site"' },
            },
            {
              title: "Acessibilidade com alt",
              type: LessonType.QUIZ,
              order: 5,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Para que serve o atributo alt em imagens?",
                    options: [
                      "Descrever a imagem para leitores de tela",
                      "Definir o tamanho da imagem",
                      "Aplicar um filtro visual",
                    ],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
          ],
        },
        {
          title: "Formulários",
          order: 4,
          pathOffset: 12,
          lessons: [
            {
              title: "Elemento form",
              type: LessonType.QUIZ,
              order: 1,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual elemento agrupa campos de um formulário?",
                    options: ["<form>", "<fieldset>", "<input>"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Campo de texto",
              type: LessonType.CODE,
              order: 2,
              xpReward: 25,
              content: {
                instructions:
                  'Dentro de um <form>, adicione um input de texto com name="email" e placeholder="Seu email"',
                starterCode: "<form>\n  \n</form>",
              },
              solution: { contains: 'type="text"' },
            },
            {
              title: "Botão de envio",
              type: LessonType.CODE,
              order: 3,
              xpReward: 25,
              content: {
                instructions: 'Adicione um botão de envio com <button type="submit">Enviar</button>',
                starterCode: '<form>\n  <input type="text" name="nome" />\n</form>',
              },
              solution: { contains: 'type="submit"' },
            },
            {
              title: "Área de texto",
              type: LessonType.QUIZ,
              order: 4,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual tag é usada para textos longos em formulários?",
                    options: ["<textarea>", "<input>", "<text>"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Formulário completo",
              type: LessonType.CODE,
              order: 5,
              xpReward: 30,
              content: {
                instructions: "Adicione um <textarea name=\"mensagem\"></textarea> dentro do form",
                starterCode:
                  '<form>\n  <input type="text" name="nome" placeholder="Nome" />\n  <button type="submit">Enviar</button>\n</form>',
              },
              solution: { contains: '<textarea name="mensagem">' },
            },
          ],
        },
        {
          title: "Semântica HTML5",
          order: 5,
          pathOffset: 0,
          lessons: [
            {
              title: "Tags semânticas",
              type: LessonType.QUIZ,
              order: 1,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual tag representa o conteúdo principal da página?",
                    options: ["<main>", "<section>", "<div>"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Header e footer",
              type: LessonType.CODE,
              order: 2,
              xpReward: 25,
              content: {
                instructions: "Crie uma estrutura com <header> e <main> (main pode estar vazio)",
                starterCode: "<body>\n  \n</body>",
              },
              solution: { contains: "main" },
            },
            {
              title: "Nav e article",
              type: LessonType.QUIZ,
              order: 3,
              xpReward: 15,
              content: {
                questions: [
                  {
                    question: "Qual tag agrupa links de navegação?",
                    options: ["<nav>", "<menu>", "<links>"],
                    correctIndex: 0,
                  },
                ],
              },
              solution: { correctIndex: 0 },
            },
            {
              title: "Página semântica",
              type: LessonType.CODE,
              order: 4,
              xpReward: 30,
              content: {
                instructions:
                  "Adicione um <nav> com um link <a href=\"/\">Início</a> e um <footer> com texto '2024'",
                starterCode: "<header><h1>Meu site</h1></header>\n<main></main>\n",
              },
              solution: { contains: 'href="/"' },
            },
            {
              title: "Desafio final HTML",
              type: LessonType.CODE,
              order: 5,
              xpReward: 40,
              content: {
                instructions:
                  "Monte uma mini página: h1 com 'Aprenda Aqui', um parágrafo e um link 'Começar' para /trilhas",
                starterCode:
                  "<!DOCTYPE html>\n<html>\n<head><meta charset=\"UTF-8\"><title>Aprenda Aqui</title></head>\n<body>\n  \n</body>\n</html>",
                hint: "Use h1, p e a com href",
              },
              solution: { contains: 'href="/trilhas"' },
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
                hint: "Dentro do .map(), use uma arrow function que retorne o número vezes 2 (ex.: n => n * 2)",
              },
              solution: { contains: "* 2" },
            },
          ],
        },
      ],
    },
  ];

  const allLessons: { id: string; xpReward: number; gemsReward: number }[] = [];

  for (const trackData of tracksData) {
    const { units, ...trackFields } = trackData;
    const track = await prisma.track.create({ data: trackFields });

    for (const unitData of units) {
      const { lessons, ...unitFields } = unitData;
      const unit = await prisma.unit.create({
        data: { ...unitFields, trackId: track.id },
      });

      let lastLessonInUnit: { id: string } | null = null;

      for (const lessonData of lessons) {
        const { xpReward, ...rest } = lessonData;
        const lesson = await prisma.lesson.create({
          data: {
            ...rest,
            xpReward,
            gemsReward: gemsForXp(xpReward),
            trackId: track.id,
            unitId: unit.id,
          },
        });
        lastLessonInUnit = lesson;
        allLessons.push({
          id: lesson.id,
          xpReward: lesson.xpReward,
          gemsReward: lesson.gemsReward,
        });
      }

      if (lastLessonInUnit) {
        const unitXpBonus = 20 + unitFields.order * 10;
        const unitGemsBonus = 10 + unitFields.order * 5;
        await prisma.trackChest.create({
          data: {
            trackId: track.id,
            afterLessonId: lastLessonInUnit.id,
            title: `Baú: ${unitFields.title}`,
            xpReward: unitXpBonus,
            gemsReward: unitGemsBonus,
            order: unitFields.order,
          },
        });
      }
    }
  }

  const weekStart = getWeekStart();
  const completedLessons = allLessons.slice(0, 8);
  let demoXpTotal = 0;
  let demoGemsTotal = 0;

  for (let i = 0; i < completedLessons.length; i++) {
    const lesson = completedLessons[i];
    demoXpTotal += lesson.xpReward;
    demoGemsTotal += lesson.gemsReward;

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

  const demoLevelSync = await syncLevelRewardsForUser(prisma, demoUser.id, demoXpTotal);

  await prisma.user.update({
    where: { id: demoUser.id },
    data: {
      xpTotal: demoXpTotal,
      gems: demoGemsTotal + demoLevelSync.totalGemsFromLevels,
      activeTitleKey: demoLevelSync.activeTitleKey,
      lastCelebratedLevel: demoLevelSync.level,
    },
  });

  const now = new Date();
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const maria = await prisma.user.create({
    data: {
      name: "Maria Silva",
      email: "maria@aprendaqui.com.br",
      passwordHash,
      xpTotal: 45,
      streakAtual: 5,
      ultimaAtividade: fiveMinAgo,
    },
  });

  const joao = await prisma.user.create({
    data: {
      name: "João Costa",
      email: "joao@aprendaqui.com.br",
      passwordHash,
      xpTotal: 30,
      streakAtual: 2,
      ultimaAtividade: twoHoursAgo,
    },
  });

  const ana = await prisma.user.create({
    data: {
      name: "Ana Lima",
      email: "ana@aprendaqui.com.br",
      passwordHash,
      xpTotal: 20,
      streakAtual: 1,
      ultimaAtividade: now,
    },
  });

  const carlos = await prisma.user.create({
    data: {
      name: "Carlos Mendes",
      email: "carlos@aprendaqui.com.br",
      passwordHash,
      xpTotal: 15,
      streakAtual: 0,
      ultimaAtividade: twoHoursAgo,
    },
  });

  for (const [user, lessonCount] of [
    [maria, 5],
    [joao, 4],
    [ana, 3],
    [carlos, 2],
  ] as const) {
    let xp = 0;
    for (let i = 0; i < lessonCount; i++) {
      const lesson = allLessons[i];
      xp += lesson.xpReward;
      await prisma.userProgress.create({
        data: {
          userId: user.id,
          lessonId: lesson.id,
          xpEarned: lesson.xpReward,
          completedAt: new Date(weekStart.getTime() + i * 86400000),
        },
      });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { xpTotal: xp },
    });

    const sync = await syncLevelRewardsForUser(prisma, user.id, xp);
    const current = await prisma.user.findUnique({
      where: { id: user.id },
      select: { gems: true },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        gems: (current?.gems ?? 0) + sync.totalGemsFromLevels,
        activeTitleKey: sync.activeTitleKey,
        lastCelebratedLevel: sync.level,
      },
    });
  }

  await prisma.friendship.create({
    data: {
      requesterId: maria.id,
      addresseeId: demoUser.id,
      status: "ACCEPTED",
    },
  });

  await prisma.friendship.create({
    data: {
      requesterId: demoUser.id,
      addresseeId: joao.id,
      status: "ACCEPTED",
    },
  });

  const pendingAna = await prisma.friendship.create({
    data: {
      requesterId: ana.id,
      addresseeId: demoUser.id,
      status: "PENDING",
    },
  });

  const pendingCarlos = await prisma.friendship.create({
    data: {
      requesterId: carlos.id,
      addresseeId: demoUser.id,
      status: "PENDING",
    },
  });

  const firstLesson = completedLessons[0];
  const firstLessonFull = await prisma.lesson.findUnique({
    where: { id: firstLesson.id },
    include: { track: { select: { title: true } } },
  });

  if (firstLessonFull) {
    const activityMeta = {
      lessonId: firstLessonFull.id,
      lessonTitle: firstLessonFull.title,
      trackTitle: firstLessonFull.track.title,
      xpEarned: firstLessonFull.xpReward,
    };

    await prisma.activityEvent.createMany({
      data: [
        {
          userId: maria.id,
          type: ActivityType.LESSON_COMPLETED,
          metadata: activityMeta,
          createdAt: new Date(now.getTime() - 30 * 60 * 1000),
        },
        {
          userId: joao.id,
          type: ActivityType.LESSON_COMPLETED,
          metadata: activityMeta,
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        },
        {
          userId: demoUser.id,
          type: ActivityType.LESSON_COMPLETED,
          metadata: activityMeta,
          createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        },
      ],
    });
  }

  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        actorId: ana.id,
        type: NotificationType.FRIEND_REQUEST,
        read: false,
        metadata: {
          friendshipId: pendingAna.id,
          actorName: ana.name,
        },
      },
      {
        userId: demoUser.id,
        actorId: carlos.id,
        type: NotificationType.FRIEND_REQUEST,
        read: false,
        metadata: {
          friendshipId: pendingCarlos.id,
          actorName: carlos.name,
        },
      },
      {
        userId: demoUser.id,
        actorId: maria.id,
        type: NotificationType.FRIEND_ACTIVITY,
        read: true,
        metadata: {
          actorName: maria.name,
          lessonTitle: firstLessonFull?.title ?? "O que é HTML?",
          trackTitle: firstLessonFull?.track.title ?? "HTML",
        },
        createdAt: new Date(now.getTime() - 45 * 60 * 1000),
      },
    ],
  });

  console.log("Seed concluído!");
  console.log("Usuário demo: demo@aprendaqui.com.br / demo123");
  console.log("Professor: professor@aprendaqui.com.br / professor123");
  console.log("Outros usuários: maria@, joao@, ana@, carlos@aprendaqui.com.br / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
