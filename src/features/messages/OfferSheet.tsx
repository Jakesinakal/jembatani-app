/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';

export interface OfferSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  productName: string;
  productPhoto?: string;
  originalPrice: number;
  initialQuantity: string;
  initialPrice: number;
  /** When false, quantity is shown read-only (used for counter offers). */
  quantityEditable: boolean;
  submitLabel: string;
  onSubmit: (values: { quantity: string; price: number }) => void;
}

export function OfferSheet({
  open,
  onClose,
  title,
  productName,
  productPhoto,
  originalPrice,
  initialQuantity,
  initialPrice,
  quantityEditable,
  submitLabel,
  onSubmit,
}: OfferSheetProps) {
  // Fresh-mounted each time the sheet opens, so initialize straight from props.
  const [quantity, setQuantity] = useState(initialQuantity);
  const [price, setPrice] = useState(initialPrice ? String(initialPrice) : '');

  if (!open) return null;

  const priceNum = parseInt(price, 10);
  const isValid = quantity.trim() !== '' && Number.isFinite(priceNum) && priceNum > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({ quantity: quantity.trim(), price: priceNum });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/50 transition-opacity" />

      {/* Panel */}
      <div className="relative w-full max-w-[480px] bg-surface rounded-t-xl shadow-2xl flex flex-col z-10 animate-[slideUp_0.3s_ease-out] border-t border-outline-variant">
        <div className="w-12 h-1 bg-outline-variant/60 rounded-full mx-auto my-3" />

        {/* Header */}
        <div className="px-5 pb-4 flex items-center justify-between">
          <h3 className="font-fraunces text-headline-md font-bold text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant active:scale-90 transition-all"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        <div className="px-5 pb-8 space-y-5">
          {/* Product reference */}
          <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant rounded-lg p-3">
            {productPhoto ? (
              <img
                src={productPhoto}
                alt={productName}
                className="w-12 h-12 rounded object-cover border border-outline-variant shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <div className="min-w-0">
              <h4 className="font-fraunces font-bold text-body-sm text-primary leading-tight truncate">
                {productName}
              </h4>
              <p className="font-jakarta text-body-sm text-on-surface-variant mt-0.5">
                Harga tertera:{' '}
                <b className="font-fraunces font-bold tabular-nums">
                  {formatRupiah(originalPrice)}
                </b>
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-label-md font-bold font-jakarta text-on-surface mb-1.5">
              Jumlah
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              readOnly={!quantityEditable}
              placeholder="cth: 100 kg"
              className={`w-full px-4 py-2.5 border border-outline-variant rounded outline-none text-body-sm font-jakarta focus:border-primary focus:ring-1 focus:ring-primary ${
                quantityEditable
                  ? 'bg-surface-container-lowest text-on-surface'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            />
          </div>

          {/* Offer price */}
          <div>
            <label className="block text-label-md font-bold font-jakarta text-on-surface mb-1.5">
              Harga tawaranmu (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="cth: 32000"
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded outline-none text-body-sm font-jakarta text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {isValid && (
              <p className="font-jakarta text-body-sm text-on-surface-variant mt-1.5">
                ≈{' '}
                <b className="font-fraunces font-bold text-secondary tabular-nums">
                  {formatRupiah(priceNum)}
                </b>
              </p>
            )}
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={!isValid}
            className="py-3.5 font-bold"
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
