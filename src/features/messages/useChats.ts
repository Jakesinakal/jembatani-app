import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { ChatConversation } from '@/types/chat';

interface ChatPartner {
  id: string;
  name: string;
  avatar_url: string;
  is_verified: boolean;
}

interface ChatRow {
  id: string;
  user1_id: string;
  user2_id: string;
  user1: ChatPartner;
  user2: ChatPartner;
  messages: { text: string; created_at: string }[];
  negotiations: { status: string }[];
}

/** Format an ISO timestamp to a short `HH:MM` label in Indonesian locale. */
function formatChatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function rowToConversation(row: ChatRow, myId: string): ChatConversation {
  // The "partner" is whichever participant isn't the current user.
  const partner = row.user1_id === myId ? row.user2 : row.user1;
  const lastMsg = row.messages[0]; // ordered newest-first, limited to 1 below
  const hasActiveNegotiation = row.negotiations.some((n) => n.status === 'PENDING');

  return {
    id: row.id,
    partnerName: partner.name,
    partnerAvatar: partner.avatar_url,
    partnerVerified: partner.is_verified,
    lastMessage: lastMsg?.text ?? 'Mulai percakapan...',
    lastMessageTimestamp: lastMsg ? formatChatTime(lastMsg.created_at) : '',
    unreadCount: 0, // schema has no read-tracking yet; always 0 for now
    hasActiveNegotiation,
    messages: [], // the list screen doesn't render individual messages
  };
}

/**
 * Fetches the current user's chat threads for the Pesan list screen.
 * RLS already restricts rows to chats the user participates in.
 */
export function useChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(!!user);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from('chats')
        .select(
          `
          id, user1_id, user2_id,
          user1:users!chats_user1_id_fkey (id, name, avatar_url, is_verified),
          user2:users!chats_user2_id_fkey (id, name, avatar_url, is_verified),
          messages (text, created_at),
          negotiations (status)
        `,
        )
        .order('created_at', { ascending: false })
        .order('created_at', { referencedTable: 'messages', ascending: false })
        .limit(1, { referencedTable: 'messages' });

      if (fetchErr) {
        setError(fetchErr.message);
        setLoading(false);
        return;
      }

      setChats((data as unknown as ChatRow[]).map((row) => rowToConversation(row, user!.id)));
      setLoading(false);
    }

    load();
  }, [user, fetchKey]);

  const refetch = useCallback(() => {
    setFetchKey((k) => k + 1);
  }, []);

  return { chats, loading, error, refetch };
}
