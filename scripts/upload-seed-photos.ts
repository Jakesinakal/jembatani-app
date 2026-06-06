/**
 * Seed photo uploader untuk JembaTani.
 *
 * Upload foto lokal ke Supabase Storage (bucket "post-images"), lalu cetak SQL
 * UPDATE untuk dijalankan di Supabase SQL Editor.
 *
 *   foto/*.jpg            → posts.photo_url   (pemetaan eksplisit di POST_MAP)
 *   foto/foto_harga/*.jpg → commodities.photo (dicocokkan otomatis ke commodities.name)
 *
 * Pemakaian:
 *   npx tsx scripts/upload-seed-photos.ts          # mode CEK (read-only, tidak upload)
 *   npx tsx scripts/upload-seed-photos.ts --run    # upload + cetak SQL
 *
 * Catatan: update tabel commodities harus lewat SQL Editor — RLS-nya hanya
 * mengizinkan public read, jadi UPDATE dari client akan diam-diam diblokir.
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { basename, dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
config({ path: join(ROOT, '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const DEMO_EMAIL = process.env.SEED_EMAIL ?? 'demo@jembatani.app';
const DEMO_PASSWORD = process.env.SEED_PASSWORD ?? 'JembaTani2026';
const BUCKET = 'post-images';
const RUN = process.argv.includes('--run');

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

// Pemetaan eksplisit foto postingan → judul post (hasil konfirmasi user).
// File di folder foto/ yang TIDAK terdaftar di sini sengaja tidak diupload.
const POST_MAP: Record<string, string> = {
  'Cabe Gacor.jpg': 'Cabe gacor',
  'Cabe Merah.jpg': 'Cabai Merah Butuh Cepat Grade A',
  'Cabe Keriting.jpg': 'Cabai Merah Keriting Grade A',
  'Butuh Cabai Merah.jpg': 'Butuh Cabai Merah Rutin Mingguan',
};

type Group = {
  label: string;
  dir: string;
  storagePrefix: string;
  table: 'posts' | 'commodities';
  column: 'photo_url' | 'photo';
  matchColumn: 'title' | 'name';
  map?: Record<string, string>; // nama file -> nilai matchColumn; kalau ada, dipakai gantikan auto-match
  aliases?: Record<string, string>; // nama file -> nilai matchColumn, override saat nama file beda ejaan
};

const GROUPS: Group[] = [
  {
    label: 'Postingan',
    dir: join(ROOT, 'foto'),
    storagePrefix: 'seed/posts',
    table: 'posts',
    column: 'photo_url',
    matchColumn: 'title',
    map: POST_MAP,
  },
  {
    label: 'Harga / Komoditas',
    dir: join(ROOT, 'foto', 'foto_harga'),
    storagePrefix: 'seed/commodities',
    table: 'commodities',
    column: 'photo',
    matchColumn: 'name',
    // Nama file "Cabe Rawit" beda ejaan dgn komoditas "Cabai Rawit" → diarahkan manual.
    aliases: { 'Cabe Rawit.jpg': 'Cabai Rawit' },
  },
];

function listImages(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && IMAGE_EXT.includes(extname(d.name).toLowerCase()))
    .map((d) => d.name)
    .sort();
}

function keywordOf(filename: string): string {
  return basename(filename, extname(filename)).trim().toLowerCase();
}

/** Nama file aman untuk storage key: tanpa spasi / karakter aneh. */
function safeKey(filename: string): string {
  const ext = extname(filename).toLowerCase();
  const slug = basename(filename, extname(filename))
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return `${slug}${ext}`;
}

