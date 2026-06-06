-- =============================================================================
-- JembaTani — Enable Realtime for chat
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query).
--
-- Adds `messages` and `negotiations` to the `supabase_realtime` publication so
-- the client can subscribe to live INSERT/UPDATE events. RLS still applies, so
-- a user only receives changes for chats they participate in.
--
-- Idempotent: safe to run more than once.
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'negotiations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.negotiations;
  END IF;
END $$;
