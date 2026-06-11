/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, Search, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

export interface CreateBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBottomSheet({ isOpen, onClose }: CreateBottomSheetProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectOption = (type: 'penawaran' | 'permintaan' | 'cerita') => {
    onClose();
    if (type === 'cerita') {
      alert('Tulis Cerita Harian: Fitur rilis di V2 JembaTani!');
    } else {
      navigate(ROUTES.POST_CREATE(type));
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      {/* Black Translucent backdrop click outside */}
      <div
        id="sheet-backdrop-dismiss"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 transition-opacity"
      />

      {/* Frame Container */}
      <div
        id="sheet-content-slide"
        className="relative w-full bg-surface rounded-t-xl shadow-2xl flex flex-col z-10 animate-[slideUp_0.3s_ease-out] border-t border-outline-variant"
      >
        {/* Drag Indicator handle */}
        <div className="w-12 h-1 bg-outline-variant/60 rounded-full mx-auto my-3" />

        {/* Header content */}
        <div className="px-5 pb-4 flex items-center justify-between">
          <h3 className="font-fraunces text-headline-md font-bold text-primary">
            Buat Konten Baru
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant active:scale-90 transition-all"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Option cards stack */}
        <div className="px-5 pb-8 space-y-3.5">
          {/* Option 1: Jual Hasil Panen */}
          <button
            onClick={() => handleSelectOption('penawaran')}
            className="w-full text-left p-4.5 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-4 hover:border-primary active:bg-surface-container-low transition-all"
          >
            <div className="p-3 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full shrink-0">
              <ShoppingBag strokeWidth={1.5} className="w-6 h-6" />
            </div>
            <div>
              <span className="font-fraunces text-body-md font-bold text-primary block">
                Jual Hasil Panen (Penawaran)
              </span>
              <span className="text-body-sm text-on-surface-variant font-jakarta mt-0.5 block">
                Posting komoditas panen kebun yang siap kamu jual hari ini
              </span>
            </div>
          </button>

          {/* Option 2: Cari Pemasok */}
          <button
            onClick={() => handleSelectOption('permintaan')}
            className="w-full text-left p-4.5 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-4 hover:border-primary active:bg-surface-container-low transition-all"
          >
            <div className="p-3 bg-primary-fixed text-on-primary-fixed-variant rounded-full shrink-0">
              <Search strokeWidth={1.5} className="w-6 h-6" />
            </div>
            <div>
              <span className="font-fraunces text-body-md font-bold text-primary block">
                Cari Pemasok (Permintaan)
              </span>
              <span className="text-body-sm text-on-surface-variant font-jakarta mt-0.5 block">
                Posting spesifikasi pangan yang sedang kamu cari atau butuhkan
              </span>
            </div>
          </button>

          {/* Option 3: Tulis Cerita */}
          <button
            onClick={() => handleSelectOption('cerita')}
            className="w-full text-left p-4.5 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-4 hover:border-primary active:bg-surface-container-low transition-all"
          >
            <div className="p-3 bg-surface-container text-on-surface-variant rounded-full shrink-0">
              <Sparkles strokeWidth={1.5} className="w-6 h-6" />
            </div>
            <div>
              <span className="font-fraunces text-body-md font-bold text-primary block">
                Tulisan Cerita / Tips Kebun
              </span>
              <span className="text-body-sm text-on-surface-variant font-jakarta mt-0.5 block">
                Bagikan rincian pembibitan organik terbaru atau kiat bertani
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
