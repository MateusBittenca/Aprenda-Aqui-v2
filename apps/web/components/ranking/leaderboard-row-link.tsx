import Link from "next/link";
import { cn, formatNumber } from "@/lib/utils";
import type { LeaderboardRow } from "@/lib/leaderboard";
import { Medal, Trophy } from "lucide-react";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="h-8 w-8 text-yellow-500 fill-yellow-500" />;
  if (rank === 2) return <Medal className="h-8 w-8 text-slate-400 fill-slate-400" />;
  if (rank === 3) return <Medal className="h-8 w-8 text-amber-700 fill-amber-700" />;
  return (
    <span className="font-headline-md text-headline-md text-secondary font-bold">{rank}</span>
  );
}

function UserAvatar({ name }: { name: string }) {
  return (
    <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center font-bold text-primary text-lg shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function LeaderboardRowLink({
  row,
  currentUserRow,
}: {
  row: LeaderboardRow;
  currentUserRow?: LeaderboardRow;
}) {
  const href = row.isCurrentUser ? "/perfil" : `/perfil/${row.userId}`;

  return (
    <Link
      href={href}
      className={cn(
        "grid grid-cols-[60px_1fr_100px] gap-4 p-4 items-center transition-colors hover:bg-primary-container/5",
        row.isCurrentUser && "bg-primary-container/20 border-l-8 border-primary"
      )}
    >
      <div className="flex justify-center">
        <RankIcon rank={row.rank} />
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar name={row.name} />
        <div className="min-w-0">
          <span className="font-bold text-on-background truncate block group-hover:text-primary">
            {row.isCurrentUser ? "Você" : row.name}
          </span>
          {row.isCurrentUser && currentUserRow && currentUserRow.rank <= 3 && (
            <span className="text-xs text-primary font-bold">Quase lá!</span>
          )}
          {row.isCurrentUser && currentUserRow && currentUserRow.rank > 3 && (
            <span className="text-xs text-on-surface-variant">
              Posição #{currentUserRow.rank}
            </span>
          )}
          {!row.isCurrentUser && (
            <span className="text-xs text-on-surface-variant">Ver perfil</span>
          )}
        </div>
      </div>

      <span className="font-bold text-primary text-right">
        {formatNumber(row.xpWeekly)}
      </span>
    </Link>
  );
}
