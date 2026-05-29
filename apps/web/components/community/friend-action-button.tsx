"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { FriendshipView } from "@/lib/community";
import { cn } from "@/lib/utils";
import { UserCheck, UserMinus, UserPlus } from "lucide-react";

interface FriendActionButtonProps {
  targetUserId: string;
  friendshipStatus: FriendshipView;
  friendshipId: string | null;
  size?: "sm" | "default";
  className?: string;
}

export function FriendActionButton({
  targetUserId,
  friendshipStatus: initialStatus,
  friendshipId: initialFriendshipId,
  size = "sm",
  className,
}: FriendActionButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [friendshipId, setFriendshipId] = useState(initialFriendshipId);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    router.refresh();
  }

  async function sendRequest() {
    setLoading(true);
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao enviar convite");
      setStatus("pending_sent");
      setFriendshipId(data.id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao enviar convite");
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest() {
    if (!friendshipId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipId}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao aceitar");
      setStatus("friends");
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao aceitar convite");
    } finally {
      setLoading(false);
    }
  }

  async function declineOrCancel() {
    if (!friendshipId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipId}/decline`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao recusar");
      setStatus("none");
      setFriendshipId(null);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao recusar convite");
    } finally {
      setLoading(false);
    }
  }

  async function removeFriend() {
    if (!friendshipId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao remover amigo");
      setStatus("none");
      setFriendshipId(null);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao remover amigo");
    } finally {
      setLoading(false);
    }
  }

  if (status === "friends") {
    return (
      <Button
        variant="secondary"
        size={size}
        disabled={loading}
        onClick={removeFriend}
        className={cn("gap-1.5", className)}
      >
        <UserCheck className="h-4 w-4" />
        Amigos
      </Button>
    );
  }

  if (status === "pending_sent") {
    return (
      <Button
        variant="ghost"
        size={size}
        disabled={loading}
        onClick={declineOrCancel}
        className={cn(className)}
      >
        Convite enviado
      </Button>
    );
  }

  if (status === "pending_received") {
    return (
      <div className={cn("flex gap-2", className)}>
        <Button variant="primary" size={size} disabled={loading} onClick={acceptRequest}>
          Aceitar
        </Button>
        <Button variant="ghost" size={size} disabled={loading} onClick={declineOrCancel}>
          Recusar
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      size={size}
      disabled={loading}
      onClick={sendRequest}
      className={cn("gap-1.5", className)}
    >
      <UserPlus className="h-4 w-4" />
      Adicionar
    </Button>
  );
}

export function FriendActionButtonProfile({
  targetUserId,
  friendshipStatus,
  friendshipId,
}: FriendActionButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState(friendshipStatus);
  const [friendshipIdState, setFriendshipId] = useState(friendshipId);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    router.refresh();
  }

  async function sendRequest() {
    setLoading(true);
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao enviar convite");
      setStatus("pending_sent");
      setFriendshipId(data.id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao enviar convite");
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest() {
    if (!friendshipIdState) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipIdState}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao aceitar");
      setStatus("friends");
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao aceitar convite");
    } finally {
      setLoading(false);
    }
  }

  async function declineOrCancel() {
    if (!friendshipIdState) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipIdState}/decline`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro");
      setStatus("none");
      setFriendshipId(null);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  async function removeFriend() {
    if (!friendshipIdState) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipIdState}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro");
      setStatus("none");
      setFriendshipId(null);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  if (status === "friends") {
    return (
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-1 flex items-center justify-center gap-2 p-4 rounded-3xl border-2 border-primary-container bg-primary-container/10">
          <UserCheck className="h-5 w-5 text-primary" />
          <span className="font-bold text-primary">Vocês são amigos</span>
        </div>
        <Button
          variant="ghost"
          size="default"
          disabled={loading}
          onClick={removeFriend}
          className="gap-2"
        >
          <UserMinus className="h-4 w-4" />
          Remover amigo
        </Button>
      </div>
    );
  }

  if (status === "pending_sent") {
    return (
      <div className="flex gap-3">
        <Button variant="secondary" size="default" disabled className="flex-1">
          Convite de amizade enviado
        </Button>
        <Button variant="ghost" size="default" disabled={loading} onClick={declineOrCancel}>
          Cancelar
        </Button>
      </div>
    );
  }

  if (status === "pending_received") {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="default"
          disabled={loading}
          onClick={acceptRequest}
          className="flex-1"
        >
          Aceitar convite de amizade
        </Button>
        <Button variant="ghost" size="default" disabled={loading} onClick={declineOrCancel}>
          Recusar
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      size="default"
      disabled={loading}
      onClick={sendRequest}
      className="w-full gap-2"
    >
      <UserPlus className="h-5 w-5" />
      Adicionar amigo
    </Button>
  );
}
