import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';

/** Product context carried into a chat when offering on a specific post. */
export interface OfferSeed {
  productName: string;
  productPhoto: string;
  originalPrice: number;
  defaultQuantity: string;
}

/**
 * Opens a chat with another user, creating the thread if it doesn't exist yet.
 * If `offerSeed` is given (user tapped "Tawar/Penuhi" on a post), it's passed
 * along as navigation state so the chat can open an offer form. Used by post cards.
 */
export function useStartChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const startChat = useCallback(
    async (partnerId: string, offerSeed?: OfferSeed) => {
      if (!user || starting) return;
      if (partnerId === user.id) {
        alert('Ini postingan kamu sendiri — tidak bisa menghubungi diri sendiri.');
        return;
      }

      const navState = offerSeed ? { state: { offerSeed } } : undefined;

      setStarting(true);

      // 1. Look for an existing chat between the two users (in either direction).
      const { data: existing, error: findErr } = await supabase
        .from('chats')
        .select('id')
        .or(
          `and(user1_id.eq.${user.id},user2_id.eq.${partnerId}),` +
            `and(user1_id.eq.${partnerId},user2_id.eq.${user.id})`,
        )
        .maybeSingle();

      if (findErr) {
        setStarting(false);
        alert(`Gagal membuka chat: ${findErr.message}`);
        return;
      }

      if (existing) {
        setStarting(false);
        navigate(ROUTES.PESAN_DETAIL(existing.id), navState);
        return;
      }

      // 2. No chat yet — create one.
      const { data: created, error: createErr } = await supabase
        .from('chats')
        .insert({ user1_id: user.id, user2_id: partnerId })
        .select('id')
        .single();

      setStarting(false);

      if (createErr || !created) {
        alert(`Gagal membuat chat: ${createErr?.message ?? 'tidak diketahui'}`);
        return;
      }

      navigate(ROUTES.PESAN_DETAIL(created.id), navState);
    },
    [user, starting, navigate],
  );

  return { startChat, starting };
}
