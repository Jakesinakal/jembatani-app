/**
 * Set foto profil akun demo JembaTani langsung di Supabase.
 *
 * Upload public/Bemo.jpg ke bucket "avatars", lalu update kolom
 * public.users.avatar_url milik akun demo (lewat RLS "user boleh update baris
 * sendiri" — sama seperti tombol ganti foto di halaman Akun).
 *
 * Pemakaian:
 *   npx tsx scripts/set-demo-avatar.ts          # mode CEK (read-only)
 *   npx tsx scripts/set-demo-avatar.ts --run    # upload + update DB
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
config({ path: join(ROOT, '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const DEMO_EMAIL = process.env.SEED_EMAIL ?? 'demo@jembatani.app';
const DEMO_PASSWORD = process.env.SEED_PASSWORD ?? 'JembaTani2026';
const BUCKET = 'avatars';
const PHOTO = join(ROOT, 'scripts', 'Bemo.jpg');
const RUN = process.argv.includes('--run');

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY tidak ada di .env.local');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log(`Mode: ${RUN ? 'JALAN (--run)' : 'CEK (read-only)'}\n`);

  const { data: auth, error: signInErr } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
  if (signInErr || !auth.user) {
    console.error(`❌ Login gagal sebagai ${DEMO_EMAIL}: ${signInErr?.message}`);
    process.exit(1);
  }
  const userId = auth.user.id;
  console.log(`✓ Login sebagai ${DEMO_EMAIL} (id: ${userId})`);

  const { data: before, error: readErr } = await supabase
    .from('users')
    .select('id, name, avatar_url')
    .eq('id', userId)
    .single();
  if (readErr) {
    console.error(`❌ Gagal baca baris users: ${readErr.message}`);
    process.exit(1);
  }
  console.log(`  Nama        : ${before.name}`);
  console.log(`  Avatar saat ini: ${before.avatar_url ?? '(kosong)'}\n`);

  if (!RUN) {
    console.log('Ini mode CEK. Kalau benar ini akun demo-nya, jalankan:');
    console.log('  npx tsx scripts/set-demo-avatar.ts --run');
    return;
  }

  // 1. Upload foto ke bucket avatars (upsert: bucket avatars punya policy overwrite).
  const path = `${userId}/avatar.jpg`;
  const buffer = readFileSync(PHOTO);
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: 'image/jpeg', upsert: true });
  if (upErr) {
    console.error(`❌ Upload ke storage gagal: ${upErr.message}`);
    process.exit(1);
  }
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  // Cache-bust supaya browser tidak menahan versi lama di path yang sama.
  const publicUrl = `${pub.publicUrl}?v=${Date.now()}`;
  console.log(`✓ Foto terupload: ${publicUrl}`);

  // 2. Update kolom avatar_url milik akun demo.
  const { error: updErr } = await supabase
    .from('users')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);
  if (updErr) {
    console.error(`❌ Update users.avatar_url gagal: ${updErr.message}`);
    process.exit(1);
  }

  const { data: after } = await supabase
    .from('users')
    .select('avatar_url')
    .eq('id', userId)
    .single();
  console.log(`✓ users.avatar_url sekarang: ${after?.avatar_url}`);
  console.log('\nSelesai. Foto profil akun demo sudah tersimpan di Supabase.');
}

main();
