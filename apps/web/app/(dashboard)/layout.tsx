import { getServerSession } from "next-auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { authOptions } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { getUserProfile } from "@/lib/server-stats";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const [profile, unreadNotifications] = userId
    ? await Promise.all([
        getUserProfile(userId),
        getUnreadNotificationCount(userId),
      ])
    : [null, 0];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar
        xpTotal={profile?.xpTotal ?? 0}
        streak={profile?.streakAtual ?? 0}
        unreadNotifications={unreadNotifications}
      />
      <main className="lg:ml-64 p-6 pb-24 lg:pb-6">
        <div className="max-w-[1200px] mx-auto">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
