/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const QUICK_REPLIES = [
  'Siap kirim besok',
  'Harga nego tipis',
  'Kirim foto barang baru',
  'Stok masih cukup',
] as const;

export const CERTIFICATE_OPTIONS = ['ORGANIK', 'GAP CERTIFIED', 'BEBAS PESTISIDA', 'SNI'] as const;

export const CROPS_LIST = [
  'Cabai Merah',
  'Kentang',
  'Tomat',
  'Bawang Merah',
  'Beras IR64',
  'Kopi Arabika',
  'Wortel',
  'Mangga',
] as const;

export const MARKET_COMPARISONS = [
  { market: 'Pasar Induk Caringin, Bandung', priceOffset: -300, term: 'Borongan' },
  { market: 'Pasar Induk Kramat Jati, Jakarta', priceOffset: 1200, term: 'Borongan' },
  { market: 'Pasar Kemiri, Depok', priceOffset: 2400, term: 'Eceran' },
  { market: 'Pasar Induk Johar, Karawang', priceOffset: 400, term: 'Borongan' },
] as const satisfies readonly { market: string; priceOffset: number; term: string }[];
