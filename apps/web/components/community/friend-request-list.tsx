"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/community/user-avatar";
import type { PendingInviteReceived } from "@/lib/community";

interface FriendRequestListProps {
  invites: PendingInviteReceived[];
}

export function FriendRequestList({ invites: initialInvites }: FriendRequestListProps) {
  const router = useRouter();
  const [invites, setInvites] = useState(initialInvites);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAccept(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/friends/${id}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao aceitar");
      setInvites((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao aceitar convite");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDecline(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/friends/${id}/decline`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao recusar");
      setInvites((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao recusar convite");
    } finally {
      setLoadingId(null);
    }
  }

  if (invites.length === 0) return null;

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <div
          key={invite.id}
          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 border-surface-container-highest bg-surface-container-low"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <UserAvatar
              userId={invite.user.id}
              name={invite.user.name}
              image={invite.user.image}
              isOnline={invite.user.isOnline}
            />
            <div className="min-w-0">
              <Link
                href={`/perfil/${invite.user.id}`}
                className="font-bold text-on-background hover:text-primary truncate block"
              >
                {invite.user.name}
              </Link>
              <p className="text-xs text-on-surface-variant">Quer ser seu amigo</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              disabled={loadingId === invite.id}
              onClick={() => handleAccept(invite.id)}
            >
              Aceitar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={loadingId === invite.id}
              onClick={() => handleDecline(invite.id)}
            >
              Recusar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
