/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { Search, MessageSquare, Loader2 } from 'lucide-react';
import { useChats } from './useChats';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { EmptyState } from '@/components/ui/EmptyState';

export default function Pesan() {
  const navigate = useNavigate();
  const { chats, loading } = useChats();
  const [activeTab, setActiveTab] = useState<'Semua' | 'Negosiasi'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations
  const filteredConversations = chats.filter((chat) => {
    // 1. Tab category filter
    if (activeTab === 'Negosiasi' && !chat.hasActiveNegotiation) return false;

    // 2. Query search
    if (searchQuery) {
      return chat.partnerName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      {/* Header Panel */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="font-fraunces text-headline-lg font-bold text-primary mb-1">Pesan</h1>
        <p className="font-jakarta text-body-sm text-on-surface-variant font-medium">
          Bahas harga, transaksi, serta logistik kiriman di sini.
        </p>
      </div>

      {/* Structured Search input bar */}
      <div className="px-5 mt-4">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-on-surface-variant">
            <Search strokeWidth={1.5} className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama petani atau pembeli..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded outline-none text-body-sm font-jakarta focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tab Strip selector: Semua | Negosiasi */}
      <div className="px-5 mt-4 flex items-center gap-2">
        {(['Semua', 'Negosiasi'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-label-md font-bold font-jakarta rounded-full transition-all whitespace-nowrap shrink-0 ${
              activeTab === tab
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}
          >
            {tab === 'Semua' ? 'Semua Chat' : 'Negosiasi Aktif'}
          </button>
        ))}
      </div>

      {/* Vertical List of Chat items (6 chats) */}
      <div id="messages-list-stack" className="px-5 mt-6 space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <EmptyState icon={MessageSquare} message="Belum ada chat kategori ini." />
        ) : (
          filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(ROUTES.PESAN_DETAIL(chat.id))}
              className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-low/40 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <Avatar
                  src={chat.partnerAvatar}
                  name={chat.partnerName}
                  size="lg"
                  isVerified={chat.partnerVerified}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-jakarta font-bold text-body-sm text-on-surface">
                      {chat.partnerName}
                    </span>
                    {chat.partnerVerified && <VerifiedBadge size="sm" />}
                  </div>
                  <p className="font-jakarta text-body-sm text-on-surface-variant truncate pr-2">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1.5 shrink-0 ml-2">
                <span className="text-body-sm text-on-surface-variant font-jakarta">
                  {chat.lastMessageTimestamp}
                </span>

                {/* Visual indicators */}
                {chat.hasActiveNegotiation ? (
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-body-sm font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-jakarta">
                    NEGOSIASI
                  </span>
                ) : chat.unreadCount > 0 ? (
                  <span className="w-5 h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center font-jakarta text-body-sm font-bold">
                    {chat.unreadCount}
                  </span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
