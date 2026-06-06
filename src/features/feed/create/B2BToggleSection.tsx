/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface B2BToggleSectionProps {
  isRetail: boolean;
  setIsRetail: (v: boolean) => void;
  minRetail: string;
  setMinRetail: (v: string) => void;
  isB2B: boolean;
  setIsB2B: (v: boolean) => void;
  minB2B: string;
  setMinB2B: (v: string) => void;
}

export function B2BToggleSection({
  isRetail,
  setIsRetail,
  minRetail,
  setMinRetail,
  isB2B,
  setIsB2B,
  minB2B,
  setMinB2B,
}: B2BToggleSectionProps) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm space-y-4">
      <span className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
        Ketersediaan Pengadaan
      </span>

      <div className="space-y-3.5">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isRetail}
            onChange={(e) => setIsRetail(e.target.checked)}
            className="w-5 h-5 accent-primary mt-0.5 rounded"
          />
          <div>
            <span className="font-jakarta font-bold text-label-md text-on-surface block">
              Layani Eceran (B2C)
            </span>
            <span className="text-body-sm text-on-surface-variant">
              Bisa dibeli konsumen per kilo untuk dapur harian
            </span>
          </div>
        </label>

        {isRetail && (
          <div className="pl-8 space-y-1.5">
            <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta block">
              Min. Order Eceran
            </span>
            <input
              type="text"
              value={minRetail}
              onChange={(e) => setMinRetail(e.target.value)}
              placeholder="Contoh: 1 kg"
              className="w-full max-w-[140px] px-3.5 py-1.5 bg-surface-container-low border border-outline-variant text-body-sm rounded outline-none"
            />
          </div>
        )}

        <label className="flex items-start gap-3 cursor-pointer select-none border-t border-outline-variant/30 pt-3.5">
          <input
            type="checkbox"
            checked={isB2B}
            onChange={(e) => setIsB2B(e.target.checked)}
            className="w-5 h-5 accent-primary mt-0.5 rounded"
          />
          <div>
            <span className="font-jakarta font-bold text-label-md text-on-surface block">
              Layani Grosir Borongan (B2B)
            </span>
            <span className="text-body-sm text-on-surface-variant">
              Mendukung muatan kuantitas besar untuk restoran/pabrik
            </span>
          </div>
        </label>

        {isB2B && (
          <div className="pl-8 space-y-1.5">
            <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta block">
              Min. Order Grosir
            </span>
            <input
              type="text"
              value={minB2B}
              onChange={(e) => setMinB2B(e.target.value)}
              placeholder="Contoh: 50 kg"
              className="w-full max-w-[140px] px-3.5 py-1.5 bg-surface-container-low border border-outline-variant text-body-sm rounded outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
