-- =============================================================================
-- JembaTani — Storage Buckets & Policies
-- Run this in Supabase SQL Editor (Project → SQL Editor → New query).
-- =============================================================================

-- Create buckets (public = images can be viewed without auth)
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;


-- ---------------------------------------------------------------------------
-- post-images policies
-- ---------------------------------------------------------------------------
CREATE POLICY "post-images: anyone can view"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "post-images: authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "post-images: owner can delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);


-- ---------------------------------------------------------------------------
-- avatars policies
-- ---------------------------------------------------------------------------
CREATE POLICY "avatars: anyone can view"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars: authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "avatars: owner can overwrite"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
