/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, ShieldCheck, Compass } from 'lucide-react';
import { UserRole } from '@/types/user';

export interface Step3RoleProps {
  mainRole: UserRole | null;
  setMainRole: (v: UserRole) => void;
}

export function Step3Role({ mainRole, setMainRole }: Step3RoleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-fraunces text-headline-md font-bold text-primary mb-2">
          Pilih Peran Utama Anda
        </h2>
        <p className="font-jakarta text-body-md text-on-surface-variant">
          Sesuaikan fitur utama beranda Anda untuk fokus menjual atau membeli. Kamu tetap bisa ganti
          kapan saja nanti.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          type="button"
          id="role-petani-select"
          onClick={() => setMainRole('PETANI')}
          className={`p-6 text-left rounded-lg border transition-all flex items-start gap-4 ${
            mainRole === 'PETANI'
              ? 'border-primary bg-primary-fixed/20 ring-2 ring-primary'
              : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
          }`}
        >
          <div
            className={`p-3 rounded-full ${mainRole === 'PETANI' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}
          >
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-fraunces text-body-lg font-bold text-primary">
                Saya Petani / Produsen
              </span>
              {mainRole === 'PETANI' && (
                <div className="bg-primary text-on-primary rounded-full p-0.5">
                  <Check className="w-3" />
                </div>
              )}
            </div>
            <p className="font-jakarta text-body-sm text-on-surface-variant leading-relaxed">
              Mau menjual hasil bumi segar, membuat penawaran pasokan harvest, serta merespon
              permintaan borongan dari restoran/pabrik.
            </p>
          </div>
        </button>

        <button
          type="button"
          id="role-pembeli-select"
          onClick={() => setMainRole('PEMBELI')}
          className={`p-6 text-left rounded-lg border transition-all flex items-start gap-4 ${
            mainRole === 'PEMBELI'
              ? 'border-secondary bg-secondary-fixed/20 ring-2 ring-secondary'
              : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
          }`}
        >
          <div
            className={`p-3 rounded-full ${mainRole === 'PEMBELI' ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant'}`}
          >
            <Compass className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-fraunces text-body-lg font-bold text-primary">
                Saya Pembeli Grosir / Retail
              </span>
              {mainRole === 'PEMBELI' && (
                <div className="bg-secondary text-on-secondary rounded-full p-0.5">
                  <Check className="w-3" />
                </div>
              )}
            </div>
            <p className="font-jakarta text-body-sm text-on-surface-variant leading-relaxed">
              Mencari pasokan sayur segar langsung, membuat rincian permintaan pasokan B2B, atau
              membeli kebutuhan dapur harian B2C.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
