import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "database";
import { authOptions } from "@/lib/auth";
import { getPublicUserProfile } from "@/lib/public-profile";
import { UserProfileView } from "@/components/profile/user-profile-view";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [profile, dbUser] = await Promise.all([
    getPublicUserProfile(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    }),
  ]);

  if (!profile || !dbUser) redirect("/login");

  return (
    <UserProfileView
      profile={profile}
      isOwnProfile
      email={dbUser.email}
    />
  );
}
