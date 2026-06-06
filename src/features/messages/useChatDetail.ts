import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { formatRupiah } from '@/lib/utils';
import type {
  ChatConversation,
  ChatMessage,
  NegotiationDetails,
  NegotiationStatus,
} from '@/types/chat';

interface MessageRow {
  id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

interface NegotiationRow {
  id: string;
  product_name: string;
  product_photo: string;
  quantity: string;
  original_price: number;
  last_price_offer: number;
  status: NegotiationStatus;
  created_at: string;
}

interface ChatPartner {
  id: string;
  name: string;
  avatar_url: string;
  is_verified: boolean;
}

interface ChatDetailRow {
  id: string;
  user1_id: string;
  user2_id: string;
  user1: ChatPartner;
  user2: ChatPartner;
  messages: MessageRow[];
  negotiations: NegotiationRow[];
}

/** Data needed to start a new negotiation, seeded from a post. */
export interface NegotiationSeed {
  productName: string;
  productPhoto: string;
  quantity: string;
  originalPrice: number;
  offerPrice: number;
}

/** Format an ISO timestamp to a short `HH:MM` label in Indonesian locale. */
function formatClockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function mapMessage(row: MessageRow, myId: string | undefined): ChatMessage {
  return {
    id: row.id,
    sender: row.sender_id === myId ? 'ME' : 'PARTNER',
    text: row.text,
    timestamp: formatClockTime(row.created_at),
  };
}

function rowToNegotiation(row: NegotiationRow): NegotiationDetails {
  return {
    productName: row.product_name,
    productPhoto: row.product_photo,
    quantity: row.quantity,
    originalPrice: row.original_price,
    lastPriceOffer: row.last_price_offer,
    status: row.status,
  };
}

/** Prefer an active (PENDING) negotiation; otherwise fall back to the newest. */
function pickNegotiation(rows: NegotiationRow[]): NegotiationRow | undefined {
  const sorted = [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at));
  return sorted.find((n) => n.status === 'PENDING') ?? sorted[0];
}

/**
 * Loads a single chat (partner + messages + negotiation) and keeps it live via
 * Supabase realtime subscriptions on `messages` and `negotiations`. Exposes
 * helpers to send messages and to create/accept/counter a negotiation.
 */
