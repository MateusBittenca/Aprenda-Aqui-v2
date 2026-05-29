import { prisma, NotificationType } from "database";
import { getFriendIds } from "@/lib/community";
import type { NotificationItem, NotificationMetadata } from "@/lib/notification-types";

export type { NotificationItem, NotificationMetadata } from "@/lib/notification-types";

export async function createNotification(params: {
  userId: string;
  actorId?: string | null;
  type: NotificationType;
  metadata: NotificationMetadata;
}) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      actorId: params.actorId ?? null,
      type: params.type,
      metadata: params.metadata,
    },
  });
}

export async function notifyFriendRequest(params: {
  friendshipId: string;
  requesterId: string;
  addresseeId: string;
  requesterName: string;
}) {
  await createNotification({
    userId: params.addresseeId,
    actorId: params.requesterId,
    type: NotificationType.FRIEND_REQUEST,
    metadata: {
      friendshipId: params.friendshipId,
      actorName: params.requesterName,
      actorId: params.requesterId,
    },
  });
}

export async function notifyFriendAccepted(params: {
  friendshipId: string;
  requesterId: string;
  addresseeId: string;
  addresseeName: string;
}) {
  await createNotification({
    userId: params.requesterId,
    actorId: params.addresseeId,
    type: NotificationType.FRIEND_ACCEPTED,
    metadata: {
      friendshipId: params.friendshipId,
      actorName: params.addresseeName,
      actorId: params.addresseeId,
    },
  });
}

export async function notifyFriendsOfLessonActivity(params: {
  userId: string;
  actorName: string;
  lessonId: string;
  lessonTitle: string;
  trackTitle: string;
}) {
  const friendIds = await getFriendIds(params.userId);
  if (friendIds.length === 0) return;

  await prisma.notification.createMany({
    data: friendIds.map((friendId) => ({
      userId: friendId,
      actorId: params.userId,
      type: NotificationType.FRIEND_ACTIVITY,
      metadata: {
        actorName: params.actorName,
        actorId: params.userId,
        lessonId: params.lessonId,
        lessonTitle: params.lessonTitle,
        trackTitle: params.trackTitle,
      },
    })),
  });
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

export async function getNotifications(
  userId: string,
  limit = 30
): Promise<NotificationItem[]> {
  const rows = await prisma.notification.findMany({
    where: { userId },
    include: {
      actor: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((row: (typeof rows)[number]) => ({
    id: row.id,
    type: row.type,
    read: row.read,
    metadata: row.metadata as NotificationMetadata,
    createdAt: row.createdAt,
    actor: row.actor,
  }));
}

export async function markNotificationRead(
  notificationId: string,
  userId: string
): Promise<boolean> {
  const result = await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
  return result.count > 0;
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  return result.count;
}
