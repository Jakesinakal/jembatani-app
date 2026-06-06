-- =============================================================================
-- JembaTani — Initial Schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query).
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 1. users
-- ---------------------------------------------------------------------------
CREATE TABLE public.users (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  avatar_url  text        NOT NULL DEFAULT '',
  roles       text[]      NOT NULL DEFAULT '{PETANI}',
  location    text        NOT NULL DEFAULT '',
  is_verified boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);


-- ---------------------------------------------------------------------------
-- 2. posts
-- ---------------------------------------------------------------------------
CREATE TABLE public.posts (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type                 text        NOT NULL CHECK (type IN ('PENAWARAN', 'PERMINTAAN')),
  title                text        NOT NULL,
  price                integer     NOT NULL,
  unit                 text        NOT NULL,
  min_order_retail     text,
  min_order_b2b        text,
  quantity_needed      text,
  budget_price         integer,
  stock_available      text,
  photo_url            text        NOT NULL DEFAULT '',
  location             text        NOT NULL,
  harvest_or_needed_date text,
  certifications       text[]      NOT NULL DEFAULT '{}',
  caption              text        NOT NULL DEFAULT '',
  created_at           timestamptz NOT NULL DEFAULT now()
);


-- ---------------------------------------------------------------------------
-- 3. post_likes
-- ---------------------------------------------------------------------------
CREATE TABLE public.post_likes (
  post_id    uuid        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);


-- ---------------------------------------------------------------------------
-- 4. commodities
-- ---------------------------------------------------------------------------
CREATE TABLE public.commodities (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name     text NOT NULL,
  category text NOT NULL CHECK (category IN ('SAYURAN', 'BUAH', 'PADI', 'REMPAH', 'PERKEBUNAN')),
  photo    text NOT NULL DEFAULT '',
  unit     text NOT NULL
);


-- ---------------------------------------------------------------------------
-- 5. commodity_prices
-- ---------------------------------------------------------------------------
CREATE TABLE public.commodity_prices (
  id           uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_id uuid    NOT NULL REFERENCES public.commodities(id) ON DELETE CASCADE,
  date         date    NOT NULL,
  price        integer NOT NULL,
  UNIQUE (commodity_id, date)
);


-- ---------------------------------------------------------------------------
-- 6. chats
-- ---------------------------------------------------------------------------
CREATE TABLE public.chats (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id   uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user2_id   uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- ---------------------------------------------------------------------------
-- 7. messages
-- ---------------------------------------------------------------------------
CREATE TABLE public.messages (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id    uuid        NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id  uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  text       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- ---------------------------------------------------------------------------
-- 8. negotiations
-- ---------------------------------------------------------------------------
CREATE TABLE public.negotiations (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id           uuid        NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  product_name      text        NOT NULL,
  product_photo     text        NOT NULL DEFAULT '',
  quantity          text        NOT NULL,
  original_price    integer     NOT NULL,
  last_price_offer  integer     NOT NULL,
  status            text        NOT NULL DEFAULT 'PENDING'
                                CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);


-- =============================================================================
-- TRIGGER: auto-create public.users row on new auth sign-up
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX idx_posts_user_id        ON public.posts (user_id);
CREATE INDEX idx_posts_created_at     ON public.posts (created_at DESC);
CREATE INDEX idx_cp_commodity_id      ON public.commodity_prices (commodity_id);
CREATE INDEX idx_cp_date              ON public.commodity_prices (date DESC);
CREATE INDEX idx_messages_chat_id     ON public.messages (chat_id);
CREATE INDEX idx_messages_created_at  ON public.messages (created_at);


-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodity_prices  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations      ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- users policies
-- ---------------------------------------------------------------------------
CREATE POLICY "users: public read"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "users: owner update"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);


-- ---------------------------------------------------------------------------
-- posts policies
-- ---------------------------------------------------------------------------
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
-- post_likes policies
-- ---------------------------------------------------------------------------
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
-- commodities policies (read-only via RLS; managed via service role)
-- ---------------------------------------------------------------------------
CREATE POLICY "commodities: public read"
  ON public.commodities FOR SELECT
  USING (true);


-- ---------------------------------------------------------------------------
-- commodity_prices policies
-- ---------------------------------------------------------------------------
CREATE POLICY "commodity_prices: public read"
  ON public.commodity_prices FOR SELECT
  USING (true);


-- ---------------------------------------------------------------------------
-- chats policies
-- ---------------------------------------------------------------------------
CREATE POLICY "chats: participants read"
  ON public.chats FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "chats: authenticated insert"
  ON public.chats FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);


-- ---------------------------------------------------------------------------
-- messages policies
-- ---------------------------------------------------------------------------
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
-- negotiations policies
-- ---------------------------------------------------------------------------
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