export function useChatDetail(chatId: string | undefined) {
  const { user } = useAuth();
  const [chat, setChat] = useState<ChatConversation | null>(null);
  const [negotiationId, setNegotiationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch of the full thread.
  useEffect(() => {
    if (!chatId || !user) return;
    let cancelled = false;

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
          messages (id, sender_id, text, created_at),
          negotiations (id, product_name, product_photo, quantity, original_price, last_price_offer, status, created_at)
        `,
        )
        .eq('id', chatId)
        .order('created_at', { referencedTable: 'messages', ascending: true })
        .single();

      if (cancelled) return;

      if (fetchErr) {
        setError(fetchErr.message);
        setChat(null);
        setLoading(false);
        return;
      }

      const row = data as unknown as ChatDetailRow;
      const partner = row.user1_id === user!.id ? row.user2 : row.user1;
      const neg = pickNegotiation(row.negotiations);
      const negotiationInfo = neg ? rowToNegotiation(neg) : undefined;
      const messages = row.messages.map((m) => mapMessage(m, user!.id));

      setNegotiationId(neg?.id ?? null);
      setChat({
        id: row.id,
        partnerName: partner.name,
        partnerAvatar: partner.avatar_url,
        partnerVerified: partner.is_verified,
        lastMessage: messages[messages.length - 1]?.text ?? '',
        lastMessageTimestamp: '',
        unreadCount: 0,
        hasActiveNegotiation: negotiationInfo?.status === 'PENDING',
        negotiationInfo,
        messages,
      });
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [chatId, user]);

  // Append one message row, deduped by id (used by both realtime and send).
  const appendMessage = useCallback(
    (row: MessageRow) => {
      setChat((prev) => {
        if (!prev) return prev;
        if (prev.messages.some((m) => m.id === row.id)) return prev;
        return {
          ...prev,
          messages: [...prev.messages, mapMessage(row, user?.id)],
          lastMessage: row.text,
        };
      });
    },
    [user?.id],
  );

  // Apply a negotiation row to local state (used by both realtime and actions).
  const applyNegotiation = useCallback((row: NegotiationRow) => {
    setNegotiationId(row.id);
    setChat((prev) =>
      prev
        ? {
            ...prev,
            hasActiveNegotiation: row.status === 'PENDING',
            negotiationInfo: rowToNegotiation(row),
          }
        : prev,
    );
  }, []);

  // Realtime: new messages + negotiation changes in this chat.
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => appendMessage(payload.new as MessageRow),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'negotiations', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          if (payload.eventType !== 'DELETE') applyNegotiation(payload.new as NegotiationRow);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, appendMessage, applyNegotiation]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !chatId || !user) return;

      const { data, error: sendErr } = await supabase
        .from('messages')
        .insert({ chat_id: chatId, sender_id: user.id, text: trimmed })
        .select('id, sender_id, text, created_at')
        .single();

      if (sendErr || !data) {
        alert(`Gagal mengirim pesan: ${sendErr?.message ?? 'tidak diketahui'}`);
        return;
      }

      appendMessage(data as MessageRow);
    },
    [chatId, user, appendMessage],
  );

  // Accept the active negotiation → status ACCEPTED + a "deal" system message.
  const acceptNegotiation = useCallback(async () => {
    if (!negotiationId) return;
    const info = chat?.negotiationInfo;

    const { error: updErr } = await supabase
      .from('negotiations')
      .update({ status: 'ACCEPTED', updated_at: new Date().toISOString() })
      .eq('id', negotiationId);

    if (updErr) {
      alert(`Gagal menyetujui negosiasi: ${updErr.message}`);
      return;
    }

    setChat((prev) =>
      prev && prev.negotiationInfo
        ? {
            ...prev,
            hasActiveNegotiation: false,
            negotiationInfo: { ...prev.negotiationInfo, status: 'ACCEPTED' },
          }
        : prev,
    );

    if (info) {
      await sendMessage(
        `🤝 NEGOSIASI DISEPAKATI! Harga ${formatRupiah(info.lastPriceOffer)} untuk ${info.quantity} disetujui. Pesanan resmi dibuat.`,
      );
    }
  }, [negotiationId, chat, sendMessage]);

  // Counter the active negotiation with a new price (stays PENDING).
  const counterOffer = useCallback(
    async (newPrice: number) => {
      if (!negotiationId || !Number.isFinite(newPrice) || newPrice <= 0) return;

      const { error: updErr } = await supabase
        .from('negotiations')
        .update({ last_price_offer: newPrice, updated_at: new Date().toISOString() })
        .eq('id', negotiationId);

      if (updErr) {
        alert(`Gagal mengirim tawaran balik: ${updErr.message}`);
        return;
      }

      setChat((prev) =>
        prev && prev.negotiationInfo
          ? { ...prev, negotiationInfo: { ...prev.negotiationInfo, lastPriceOffer: newPrice } }
          : prev,
      );

      await sendMessage(`Saya mengajukan penawaran balik ${formatRupiah(newPrice)}.`);
    },
    [negotiationId, sendMessage],
  );

  // Create a new negotiation seeded from a post.
  const createNegotiation = useCallback(
    async (seed: NegotiationSeed) => {
      if (!chatId) return;

      const { data, error: insErr } = await supabase
        .from('negotiations')
        .insert({
          chat_id: chatId,
          product_name: seed.productName,
          product_photo: seed.productPhoto,
          quantity: seed.quantity,
          original_price: seed.originalPrice,
          last_price_offer: seed.offerPrice,
          status: 'PENDING',
        })
        .select(
          'id, product_name, product_photo, quantity, original_price, last_price_offer, status, created_at',
        )
        .single();

      if (insErr || !data) {
        alert(`Gagal membuat penawaran: ${insErr?.message ?? 'tidak diketahui'}`);
        return;
      }

      applyNegotiation(data as NegotiationRow);
      await sendMessage(
        `Halo, saya ingin menawar ${seed.productName} sebanyak ${seed.quantity} di harga ${formatRupiah(seed.offerPrice)}.`,
      );
    },
    [chatId, applyNegotiation, sendMessage],
  );

  return {
    chat,
    loading,
    error,
    sendMessage,
    acceptNegotiation,
    counterOffer,
    createNegotiation,
  };
}
