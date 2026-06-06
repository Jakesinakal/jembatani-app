/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormField } from '@/components/ui/FormField';

export interface CommoditySectionProps {
  commodity: string;
  setCommodity: (v: string) => void;
  customTitle: string;
  setCustomTitle: (v: string) => void;
}

export function CommoditySection({
  commodity,
  setCommodity,
  customTitle,
  setCustomTitle,
}: CommoditySectionProps) {
  return (
    <div className="space-y-4 bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm">
      <FormField label="Nama Komoditas">
        <select
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none"
        >
          <option value="Cabai Merah">🌶️ Cabai Merah Keriting</option>
          <option value="Kentang">🥔 Kentang Granola</option>
          <option value="Tomat">🍅 Tomat Ceri Hidroponik</option>
          <option value="Bawang Merah">🧅 Bawang Merah Brebes</option>
          <option value="Beras IR64">🌾 Beras IR64 Premium</option>
          <option value="Kopi Arabika">☕ Kopi Arabika Papandayan</option>
        </select>
      </FormField>

      <FormField label="Judul Postingan (Opsional)">
        <input
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Contoh: Cabai Cikuray Besar Segar Mulus"
          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none font-jakarta"
        />
      </FormField>
    </div>
  );
}
