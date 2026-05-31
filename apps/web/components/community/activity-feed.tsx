import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { ActivityFeedItem } from "@/lib/community";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { UserAvatar } from "@/components/community/user-avatar";
const ACTIVITY_LESSON_COMPLETED = "LESSON_COMPLETED" as const;

interface ActivityFeedProps {
  items: ActivityFeedItem[];
}

function ActivityMessage({ item }: { item: ActivityFeedItem }) {
  if (item.type === ACTIVITY_LESSON_COMPLETED) {
    const title = item.metadata.lessonTitle ?? "uma lição";
    const track = item.metadata.trackTitle;
    return (
      <>
        completou{" "}
        <strong className="text-on-background">{title}</strong>
        {track ? (
          <>
            {" "}
            em <span className="text-primary font-bold">{track}</span>
          </>
        ) : null}
        {item.metadata.xpEarned || item.metadata.gemsEarned ? (
          <span className="text-on-surface-variant">
            {" "}
            (
            {item.metadata.xpEarned ? `+${item.metadata.xpEarned} XP` : null}
            {item.metadata.xpEarned && item.metadata.gemsEarned ? ", " : null}
            {item.metadata.gemsEarned ? `+${item.metadata.gemsEarned} gemas` : null}
            )
          </span>
        ) : null}
      </>
    );
  }
  return <>teve uma nova atividade</>;
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-10 w-10 text-outline mx-auto mb-3" />
        <p className="text-on-surface-variant text-sm">
          Nenhuma atividade dos seus amigos ainda. Adicione amigos para ver o que estão aprendendo!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-container-highest">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 p-4 first:pt-0 last:pb-0">
          <UserAvatar
            userId={item.user.id}
            name={item.user.name}
            image={item.user.image}
            size="sm"
          />
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              <Link
                href={`/perfil/${item.user.id}`}
                className="font-bold text-on-background hover:text-primary"
              >
                {item.user.name}
              </Link>{" "}
              <ActivityMessage item={item} />
            </p>
            <p className="text-xs text-outline mt-1">{formatRelativeTime(item.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
