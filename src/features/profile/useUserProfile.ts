import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ProfileData {
  id: string;
  name: string;
  avatarUrl: string;
  roles: string[];
  location: string;
  isVerified: boolean;
  postsCount: number;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(!!user);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoading(true);
      setError(null);

      const { data: row, error: profileErr } = await supabase
        .from('users')
        .select('id, name, avatar_url, roles, location, is_verified')
        .eq('id', user!.id)
        .single();

      if (profileErr) {
        setError(profileErr.message);
        setLoading(false);
        return;
      }

      const { count, error: countErr } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user!.id);

      if (countErr) {
        setError(countErr.message);
        setLoading(false);
        return;
      }

      setProfile({
        id: row.id,
        name: row.name,
        avatarUrl: row.avatar_url,
        roles: row.roles,
        location: row.location,
        isVerified: row.is_verified,
        postsCount: count ?? 0,
      });
      setLoading(false);
    }

    load();
  }, [user, fetchKey]);

  const refetch = useCallback(() => {
    setFetchKey((k) => k + 1);
  }, []);

  return { profile, loading, error, refetch };
}
