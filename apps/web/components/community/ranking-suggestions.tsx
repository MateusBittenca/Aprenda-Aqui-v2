import Link from "next/link";
import { Medal } from "lucide-react";
import type { RankingSuggestion } from "@/lib/community";
import { FriendActionButton } from "@/components/community/friend-action-button";
import { UserAvatar } from "@/components/community/user-avatar";
import { formatNumber } from "@/lib/utils";

interface RankingSuggestionsProps {
  suggestions: RankingSuggestion[];
}

export function RankingSuggestions({ suggestions }: RankingSuggestionsProps) {
  if (suggestions.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant text-center py-4">
        Nenhuma sugestão no ranking no momento. Complete lições para aparecer na lista!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {suggestions.map((row) => (
        <div
          key={row.userId}
          className="flex items-center gap-3 p-3 rounded-2xl border-2 border-surface-container-highest"
        >
          <div className="w-8 flex justify-center shrink-0">
            {row.rank <= 3 ? (
              <Medal
                className={
                  row.rank === 1
                    ? "h-6 w-6 text-yellow-500 fill-yellow-500"
                    : row.rank === 2
                      ? "h-6 w-6 text-slate-400 fill-slate-400"
                      : "h-6 w-6 text-amber-700 fill-amber-700"
                }
              />
            ) : (
              <span className="text-sm font-bold text-secondary">#{row.rank}</span>
            )}
          </div>
          <UserAvatar userId={row.userId} name={row.name} size="sm" />
          <div className="flex-1 min-w-0">
            <Link
              href={`/perfil/${row.userId}`}
              className="font-bold text-on-background hover:text-primary truncate block"
            >
              {row.name}
            </Link>
            <p className="text-xs text-on-surface-variant">
              {formatNumber(row.xpWeekly)} XP esta semana
            </p>
          </div>
          <FriendActionButton
            targetUserId={row.userId}
            friendshipStatus={row.friendshipStatus}
            friendshipId={row.friendshipId}
          />
        </div>
      ))}
    </div>
  );
}
