import Link from "next/link";
import type { CommunityUserSummary } from "@/lib/community";
import { UserAvatar } from "@/components/community/user-avatar";

interface OnlineFriendsRowProps {
  friends: CommunityUserSummary[];
}

export function OnlineFriendsRow({ friends }: OnlineFriendsRowProps) {
  const onlineFriends = friends.filter((f) => f.isOnline);

  if (onlineFriends.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant text-center py-4">
        Nenhum amigo online no momento. Que tal convidar alguém para estudar junto?
      </p>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
      {onlineFriends.map((friend) => (
        <Link
          key={friend.id}
          href={`/perfil/${friend.id}`}
          className="flex flex-col items-center gap-2 shrink-0 min-w-[72px]"
        >
          <UserAvatar
            userId={friend.id}
            name={friend.name}
            image={friend.image}
            isOnline
            linkToProfile={false}
          />
          <span className="text-xs font-bold text-on-background text-center truncate max-w-[80px]">
            {friend.name.split(" ")[0]}
          </span>
        </Link>
      ))}
    </div>
  );
}
