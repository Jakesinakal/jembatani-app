import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Post, PostType } from '@/types/post';

interface PostRow {
  id: string;
  type: PostType;
  title: string;
  price: number;
  unit: string;
  min_order_retail: string | null;
  min_order_b2b: string | null;
  quantity_needed: string | null;
  budget_price: number | null;
  stock_available: string | null;
  photo_url: string;
  location: string;
  harvest_or_needed_date: string | null;
  certifications: string[];
  caption: string;
  created_at: string;
  users: {
    id: string;
    name: string;
    avatar_url: string;
    location: string;
    is_verified: boolean;
  };
  post_likes: { user_id: string }[];
}

function rowToPost(row: PostRow, currentUserId: string | undefined): Post {
  const hoursAgo = (Date.now() - new Date(row.created_at).getTime()) / (1000 * 60 * 60);
  return {
    id: row.id,
    author: {
      id: row.users.id,
      name: row.users.name,
      avatar: row.users.avatar_url,
      location: row.users.location,
      isVerified: row.users.is_verified,
    },
    type: row.type,
    title: row.title,
    price: row.price,
    unit: row.unit,
    minOrderRetail: row.min_order_retail ?? '-',
    minOrderB2B: row.min_order_b2b ?? '-',
    quantityNeeded: row.quantity_needed ?? undefined,
    budgetPrice: row.budget_price ?? undefined,
    stockAvailable: row.stock_available ?? undefined,
    photoUrl: row.photo_url,
    location: row.location,
    harvestOrNeededDate: row.harvest_or_needed_date ?? '',
    certifications: row.certifications,
    caption: row.caption,
    likesCount: row.post_likes.length,
    commentsCount: 0,
    sharesCount: 0,
    isLiked: currentUserId ? row.post_likes.some((l) => l.user_id === currentUserId) : false,
    hoursAgo: Math.max(0.1, hoursAgo),
  };
}

export function useFeedPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from('posts')
        .select(
          `
          *,
          users!posts_user_id_fkey (id, name, avatar_url, location, is_verified),
          post_likes (user_id)
        `,
        )
        .order('created_at', { ascending: false });

      if (fetchErr) {
        setError(fetchErr.message);
        setLoading(false);
        return;
      }

      setPosts((data as PostRow[]).map((row) => rowToPost(row, user?.id)));
      setLoading(false);
    }

    load();
  }, [user?.id, fetchKey]);

  const refetch = useCallback(() => {
    setFetchKey((k) => k + 1);
  }, []);

  const handleLikePost = async (postId: string) => {
    if (!user) return;

    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const wasLiked = post.isLiked;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          isLiked: !wasLiked,
          likesCount: wasLiked ? p.likesCount - 1 : p.likesCount + 1,
        };
      }),
    );

    if (wasLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
    }
  };

  return { posts, loading, error, refetch, handleLikePost };
}
