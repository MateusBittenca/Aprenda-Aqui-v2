import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { authOptions } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { getUserProfile } from "@/lib/server-stats";
import { getUserLevelContext } from "@/lib/level-trail-data";
import { LevelUpProvider } from "@/components/levels/level-up-provider";
import { DailyRewardsProvider } from "@/components/daily-rewards/daily-rewards-provider";
import { calculateLevel } from "@/lib/level-system";
import { getTitleLabel } from "@/lib/level-system";
import { getDailyRewardStateForUser } from "@/lib/daily-reward-data";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "TEACHER") {
    redirect("/professor/trilhas");
  }

  const userId = session?.user?.id;
  const [profile, unreadNotifications, levelContext, dailyRewardState] = userId
    ? await Promise.all([
        getUserProfile(userId),
        getUnreadNotificationCount(userId),
        getUserLevelContext(userId),
        getDailyRewardStateForUser(userId),
      ])
    : [null, 0, null, null];

  const level = profile ? calculateLevel(profile.xpTotal) : 1;
  const titleLabel = levelContext
    ? getTitleLabel(levelContext.activeTitleKey)
    : "Iniciante";

  const content = (
    <>
      <Sidebar />
      <TopBar
        xpTotal={profile?.xpTotal ?? 0}
        gems={profile?.gems ?? 0}
        streak={profile?.streakAtual ?? 0}
        level={level}
        titleLabel={titleLabel}
        unreadNotifications={unreadNotifications}
      />
      <main className="lg:ml-64 p-6 pb-24 lg:pb-6">
        <div className="max-w-[1200px] mx-auto">{children}</div>
      </main>
      <MobileNav />
    </>
  );

  if (!userId || !levelContext || !dailyRewardState) {
    return <div className="min-h-screen bg-background">{content}</div>;
  }

  return (
    <LevelUpProvider
      pendingLevelUp={levelContext.pendingLevelUp}
      xpTotal={levelContext.xpTotal}
      activeTitleKey={levelContext.activeTitleKey}
      unlockedTitles={levelContext.unlockedTitles}
    >
      <DailyRewardsProvider initialState={dailyRewardState}>
        <div className="min-h-screen bg-background">{content}</div>
      </DailyRewardsProvider>
    </LevelUpProvider>
  );
}
