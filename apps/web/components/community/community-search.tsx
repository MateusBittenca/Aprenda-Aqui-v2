"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { FriendActionButton } from "@/components/community/friend-action-button";
import { UserAvatar } from "@/components/community/user-avatar";
import type { FriendshipView } from "@/lib/community";
import { formatNumber } from "@/lib/utils";

interface SearchUser {
  id: string;
  name: string;
  image: string | null;
  xpTotal: number;
  friendshipStatus: FriendshipView;
  friendshipId: string | null;
}

export function CommunitySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (res.ok) setResults(data.users ?? []);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-surface-container-highest bg-surface-container-low text-on-background font-medium placeholder:text-outline focus:outline-none focus:border-primary-container"
        />
      </div>

      {loading && (
        <p className="text-sm text-on-surface-variant text-center py-2">Buscando...</p>
      )}

      {!loading && query.trim().length >= 2 && results.length === 0 && (
        <p className="text-sm text-on-surface-variant text-center py-4">
          Nenhum usuário encontrado com esse nome.
        </p>
      )}

      <div className="space-y-2">
        {results.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-3 rounded-2xl border-2 border-surface-container-highest hover:bg-primary-container/5 transition-colors"
          >
            <UserAvatar userId={user.id} name={user.name} image={user.image} size="sm" />
            <div className="flex-1 min-w-0">
              <Link
                href={`/perfil/${user.id}`}
                className="font-bold text-on-background hover:text-primary truncate block"
              >
                {user.name}
              </Link>
              <p className="text-xs text-on-surface-variant">{formatNumber(user.xpTotal)} XP</p>
            </div>
            <FriendActionButton
              targetUserId={user.id}
              friendshipStatus={user.friendshipStatus}
              friendshipId={user.friendshipId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
