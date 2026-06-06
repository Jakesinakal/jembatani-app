/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { CERTIFICATE_OPTIONS } from '@/lib/constants';
import { toggleItem } from '@/lib/utils';

export interface DescriptionCertSectionProps {
  desc: string;
  setDesc: (v: string) => void;
  selectedCerts: string[];
  setSelectedCerts: (v: string[]) => void;
}

export function DescriptionCertSection({
  desc,
  setDesc,
  selectedCerts,
  setSelectedCerts,
}: DescriptionCertSectionProps) {
  const handleToggleCert = (cert: string) => {
    setSelectedCerts(toggleItem(selectedCerts, cert));
  };

  return (
    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm space-y-4">
      <FormField label="Deskripsi Hasil Kebun / Permintaan">
        <textarea
          rows={4}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Jelaskan kualitas, warna cabai, sistem pemupukan, rasa manis tomat, atau spesifikasi logistik kiriman..."
          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-sm outline-none font-jakarta resize-none leading-relaxed"
        />
      </FormField>

      <div className="space-y-2.5">
        <span className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
          Sertifikasi Legal (Grup Tani)
        </span>
        <div className="flex flex-wrap gap-2.5">
          {CERTIFICATE_OPTIONS.map((cert) => {
            const isSelected = selectedCerts.includes(cert);
            return (
              <button
                key={cert}
                type="button"
                onClick={() => handleToggleCert(cert)}
                className={`px-4 py-1.5 rounded-full text-label-md font-bold font-jakarta border transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant border-outline-variant'
                }`}
              >
                {cert}
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
