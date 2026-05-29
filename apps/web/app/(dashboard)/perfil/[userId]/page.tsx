import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPublicUserProfile } from "@/lib/public-profile";
import { UserProfileView } from "@/components/profile/user-profile-view";

interface PublicProfilePageProps {
  params: { userId: string };
}

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { userId } = params;

  if (userId === session.user.id) {
    redirect("/perfil");
  }

  const profile = await getPublicUserProfile(userId);
  if (!profile) notFound();

  return <UserProfileView profile={profile} isOwnProfile={false} />;
}
