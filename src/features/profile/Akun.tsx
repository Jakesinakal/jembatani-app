/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Settings,
  Briefcase,
  ChevronRight,
  UserCheck,
  CreditCard,
  FileText,
  LogOut,
  Sparkles,
  BookOpen,
  FolderHeart,
  Loader2,
  Camera,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/features/profile/useUserProfile';
import { uploadImage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/lib/routes';

export default function Akun() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading, error, refetch } = useUserProfile();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [nameSaving, setNameSaving] = useState(false);

  const menuSections = [
    {
      title: 'Aktivitas Saya',
      items: [
        { label: 'Postingan saya', subtitle: 'List semua katalog hasil panen', icon: FileText },
        { label: 'Tersimpan', subtitle: 'Koleksi postingan petani favorit', icon: FolderHeart },
        { label: 'Riwayat tawaran', subtitle: 'Arsip negosiasi harga', icon: Sparkles },
      ],
    },
    {
      title: 'Transaksi & Keuangan',
      items: [
        { label: 'Pesanan Aktif', subtitle: 'Lacak pengiriman truk/logistik', icon: Briefcase },
        { label: 'Riwayat Pesanan', subtitle: 'Selesai & Faktur', icon: BookOpen },
        { label: 'Dompet & Pencairan', subtitle: 'Saldo: Rp 2.450.000', icon: CreditCard },
      ],
    },
    {
      title: 'Akun & Verifikasi',
      items: [
        {
          label: 'Verifikasi Identitas (KTP)',
          subtitle: 'Selesai diverifikasi',
          icon: UserCheck,
          isVerified: true,
        },
        {
          label: 'Verifikasi Lahan & Kebun',
          subtitle: 'Kelompok Tani Garut',
          icon: MapPin,
          isVerified: true,
        },
      ],
    },
    {
      title: 'Pengaturan & Dukungan',
      items: [
        { label: 'Preferensi Notifikasi', subtitle: 'Pesan whatsapp & aplikasi', icon: Settings },
        { label: 'Bahasa', subtitle: 'Bahasa Indonesia (Default)', icon: BookOpen },
        {
          label: 'Keluar Akun',
          subtitle: 'Log out dari perangkat ini',
          icon: LogOut,
          isDanger: true,
        },
      ],
    },
  ];

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setAvatarUploading(true);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${user.id}/avatar.${ext}`;

    const { url, error: uploadErr } = await uploadImage('avatars', file, path, { upsert: true });
    if (uploadErr || !url) {
      alert(uploadErr ?? 'Gagal mengunggah foto profil.');
      setAvatarUploading(false);
      return;
    }

    await supabase.from('users').update({ avatar_url: url }).eq('id', user.id);
    refetch();
    setAvatarUploading(false);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleStartEditName = () => {
    setNameValue(profile?.name ?? '');
    setEditingName(true);
  };

  const handleSaveName = async () => {
    const trimmed = nameValue.trim();
    if (!trimmed || !user || trimmed === profile?.name) {
      setEditingName(false);
      return;
    }
    setNameSaving(true);
    await supabase.from('users').update({ name: trimmed }).eq('id', user.id);
    refetch();
    setNameSaving(false);
    setEditingName(false);
  };

  const handleCancelEditName = () => {
    setEditingName(false);
  };

  const handleMenuClick = async (label: string) => {
    if (label === 'Keluar Akun') {
      const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari Akun JembaTani?');
      if (confirmLogout) {
        await signOut();
        navigate(ROUTES.LOGIN);
      }
    } else {
      alert(`Menu terpilih: ${label} (Mode Demo)`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface px-5">
        <div className="text-center">
          <p className="font-jakarta text-body-md text-error font-semibold">Gagal memuat profil</p>
          <p className="font-jakarta text-body-sm text-on-surface-variant mt-1">
            {error ?? 'Data profil tidak ditemukan'}
          </p>
        </div>
      </div>
    );
  }

  const roleLabels = profile.roles.map((r) => (r === 'PETANI' ? 'Petani' : 'Pembeli'));

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      {/* Top Section Cream Background */}
      <div className="bg-surface-container pb-8 pt-10 px-5 border-b border-outline-variant/60 flex flex-col items-center text-center">
        {/* Large Avatar with upload overlay */}
        <div className="relative mb-4">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarUploading}
            className="relative"
          >
            <Avatar
              src={profile.avatarUrl}
              name={profile.name}
              size="xl"
              isVerified={profile.isVerified}
            />
            <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md border-2 border-surface">
              {avatarUploading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
            </span>
          </button>
        </div>

        {/* User identification */}
        {editingName ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              autoFocus
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') handleCancelEditName();
              }}
              className="font-fraunces text-headline-md font-bold text-primary bg-transparent border-b-2 border-primary outline-none text-center w-48"
            />
            <button onClick={handleSaveName} disabled={nameSaving} className="text-primary">
              {nameSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
            </button>
            <button onClick={handleCancelEditName} className="text-on-surface-variant">
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button onClick={handleStartEditName} className="flex items-center gap-1.5 mt-1 group">
            <h2 className="font-fraunces text-headline-md font-bold text-primary">
              {profile.name}
            </h2>
            <Pencil className="w-4 h-4 text-on-surface-variant opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        {profile.location && (
          <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta tracking-wider flex items-center gap-0.5 mt-1">
            📍 {profile.location}
          </span>
        )}

        {/* Role labels */}
        <div className="flex gap-2 mt-3.5">
          {roleLabels.map((label) => (
            <Badge key={label} variant={label === 'Petani' ? 'permintaan' : 'penawaran'}>
              {label}
            </Badge>
          ))}
        </div>

        {/* Stats row */}
        <div
          id="author-stats-columns"
          className="grid grid-cols-2 gap-4 w-full max-w-xs mt-6 pt-5 border-t border-outline-variant/30 text-center"
        >
          <div>
            <span className="font-fraunces font-bold text-body-md text-primary block tabular-nums">
              {profile.postsCount}
            </span>
            <span className="text-body-sm uppercase font-bold text-on-surface-variant tracking-wider font-jakarta block">
              Postingan
            </span>
          </div>
          <div className="border-l border-outline-variant/30">
            <span className="font-fraunces font-bold text-body-md text-primary block tabular-nums">
              {profile.isVerified ? 'Aktif' : 'Belum'}
            </span>
            <span className="text-body-sm uppercase font-bold text-on-surface-variant tracking-wider font-jakarta block">
              Verifikasi
            </span>
          </div>
        </div>
      </div>

      {/* Profiles Quick CTAs */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3.5">
        <button
          onClick={() => alert('Fitur Edit Profil: Upload KTP / Verifikasi HP')}
          className="py-2.5 bg-surface-container-lowest border border-outline-variant text-body-sm font-extrabold font-jakarta uppercase tracking-wider rounded-lg text-primary hover:bg-surface-container-low active:translate-y-px transition-all"
        >
          Edit Profil
        </button>
        <button
          onClick={() => alert('Link Toko JembaTani Anda disalin ke Clipboard!')}
          className="py-2.5 bg-surface-container-lowest border border-outline-variant text-body-sm font-extrabold font-jakarta uppercase tracking-wider rounded-lg text-primary hover:bg-surface-container-low active:translate-y-px transition-all"
        >
          Bagikan Toko
        </button>
      </div>

      {/* Grouped menu options lists (Stacked white cards) */}
      <div className="px-5 mt-6 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <span className="text-body-sm font-bold font-jakarta uppercase text-on-surface-variant tracking-wider block ml-1">
              {section.title}
            </span>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
              {section.items.map((item, _idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.label}
                    onClick={() => handleMenuClick(item.label)}
                    className="p-4 flex items-center justify-between border-b border-outline-variant/30 last:border-b-0 hover:bg-surface-container-low/40 active:bg-surface-container-high/40 transition-colors cursor-pointer select-none h-[64px]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-lg ${item.isDanger ? 'bg-error-container/20 text-error' : 'bg-surface-container text-primary'}`}
                      >
                        <IconComp strokeWidth={1.5} className="w-5 h-5" />
                      </div>
                      <div>
                        <span
                          className={`font-jakarta font-bold text-body-sm block ${item.isDanger ? 'text-secondary' : 'text-on-surface'}`}
                        >
                          {item.label}
                        </span>
                        <span className="text-body-sm text-on-surface-variant font-medium block">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      {item.isVerified && (
                        <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-body-sm font-bold rounded-full font-jakarta">
                          AKTIF
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 opacity-65" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
