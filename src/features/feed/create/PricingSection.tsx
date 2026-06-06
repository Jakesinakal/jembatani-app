/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormField } from '@/components/ui/FormField';
import { PostType } from '@/types/post';

export interface PricingSectionProps {
  unit: string;
  setUnit: (v: string) => void;
  stock: string;
  setStock: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  listingType: PostType;
}

export function PricingSection({
  unit,
  setUnit,
  stock,
  setStock,
  price,
  setPrice,
  listingType,
}: PricingSectionProps) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Satuan Takar">
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none"
          >
            <option value="kg">kilogram (kg)</option>
            <option value="ton">ton</option>
            <option value="karung">karung</option>
            <option value="kotak">kotak</option>
          </select>
        </FormField>

        <FormField label={listingType === 'PENAWARAN' ? 'Stok Tersedia' : 'Jumlah Kebutuhan'}>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none font-jakarta"
          />
        </FormField>
      </div>

      <FormField
        label={listingType === 'PENAWARAN' ? 'Patokan Harga (Rupiah)' : 'Anggaran Maks (Rupiah)'}
      >
        <div className="relative flex items-center">
          <span className="absolute left-4 font-fraunces font-bold text-secondary text-body-lg tabular-nums">
            Rp
          </span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-surface-container-low border border-outline-variant text-secondary font-bold text-headline-md rounded focus:border-primary outline-none"
          />
          <span className="absolute right-4 font-bold text-body-sm text-on-surface-variant">
            /{unit}
          </span>
        </div>
      </FormField>
    </div>
  );
}
