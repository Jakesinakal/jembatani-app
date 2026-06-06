import { supabase } from './supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadImage(
  bucket: string,
  file: File,
  path: string,
  options?: { upsert?: boolean },
): Promise<{ url: string | null; error: string | null }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: null, error: 'Format file harus JPEG, PNG, atau WebP.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { url: null, error: 'Ukuran file maksimal 5 MB.' };
  }

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: options?.upsert ?? false,
    contentType: file.type,
  });

  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
