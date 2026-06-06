/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formats a number into Indonesian Rupiah (e.g., Rp 35.000)
 */
export function formatRupiah(value: number): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  // Replace the default spacing or format if needed to match standard IDR representation
  return formatted.replace('Rp', 'Rp ');
}

/**
 * Generates relative time representation in Bahasa Indonesia
 */
export function formatRelativeTime(hoursAgo: number): string {
  if (hoursAgo < 1) {
    return 'Baru saja';
  }
  if (hoursAgo < 24) {
    return `${Math.round(hoursAgo)}j lalu`;
  }
  const days = Math.round(hoursAgo / 24);
  return `${days}h lalu`;
}

/**
 * Extracts initials from names (e.g., Pak Budi -> PB, Siti Nur Haliza -> SH).
 * Uses first + last word. Returns fallback for empty/missing name.
 */
export function getInitials(name: string, fallback = ''): string {
  if (!name) return fallback;
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Returns current time as a locale string in id-ID HH:MM format. */
export function formatTimestamp(): string {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

/** Toggles an item in an array: removes it if present, appends it if absent. */
export function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}
