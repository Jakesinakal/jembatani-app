-- =============================================================================
-- JembaTani — Fix / Re-apply RLS Policies
-- Run this in Supabase SQL Editor if you got "permission denied for table ..."
-- errors. Idempotent: safe to run multiple times.
-- =============================================================================

-- Make sure RLS is enabled on every table
ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodity_prices  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations      ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "users: public read"   ON public.users;
DROP POLICY IF EXISTS "users: owner update"  ON public.users;

CREATE POLICY "users: public read"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "users: owner update"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);


-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "posts: public read"            ON public.posts;
DROP POLICY IF EXISTS "posts: authenticated insert"   ON public.posts;
DROP POLICY IF EXISTS "posts: owner update"           ON public.posts;
DROP POLICY IF EXISTS "posts: owner delete"           ON public.posts;

CREATE POLICY "posts: public read"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "posts: authenticated insert"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "posts: owner update"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "posts: owner delete"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);


-- ---------------------------------------------------------------------------
-- post_likes
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "post_likes: public read"          ON public.post_likes;
DROP POLICY IF EXISTS "post_likes: authenticated insert" ON public.post_likes;
DROP POLICY IF EXISTS "post_likes: owner delete"         ON public.post_likes;

CREATE POLICY "post_likes: public read"
  ON public.post_likes FOR SELECT
  USING (true);

CREATE POLICY "post_likes: authenticated insert"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_likes: owner delete"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);


-- ---------------------------------------------------------------------------
-- commodities
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "commodities: public read" ON public.commodities;

CREATE POLICY "commodities: public read"
  ON public.commodities FOR SELECT
  USING (true);


-- ---------------------------------------------------------------------------
-- commodity_prices
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "commodity_prices: public read" ON public.commodity_prices;

CREATE POLICY "commodity_prices: public read"
  ON public.commodity_prices FOR SELECT
  USING (true);


-- ---------------------------------------------------------------------------
-- chats
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "chats: participants read"     ON public.chats;
DROP POLICY IF EXISTS "chats: authenticated insert"  ON public.chats;

CREATE POLICY "chats: participants read"
  ON public.chats FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "chats: authenticated insert"
  ON public.chats FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);


-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "messages: participants read"   ON public.messages;
DROP POLICY IF EXISTS "messages: participants insert" ON public.messages;

CREATE POLICY "messages: participants read"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = messages.chat_id
        AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

CREATE POLICY "messages: participants insert"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = messages.chat_id
        AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );


-- ---------------------------------------------------------------------------
-- negotiations
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "negotiations: participants read"   ON public.negotiations;
DROP POLICY IF EXISTS "negotiations: participants insert" ON public.negotiations;
DROP POLICY IF EXISTS "negotiations: participants update" ON public.negotiations;

CREATE POLICY "negotiations: participants read"
  ON public.negotiations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = negotiations.chat_id
        AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

CREATE POLICY "negotiations: participants insert"
  ON public.negotiations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = negotiations.chat_id
        AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

CREATE POLICY "negotiations: participants update"
  ON public.negotiations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = negotiations.chat_id
        AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );
