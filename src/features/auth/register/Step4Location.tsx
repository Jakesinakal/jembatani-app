/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check } from 'lucide-react';
import { CROPS_LIST } from '@/lib/constants';
import { toggleItem } from '@/lib/utils';

export interface Step4LocationProps {
  province: string;
  setProvince: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  selectedCrops: string[];
  setSelectedCrops: (v: string[]) => void;
}

export function Step4Location({
  province,
  setProvince,
  city,
  setCity,
  selectedCrops,
  setSelectedCrops,
}: Step4LocationProps) {
  const handleToggleCrop = (crop: string) => {
    setSelectedCrops(toggleItem(selectedCrops, crop));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-fraunces text-headline-md font-bold text-primary mb-2">
          Lokasi & Komoditas Minat
        </h2>
        <p className="font-jakarta text-body-md text-on-surface-variant">
          Sampaikan domisili Anda untuk mengaktifkan ticker harga lokal terdekat.
        </p>
      </div>

      <div className="space-y-6 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/60 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
              Provinsi
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none"
            >
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Jawa Tengah">Jawa Tengah</option>
              <option value="Jawa Timur">Jawa Timur</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
              Kabupaten / Kota
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none"
            >
              <option value="Garut">Garut</option>
              <option value="Brebes">Brebes</option>
              <option value="Cianjur">Cianjur</option>
              <option value="Bandung">Bandung</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
              Pilih Komoditas Minat (
              <span
                className={
                  selectedCrops.length >= 3 ? 'text-primary font-bold' : 'text-secondary font-bold'
                }
              >
                {selectedCrops.length}
              </span>{' '}
              terpilih)
            </label>
            <span className="text-body-sm text-on-surface-variant">Pilih minimal 3</span>
          </div>
          <div id="crop-multiselect-chips" className="flex flex-wrap gap-2 pt-1">
            {CROPS_LIST.map((crop) => {
              const isSelected = selectedCrops.includes(crop);
              return (
                <button
                  key={crop}
                  type="button"
                  onClick={() => handleToggleCrop(crop)}
                  className={`px-4 py-2 text-label-md font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm hover:opacity-90'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {crop}
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