function contentTypeOf(filename: string): string {
  const ext = extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY tidak ada di .env.local');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log(`Mode: ${RUN ? 'UPLOAD (--run)' : 'CEK (read-only, tidak upload)'}\n`);

  // Login wajib: upload ke storage butuh auth.uid() (lihat policy bucket post-images).
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
  if (signInErr) {
    console.error(`❌ Login gagal sebagai ${DEMO_EMAIL}: ${signInErr.message}`);
    console.error('   Upload ke storage butuh akun login. Cek akun demo / kredensialnya.');
    process.exit(1);
  }
  console.log(`✓ Login berhasil sebagai ${DEMO_EMAIL}\n`);

  const sqlLines: string[] = [];
  let totalPhotos = 0;
  let totalMatched = 0;

  for (const g of GROUPS) {
    const files = listImages(g.dir);
    totalPhotos += files.length;
    console.log(`── ${g.label}: ${files.length} foto → tabel "${g.table}"`);

    const { data, error: selErr } = await supabase.from(g.table).select(`id, ${g.matchColumn}`);
    if (selErr) {
      console.error(`   ❌ Gagal baca tabel ${g.table}: ${selErr.message}\n`);
      continue;
    }
    const rows = (data ?? []) as Record<string, string>[];

    // Tentukan pasangan (filename → row) sesuai mode (peta eksplisit / auto-match).
    const jobs: { filename: string; row: Record<string, string> }[] = [];

    if (g.map) {
      for (const [filename, targetVal] of Object.entries(g.map)) {
        if (!files.includes(filename)) {
          console.log(`   ✗ ${filename} → file tidak ada di folder`);
          continue;
        }
        const row = rows.find(
          (r) => String(r[g.matchColumn] ?? '').toLowerCase() === targetVal.toLowerCase(),
        );
        if (!row) {
          console.log(`   ✗ ${filename} → ${g.matchColumn} "${targetVal}" tidak ditemukan di DB`);
          continue;
        }
        jobs.push({ filename, row });
        console.log(`   ✓ ${filename} → ${g.matchColumn} "${row[g.matchColumn]}"`);
      }
      const unused = files.filter((f) => !(f in g.map!));
      if (unused.length) console.log(`   – tidak dipakai: ${unused.join(', ')}`);
    } else {
      for (const filename of files) {
        const kw = g.aliases?.[filename]?.toLowerCase() ?? keywordOf(filename);
        const candidates = rows.filter((r) => {
          const val = String(r[g.matchColumn] ?? '').toLowerCase();
          return val === kw || val.includes(kw);
        });
        if (candidates.length === 0) {
          console.log(`   ✗ ${filename} → tidak ada ${g.matchColumn} yang cocok`);
          continue;
        }
        if (candidates.length > 1) {
          const names = candidates.map((c) => `"${c[g.matchColumn]}"`).join(', ');
          console.log(`   ⚠ ${filename} → cocok ke >1 baris (${names}); dilewati`);
          continue;
        }
        jobs.push({ filename, row: candidates[0] });
        console.log(`   ✓ ${filename} → ${g.matchColumn} "${candidates[0][g.matchColumn]}"`);
      }
    }

    totalMatched += jobs.length;

    if (RUN) {
      for (const { filename, row } of jobs) {
        const storagePath = `${g.storagePrefix}/${safeKey(filename)}`;
        const buffer = readFileSync(join(g.dir, filename));
        // upsert:false — bucket post-images tidak punya policy UPDATE, jadi object
        // yang sudah ada tidak bisa (dan tidak perlu) ditimpa. "Already exists" = sukses.
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, buffer, { contentType: contentTypeOf(filename), upsert: false });
        const sudahAda = upErr && /already exists|duplicate|\b409\b/i.test(upErr.message);
        if (upErr && !sudahAda) {
          console.log(`      ❌ upload ${filename} gagal: ${upErr.message}`);
          continue;
        }
        if (sudahAda) console.log(`      • ${filename} sudah ada di storage (dipakai ulang)`);
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
        sqlLines.push(
          `UPDATE public.${g.table} SET ${g.column} = '${pub.publicUrl}' WHERE id = '${row.id}'; -- ${row[g.matchColumn]}`,
        );
      }
    }
    console.log('');
  }

  console.log(`Ringkasan: ${totalMatched}/${totalPhotos} foto akan dipasang ke baris DB.`);

  if (!RUN) {
    console.log('\nIni mode CEK — belum ada yang diupload.');
    console.log(
      'Kalau hasil di atas sudah benar, jalankan: npx tsx scripts/upload-seed-photos.ts --run',
    );
    return;
  }

  if (sqlLines.length === 0) {
    console.log('\nTidak ada foto yang berhasil diupload. Tidak ada SQL.');
    return;
  }

  console.log('\n--- SQL untuk dijalankan di Supabase → SQL Editor → Run ---\n');
  console.log(sqlLines.join('\n'));
  console.log('\n-----------------------------------------------------------');
  console.log(`\n${sqlLines.length} baris UPDATE. Copy semua, paste ke SQL Editor, Run.`);
}

main();
