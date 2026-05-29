import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getPendingInvites,
  getFriendsWithPresence,
  getFriendsActivityFeed,
  getRankingSuggestions,
} from "@/lib/community";
import { FriendRequestList } from "@/components/community/friend-request-list";
import { OnlineFriendsRow } from "@/components/community/online-friends-row";
import { ActivityFeed } from "@/components/community/activity-feed";
import { CommunitySearch } from "@/components/community/community-search";
import { RankingSuggestions } from "@/components/community/ranking-suggestions";
import { Users, UserPlus, Activity, Search } from "lucide-react";

export default async function ComunidadePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [invites, friends, activities, suggestions] = await Promise.all([
    getPendingInvites(userId),
    getFriendsWithPresence(userId),
    getFriendsActivityFeed(userId),
    getRankingSuggestions(userId),
  ]);

  const pendingCount = invites.received.length;

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-24 h-24 bg-primary-container/20 rounded-full flex items-center justify-center border-b-8 border-primary-container mb-4">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-on-background font-display">Comunidade</h1>
        <p className="text-secondary mt-2 max-w-md">
          Conecte-se com outros estudantes, veja quem está online e acompanhe o progresso dos seus
          amigos.
        </p>
      </div>

      <section className="card-elevation rounded-4xl p-6 border-2 border-surface-container-highest mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-tertiary-container rounded-xl">
            <UserPlus className="h-5 w-5 text-on-tertiary-container" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-on-background font-display">
              Convites pendentes
            </h2>
            {pendingCount > 0 && (
              <p className="text-sm text-on-surface-variant">
                {pendingCount} {pendingCount === 1 ? "convite aguardando" : "convites aguardando"}
              </p>
            )}
          </div>
          {pendingCount > 0 && (
            <span className="px-3 py-1 bg-error-container text-error text-sm font-bold rounded-full">
              {pendingCount}
            </span>
          )}
        </div>

        {pendingCount === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-4">
            Nenhum convite pendente. Explore o ranking ou busque por nome para adicionar amigos!
          </p>
        ) : (
          <FriendRequestList invites={invites.received} />
        )}
      </section>

      <section className="card-elevation rounded-4xl p-6 border-2 border-surface-container-highest mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-container/20 rounded-xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-on-background font-display">
            Quem está online
          </h2>
        </div>
        <OnlineFriendsRow friends={friends} />
      </section>

      <section className="card-elevation rounded-4xl p-6 border-2 border-surface-container-highest mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-secondary-container/30 rounded-xl">
            <Activity className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-lg font-extrabold text-on-background font-display">
            Atividades dos amigos
          </h2>
        </div>
        <ActivityFeed items={activities} />
      </section>

      <section className="card-elevation rounded-4xl p-6 border-2 border-surface-container-highest mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-container/20 rounded-xl">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-extrabold text-on-background font-display">
            Descobrir pessoas
          </h2>
        </div>

        <h3 className="text-sm font-bold text-secondary uppercase tracking-wide mb-3">
          Buscar por nome
        </h3>
        <CommunitySearch />

        <h3 className="text-sm font-bold text-secondary uppercase tracking-wide mt-8 mb-3">
          Sugestões do ranking
        </h3>
        <RankingSuggestions suggestions={suggestions} />
      </section>
    </div>
  );
}
