export type HelpCategoryId = "conta" | "trilhas" | "gamificacao" | "recompensas";

export interface HelpCategory {
  id: HelpCategoryId;
  title: string;
  description: string;
}

export interface HelpFaqItem {
  id: string;
  category: HelpCategoryId;
  question: string;
  answer: string;
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "conta",
    title: "Conta e Perfil",
    description: "Login, perfil e configurações",
  },
  {
    id: "trilhas",
    title: "Trilhas de Estudo",
    description: "Lições, progresso e trilhas",
  },
  {
    id: "gamificacao",
    title: "Gamificação e XP",
    description: "Ranking, ligas e ofensiva",
  },
  {
    id: "recompensas",
    title: "Gemas e Vidas",
    description: "Recompensas e recuperação",
  },
];

export const HELP_FAQS: HelpFaqItem[] = [
  {
    id: "ligas",
    category: "gamificacao",
    question: "Como funcionam as ligas?",
    answer:
      "As ligas são competições semanais no ranking. Você ganha XP ao completar lições e compete com outros alunos para subir de posição. Quanto mais XP na semana, melhor sua colocação na liga (Bronze, Prata, Ouro e além).",
  },
  {
    id: "gratis",
    category: "trilhas",
    question: "Posso aprender de graça?",
    answer:
      "Sim! As trilhas de programação estão disponíveis para estudar sem custo. Complete lições de quiz e código, ganhe XP e gemas, e avance no seu ritmo.",
  },
  {
    id: "ofensiva",
    category: "gamificacao",
    question: "O que acontece se eu perder minha ofensiva?",
    answer:
      "Sua ofensiva (streak) conta dias seguidos de prática. Se você passar um dia sem completar uma lição, a contagem reinicia. Pratique todos os dias para manter a chama acesa no seu perfil!",
  },
  {
    id: "vidas",
    category: "recompensas",
    question: "Como funcionam as vidas nas lições?",
    answer:
      "Cada lição começa com 5 vidas. Ao errar um exercício, você perde uma vida. Se zerar, pode recuperar todas as vidas gastando gemas para continuar na mesma lição.",
  },
  {
    id: "gemas",
    category: "recompensas",
    question: "Como ganho e uso gemas?",
    answer:
      "Você ganha gemas ao completar lições pela primeira vez. O saldo aparece no topo da tela e no seu perfil. Use gemas para recuperar vidas quando elas acabarem durante uma lição.",
  },
  {
    id: "xp-nivel",
    category: "gamificacao",
    question: "Como subo de nível?",
    answer:
      "Cada lição concede XP ao ser concluída corretamente. Acumule XP para subir de nível — a cada 1.000 XP você avança um nível. Acompanhe o progresso no perfil e no dashboard.",
  },
  {
    id: "senha",
    category: "conta",
    question: "Como altero minha senha?",
    answer:
      'Acesse Configurações → aba Conta → Segurança. Informe a senha atual, a nova senha e confirme. Se entrou com outro método, use a opção de recuperação do provedor.',
  },
  {
    id: "nome",
    category: "conta",
    question: "Posso mudar meu nome de exibição?",
    answer:
      'Sim. Em Configurações → aba Perfil, edite o nome de exibição e clique em "Salvar Alterações". O nome aparece no ranking, comunidade e no seu perfil público.',
  },
  {
    id: "trilha-progresso",
    category: "trilhas",
    question: "Como desbloqueio a próxima lição?",
    answer:
      "As lições seguem uma ordem na trilha. Complete a lição atual para liberar a próxima. O caminho de aprendizado mostra quais estão concluídas, disponíveis ou bloqueadas.",
  },
  {
    id: "amigos",
    category: "conta",
    question: "Como adiciono amigos?",
    answer:
      "Na página Comunidade, busque outros estudantes e envie um pedido de amizade. Quando aceito, vocês aparecem um para o outro e podem ver atividades no feed.",
  },
];
