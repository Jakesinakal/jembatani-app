/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';

// Shared demo account for portfolio visitors (seeded in Supabase).
const DEMO_EMAIL = 'demo@jembatani.app';
const DEMO_PASSWORD = 'JembaTani2026';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setErrorMsg('');
    const { error } = await signIn(DEMO_EMAIL, DEMO_PASSWORD);
    setDemoLoading(false);
    if (error) {
      setErrorMsg('Gagal masuk ke akun demo. Coba lagi sebentar.');
      return;
    }
    navigate(ROUTES.BERANDA);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Harap masukkan email dan kata sandi Anda.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      setErrorMsg('Email atau kata sandi salah. Silakan coba lagi.');
      return;
    }
    navigate(ROUTES.BERANDA);
  };

  return (
    <div className="flex-1 min-h-screen bg-surface flex flex-col justify-between px-5 py-8">
      <div>
        {/* Header Section */}
        <div className="text-center mt-6 mb-12">
          <span className="font-fraunces text-display-lg-mobile text-primary font-bold tracking-tight">
            JembaTani
          </span>
          <p className="font-jakarta text-body-md text-on-surface-variant mt-2 font-medium">
            Log masuk untuk bergabung dalam ekosistem tani
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleLogin}
          className="space-y-5 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/60 shadow-sm"
        >
          {errorMsg && (
            <div className="text-error bg-error-container/20 border border-error-container p-3 rounded-lg text-body-sm font-semibold leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
              Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-on-surface-variant">
                <Mail strokeWidth={1.5} className="w-5 h-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Contoh: budi@mail.com"
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
                Kata Sandi
              </label>
              <button
                type="button"
                className="text-label-md font-bold text-secondary hover:underline"
              >
                Lupa password?
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-on-surface-variant">
                <Lock strokeWidth={1.5} className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Masukkan kata sandi Anda"
                className="w-full pl-11 pr-11 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-on-surface-variant"
              >
                {showPassword ? (
                  <EyeOff strokeWidth={1.5} className="w-5 h-5" />
                ) : (
                  <Eye strokeWidth={1.5} className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Log In Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="py-3.5 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses...
              </span>
            ) : (
              'Masuk Sekarang'
            )}
          </Button>
        </form>

        {/* Demo access for portfolio visitors — no registration needed */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={demoLoading}
          className="w-full mt-4 border-2 border-dashed border-secondary/60 bg-secondary/5 text-secondary font-jakarta font-bold text-body-md py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/10 active:scale-[0.99] transition-all disabled:opacity-60"
        >
          {demoLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Menyiapkan demo...
            </>
          ) : (
            <>🚀 Coba Demo (Tanpa Daftar)</>
          )}
        </button>
        <p className="text-center text-body-sm text-on-surface-variant font-jakarta mt-2">
          Lihat aplikasi langsung tanpa perlu registrasi.
        </p>

        <div className="relative py-8 flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-outline-variant/50" />
          <span className="relative bg-surface px-4 text-label-md font-bold text-on-surface-variant uppercase tracking-wider font-jakarta">
            Atau masuk dengan
          </span>
        </div>

        <button
          type="button"
          disabled
          className="w-full border border-outline bg-surface-container-lowest text-on-surface/50 font-jakarta font-bold text-body-md py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <svg className="w-5 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.6 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.8 2.95C6.2 7.15 8.9 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.51 12.3c0-.83-.07-1.63-.22-2.4H12v4.55h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.74-4.94 3.74-8.6z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.55c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3l-3.8-2.95c-.8 1.6-1.25 3.38-1.25 5.25s.45 3.65 1.25 5.25l3.8-2.95z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.08 7.96-2.9l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.1 0-5.8-2.11-6.7-4.96l-3.8 2.95C3.4 20.35 7.35 23 12 23z"
            />
          </svg>
          Google
        </button>
      </div>

      <div className="text-center font-jakarta text-body-sm mt-8 text-on-surface-variant">
        Belum punya akun?{' '}
        <button
          onClick={() => navigate(ROUTES.REGISTER)}
          className="text-secondary font-bold hover:underline"
        >
          Daftar Sekarang
        </button>
      </div>
    </div>
  );
}
