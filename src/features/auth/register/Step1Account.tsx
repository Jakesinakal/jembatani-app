/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormField } from '@/components/ui/FormField';

export interface Step1AccountProps {
  fullName: string;
  setFullName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
}

export function Step1Account({
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: Step1AccountProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-fraunces text-headline-md font-bold text-primary mb-2">
          Buat Akun Baru
        </h2>
        <p className="font-jakarta text-body-md text-on-surface-variant">
          Bergabunglah dengan ribuan petani dan pembeli di JembaTani.
        </p>
      </div>

      <div className="space-y-4 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/60 shadow-sm">
        <FormField label="Nama Lengkap">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Contoh: Pak Budi Setiawan"
            className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
          />
        </FormField>

        <FormField label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="budi@mail.com"
            className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
          />
        </FormField>

        <FormField label="Nomor HP / WhatsApp (Opsional)">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 08212345678"
            className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Kata Sandi">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
            />
          </FormField>
          <FormField label="Ulangi Kata Sandi">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Masukkan ulang kata sandi"
              className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
