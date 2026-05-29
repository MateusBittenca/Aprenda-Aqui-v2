"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, BookOpen, UserCheck, UserPlus } from "lucide-react";
import {
  getNotificationHref,
  getNotificationMessage,
  type NotificationItem,
  type NotificationMetadata,
  type NotificationTypeValue,
} from "@/lib/notification-types";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  initialUnreadCount?: number;
}

function NotificationIcon({ type }: { type: NotificationTypeValue }) {
  const className = "h-5 w-5 shrink-0";
  switch (type) {
    case "FRIEND_REQUEST":
      return <UserPlus className={cn(className, "text-tertiary")} />;
    case "FRIEND_ACCEPTED":
      return <UserCheck className={cn(className, "text-primary")} />;
    case "FRIEND_ACTIVITY":
      return <BookOpen className={cn(className, "text-secondary")} />;
    default:
      return <Bell className={cn(className, "text-outline")} />;
  }
}

export function NotificationBell({ initialUnreadCount = 0 }: NotificationBellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function markAsRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    router.refresh();
  }

  async function markAllAsRead() {
    await fetch("/api/notifications/read-all", { method: "POST" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    router.refresh();
  }

  async function handleNotificationClick(notification: NotificationItem) {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setOpen(false);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
        aria-label="Notificações"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5 text-outline" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-error text-on-error text-[10px] font-bold border-2 border-surface">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,360px)] card-elevation rounded-3xl border-2 border-surface-container-highest bg-surface-container-lowest shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-surface-container-highest bg-surface-container-low">
            <h2 className="font-extrabold text-on-background font-display text-sm">
              Notificações
            </h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-bold text-primary hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-[min(70vh,400px)] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-8">Carregando...</p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 px-4">
                <Bell className="h-10 w-10 text-outline mx-auto mb-2 opacity-50" />
                <p className="text-sm text-on-surface-variant">Nenhuma notificação por aqui</p>
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => {
                  const metadata = notification.metadata as NotificationMetadata;
                  const actorName =
                    notification.actor?.name ?? metadata.actorName ?? "Alguém";
                  const actorId = notification.actor?.id ?? metadata.actorId ?? null;
                  const href = getNotificationHref(notification.type, metadata, actorId);
                  const message = getNotificationMessage(
                    notification.type,
                    metadata,
                    actorName
                  );

                  return (
                    <li key={notification.id}>
                      <Link
                        href={href}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "flex gap-3 px-4 py-3 hover:bg-primary-container/5 transition-colors border-b border-surface-container-highest last:border-0",
                          !notification.read && "bg-primary-container/10"
                        )}
                      >
                        <div className="mt-0.5">
                          <NotificationIcon type={notification.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-on-background leading-snug">{message}</p>
                          <p className="text-xs text-outline mt-1">
                            {formatRelativeTime(new Date(notification.createdAt))}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="px-4 py-3 border-t-2 border-surface-container-highest bg-surface-container-low text-center">
            <Link
              href="/comunidade"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-primary hover:underline"
            >
              Ver comunidade
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
