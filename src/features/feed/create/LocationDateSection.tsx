/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';

export interface LocationDateSectionProps {
  location: string;
  setLocation: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
}

export function LocationDateSection({
  location,
  setLocation,
  date,
  setDate,
}: LocationDateSectionProps) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm space-y-4">
      <div className="space-y-1.5">
        <span className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
          Lokasi Panen / Bongkar
        </span>
        <div className="relative flex items-center">
          <MapPin className="absolute left-3.5 text-secondary w-5 h-5" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant text-body-sm rounded outline-none focus:border-primary font-jakarta"
          />
        </div>
        <button
          type="button"
          onClick={() => setLocation('Kabupaten Bandung, Jawa Barat')}
          className="text-body-sm text-secondary font-bold hover:underline block pt-1"
        >
          🎯 Deteksi Lokasi Sekarang (Simulasi)
        </button>
      </div>

      <FormField label="Tanggal Panen / Siap Kirim">
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Contoh: 30 Mei 2026 atau Panen Kemarin"
          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none font-jakarta"
        />
      </FormField>
    </div>
  );
}
