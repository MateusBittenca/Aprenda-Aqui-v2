import Image from "next/image";
import { Flame, Target, Zap } from "lucide-react";
import { MASCOT, MASCOT_TIPS } from "@/lib/mascot";

function getDailyTip(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000
  );
  return MASCOT_TIPS[dayOfYear % MASCOT_TIPS.length];
}

interface AchievementsProps {
  streak: number;
  xpWeekly: number;
  level: number;
  xpToNextLevel: number;
}

export function Achievements({ streak, xpWeekly, level, xpToNextLevel }: AchievementsProps) {
  const achievements = [
    {
      icon: Flame,
      title: "Ofensiva de Fogo",
      description: `Mantenha uma ofensiva de ${streak} dias consecutivos.`,
      progress: Math.min(streak / 30, 1) * 100,
      color: "text-orange-500",
      bg: "bg-orange-100",
      barColor: "bg-orange-500",
    },
    {
      icon: Zap,
      title: "Caçador de XP",
      description: `Ganhe ${xpWeekly} XP esta semana. Meta: 500 XP.`,
      progress: Math.min(xpWeekly / 500, 1) * 100,
      color: "text-primary",
      bg: "bg-primary-container/10",
      barColor: "bg-primary-container",
    },
    {
      icon: Target,
      title: "Subindo de Nível",
      description: `Nível ${level} — faltam ${xpToNextLevel} XP para o próximo nível.`,
      progress: Math.min(100 - (xpToNextLevel / 1000) * 100, 100),
      color: "text-secondary",
      bg: "bg-secondary-container/30",
      barColor: "bg-secondary",
    },
  ];

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-on-background font-display">Conquistas</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {achievements.map(({ icon: Icon, title, description, progress, color, bg, barColor }) => (
          <div
            key={title}
            className="card-elevation rounded-4xl p-6 flex flex-col items-center text-center border-2 border-surface-container-highest group hover:-translate-y-1 transition-transform"
          >
            <div
              className={`w-20 h-20 ${bg} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <Icon className={`h-10 w-10 ${color}`} />
            </div>
            <h4 className="text-lg font-extrabold text-on-background mb-2 font-display">{title}</h4>
            <p className="text-on-surface-variant text-sm mb-4">{description}</p>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div
                className={`${barColor} h-full rounded-full transition-all duration-500 shimmer-progress`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 items-start bg-tertiary-container/20 p-4 rounded-3xl border-2 border-dashed border-tertiary-fixed">
        <div className="relative w-16 h-16 shrink-0">
          <Image src={MASCOT.default} alt="Mascote" fill className="object-contain" />
        </div>
        <div className="text-sm">
          <p className="font-bold text-tertiary mb-1">Dica do Robô:</p>
          <p className="text-on-surface-variant">{getDailyTip()}</p>
        </div>
      </div>
    </section>
  );
}
