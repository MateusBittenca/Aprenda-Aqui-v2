import { prisma, FriendshipStatus, ActivityType, type Friendship } from "database";
import { getWeeklyLeaderboard, type LeaderboardRow } from "@/lib/leaderboard";

export const ONLINE_THRESHOLD_MS = 15 * 60 * 1000;

export type FriendshipView =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "friends";

export interface CommunityUserSummary {
  id: string;
  name: string;
  image: string | null;
  xpTotal: number;
  streakAtual: number;
  isOnline: boolean;
}

export interface PendingInviteReceived {
  id: string;
  user: CommunityUserSummary;
  createdAt: Date;
}

export interface PendingInviteSent {
  id: string;
  user: CommunityUserSummary;
  createdAt: Date;
}

export interface ActivityFeedItem {
  id: string;
  user: Pick<CommunityUserSummary, "id" | "name" | "image">;
  type: ActivityType;
  metadata: {
    lessonId?: string;
    lessonTitle?: string;
    trackTitle?: string;
    xpEarned?: number;
  };
  createdAt: Date;
}

export interface RankingSuggestion {
  userId: string;
  name: string;
  xpWeekly: number;
  rank: number;
  friendshipStatus: FriendshipView;
  friendshipId: string | null;
}

function isUserOnline(ultimaAtividade: Date | null): boolean {
  if (!ultimaAtividade) return false;
  return Date.now() - ultimaAtividade.getTime() < ONLINE_THRESHOLD_MS;
}

function toUserSummary(user: {
  id: string;
  name: string;
  image: string | null;
  xpTotal: number;
  streakAtual: number;
  ultimaAtividade: Date | null;
}): CommunityUserSummary {
  return {
    id: user.id,
    name: user.name,
    image: user.image,
    xpTotal: user.xpTotal,
    streakAtual: user.streakAtual,
    isOnline: isUserOnline(user.ultimaAtividade),
  };
}

export async function findFriendshipBetween(userIdA: string, userIdB: string) {
  return prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: userIdA, addresseeId: userIdB },
        { requesterId: userIdB, addresseeId: userIdA },
      ],
    },
  });
}

export function getFriendshipView(
  friendship: { requesterId: string; addresseeId: string; status: FriendshipStatus } | null,
  currentUserId: string
): FriendshipView {
  if (!friendship || friendship.status === FriendshipStatus.DECLINED) return "none";
  if (friendship.status === FriendshipStatus.ACCEPTED) return "friends";
  if (friendship.requesterId === currentUserId) return "pending_sent";
  return "pending_received";
}

export async function getFriendIds(userId: string): Promise<string[]> {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: FriendshipStatus.ACCEPTED,
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: { requesterId: true, addresseeId: true },
  });

  return friendships.map((f: { requesterId: string; addresseeId: string }) =>
    f.requesterId === userId ? f.addresseeId : f.requesterId
  );
}

async function getExcludedUserIds(userId: string): Promise<string[]> {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: { in: [FriendshipStatus.ACCEPTED, FriendshipStatus.PENDING] },
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: { requesterId: true, addresseeId: true },
  });

  const ids = new Set<string>([userId]);
  for (const f of friendships) {
    ids.add(f.requesterId);
    ids.add(f.addresseeId);
  }
  return Array.from(ids);
}

