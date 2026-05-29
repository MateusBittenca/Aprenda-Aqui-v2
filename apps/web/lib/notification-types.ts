/** Tipos e helpers seguros para Client Components (sem Prisma). */

export const NOTIFICATION_TYPES = [
  "FRIEND_REQUEST",
  "FRIEND_ACCEPTED",
  "FRIEND_ACTIVITY",
] as const;

export type NotificationTypeValue = (typeof NOTIFICATION_TYPES)[number];

export interface NotificationMetadata {
  friendshipId?: string;
  actorName?: string;
  actorId?: string;
  lessonTitle?: string;
  trackTitle?: string;
  lessonId?: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationTypeValue;
  read: boolean;
  metadata: NotificationMetadata;
  createdAt: string | Date;
  actor: {
    id: string;
    name: string;
    image: string | null;
  } | null;
}

export function getNotificationHref(
  type: NotificationTypeValue,
  metadata: NotificationMetadata,
  actorId: string | null
): string {
  switch (type) {
    case "FRIEND_REQUEST":
      return "/comunidade";
    case "FRIEND_ACCEPTED":
      return actorId ? `/perfil/${actorId}` : "/comunidade";
    case "FRIEND_ACTIVITY":
      return actorId ? `/perfil/${actorId}` : "/comunidade";
    default:
      return "/comunidade";
  }
}

export function getNotificationMessage(
  type: NotificationTypeValue,
  metadata: NotificationMetadata,
  actorName: string
): string {
  switch (type) {
    case "FRIEND_REQUEST":
      return `${actorName} enviou um convite de amizade`;
    case "FRIEND_ACCEPTED":
      return `${actorName} aceitou seu convite de amizade`;
    case "FRIEND_ACTIVITY": {
      const lesson = metadata.lessonTitle ?? "uma lição";
      const track = metadata.trackTitle;
      return track
        ? `${actorName} completou ${lesson} em ${track}`
        : `${actorName} completou ${lesson}`;
    }
    default:
      return "Nova notificação";
  }
}