export async function getPendingInvites(userId: string): Promise<{
  received: PendingInviteReceived[];
  sent: PendingInviteSent[];
}> {
  const [receivedRows, sentRows] = await Promise.all([
    prisma.friendship.findMany({
      where: { addresseeId: userId, status: FriendshipStatus.PENDING },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            image: true,
            xpTotal: true,
            streakAtual: true,
            ultimaAtividade: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.friendship.findMany({
      where: { requesterId: userId, status: FriendshipStatus.PENDING },
      include: {
        addressee: {
          select: {
            id: true,
            name: true,
            image: true,
            xpTotal: true,
            streakAtual: true,
            ultimaAtividade: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    received: receivedRows.map(
      (row: (typeof receivedRows)[number]) => ({
        id: row.id,
        createdAt: row.createdAt,
        user: toUserSummary(row.requester),
      })
    ),
    sent: sentRows.map((row: (typeof sentRows)[number]) => ({
      id: row.id,
      createdAt: row.createdAt,
      user: toUserSummary(row.addressee),
    })),
  };
}

export async function getFriendsWithPresence(userId: string): Promise<CommunityUserSummary[]> {
  const friendIds = await getFriendIds(userId);
  if (friendIds.length === 0) return [];

  const friends = await prisma.user.findMany({
    where: { id: { in: friendIds } },
    select: {
      id: true,
      name: true,
      image: true,
      xpTotal: true,
      streakAtual: true,
      ultimaAtividade: true,
    },
    orderBy: { ultimaAtividade: "desc" },
  });

  return friends.map(toUserSummary);
}

export async function getFriendsActivityFeed(
  userId: string,
  limit = 20
): Promise<ActivityFeedItem[]> {
  const friendIds = await getFriendIds(userId);
  if (friendIds.length === 0) return [];

  const events = await prisma.activityEvent.findMany({
    where: { userId: { in: friendIds } },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return events.map((event: (typeof events)[number]) => ({
    id: event.id,
    user: event.user,
    type: event.type,
    metadata: event.metadata as ActivityFeedItem["metadata"],
    createdAt: event.createdAt,
  }));
}

export async function getRankingSuggestions(
  userId: string,
  limit = 5
): Promise<RankingSuggestion[]> {
  const { rows } = await getWeeklyLeaderboard(userId);
  const excluded = new Set(await getExcludedUserIds(userId));

  const candidates = rows
    .filter((row: LeaderboardRow) => !excluded.has(row.userId))
    .slice(0, limit);
  if (candidates.length === 0) return [];

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: candidates.flatMap((c) => [
        { requesterId: userId, addresseeId: c.userId },
        { requesterId: c.userId, addresseeId: userId },
      ]),
    },
  });

  return candidates.map((row: LeaderboardRow) => {
    const friendship = friendships.find(
      (f: Friendship) =>
        (f.requesterId === userId && f.addresseeId === row.userId) ||
        (f.requesterId === row.userId && f.addresseeId === userId)
    );
    const view =
      friendship && friendship.status !== FriendshipStatus.DECLINED
        ? getFriendshipView(friendship, userId)
        : "none";

    return {
      userId: row.userId,
      name: row.name,
      xpWeekly: row.xpWeekly,
      rank: row.rank,
      friendshipStatus: view,
      friendshipId: friendship?.id ?? null,
    };
  });
}

export async function getFriendshipBetween(
  currentUserId: string,
  targetUserId: string
): Promise<{
  status: FriendshipView;
  friendshipId: string | null;
}> {
  const friendship = await findFriendshipBetween(currentUserId, targetUserId);
  if (!friendship || friendship.status === FriendshipStatus.DECLINED) {
    return { status: "none", friendshipId: null };
  }
  return {
    status: getFriendshipView(friendship, currentUserId),
    friendshipId: friendship.id,
  };
}

export async function searchUsers(
  query: string,
  userId: string,
  limit = 10
): Promise<
  Array<{
    id: string;
    name: string;
    image: string | null;
    xpTotal: number;
    friendshipStatus: FriendshipView;
    friendshipId: string | null;
  }>
> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const excluded = await getExcludedUserIds(userId);

  const users = await prisma.user.findMany({
    where: {
      id: { notIn: excluded },
      name: { contains: trimmed },
    },
    select: { id: true, name: true, image: true, xpTotal: true },
    take: limit,
    orderBy: { name: "asc" },
  });

  if (users.length === 0) return [];

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: users.flatMap((u: { id: string }) => [
        { requesterId: userId, addresseeId: u.id },
        { requesterId: u.id, addresseeId: userId },
      ]),
    },
  });

  return users.map((user: (typeof users)[number]) => {
    const friendship = friendships.find(
      (f: Friendship) =>
        (f.requesterId === userId && f.addresseeId === user.id) ||
        (f.requesterId === user.id && f.addresseeId === userId)
    );
    const view =
      friendship && friendship.status !== FriendshipStatus.DECLINED
        ? getFriendshipView(friendship, userId)
        : "none";

    return {
      ...user,
      friendshipStatus: view,
      friendshipId: friendship?.id ?? null,
    };
  });
}
