/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Fragment } from 'react';
import { Search, Bell, SlidersHorizontal, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PostCard } from '@/features/feed/PostCard';
import { useStartChat } from '@/features/messages/useStartChat';
import { formatRupiah } from '@/lib/utils';
import { mockCommodities } from '@/data/mockData';
import { Post } from '@/types/post';

export interface BerandaProps {
  posts: Post[];
  postsLoading: boolean;
  onLikePost: (postId: string) => void;
}

export default function Beranda({ posts, postsLoading, onLikePost }: BerandaProps) {
  const { startChat } = useStartChat();
  const [activeFilter, setActiveFilter] = useState<
    'Semua' | 'Penawaran' | 'Permintaan' | 'Dekat Saya'
  >('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [notifCount, setNotifCount] = useState(3);

  // Commodity ticker tape data
  const TICKER_IDS = ['cabai_merah', 'kentang', 'tomat', 'bawang_merah', 'beras', 'kopi_arabika'];
  const tickerItems = TICKER_IDS.map((id) => mockCommodities.find((c) => c.id === id)!).map(
    (c) => ({
      name: c.name,
      price: c.priceToday,
      percent: `${c.deltaPercent.toFixed(1)}%`,
      isUp: c.isUp,
      isFlat: c.deltaPercent === 0,
    }),
  );

  // Filtering posts based on chips + search query
  const filteredPosts = posts.filter((post) => {
    // 1. Chip filter
    if (activeFilter === 'Penawaran' && post.type !== 'PENAWARAN') return false;
    if (activeFilter === 'Permintaan' && post.type !== 'PERMINTAAN') return false;
    if (
      activeFilter === 'Dekat Saya' &&
      !post.location.includes('Garut') &&
      !post.location.includes('Bandung')
    )
      return false;

    // 2. Search search text
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.caption.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q) ||
        post.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      {/* Sticky Top Header */}
      <div className="sticky top-0 bg-surface-container-highest/90 backdrop-blur-md z-30 border-b border-outline-variant/50">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-fraunces text-headline-md font-bold text-primary tracking-tight">
            JembaTani
          </span>

          <div className="flex items-center gap-3">
            {/* Search toggler */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors relative"
            >
              <Search strokeWidth={1.5} className="w-6 h-6 text-on-surface-variant" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                setNotifCount(0);
                alert('Notifikasi: Anda memiliki pesan negosiasi baru dari Pak Budi!');
              }}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors relative"
            >
              <Bell strokeWidth={1.5} className="w-6 h-6 text-on-surface-variant" />
              {notifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary rounded-full border border-surface-container-highest" />
              )}
            </button>
          </div>
        </div>

        {/* Floating search entry */}
        {showSearch && (
          <div className="px-5 pb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari cabai, kentang, beras, area Garut..."
              className="w-full px-4 py-2 bg-surface-container-low text-on-surface border border-outline-variant rounded outline-none text-body-sm font-jakarta focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {/* Commodity Price Ticker Strip (36px high) */}
        <div className="bg-primary border-t border-outline/30 select-none overflow-hidden h-[38px] flex items-center relative">
          <div className="inline-flex animate-[marquee_25s_linear_infinite] whitespace-nowrap gap-6 items-center px-4">
            {tickerItems.concat(tickerItems).map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 text-label-md font-jakarta text-on-primary"
              >
                <span className="font-bold">{item.name}</span>
                <span className="font-fraunces font-medium text-body-sm text-on-primary tabular-nums tracking-tight">
                  {formatRupiah(item.price)}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-body-sm font-bold ${
                    item.isFlat
                      ? 'text-surface-container-highest'
                      : item.isUp
                        ? 'text-tertiary-fixed-dim'
                        : 'text-secondary-container'
                  }`}
                >
                  {item.isFlat ? '→' : item.isUp ? '↑' : '↓'} {item.percent}
                </span>
                <span className="text-on-primary/35 mx-1">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Horizontal Chip Row */}
      {(() => {
        const filterChips: {
          value: typeof activeFilter;
          label: string;
          activeClass: string;
        }[] = [
          { value: 'Semua', label: 'Semua', activeClass: 'bg-primary text-on-primary' },
          {
            value: 'Penawaran',
            label: '🧺 Penawaran Petani',
            activeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
          },
          {
            value: 'Permintaan',
            label: '💼 Permintaan Pembeli',
            activeClass: 'bg-primary-fixed text-on-primary-fixed-variant',
          },
          {
            value: 'Dekat Saya',
            label: '📍 Dekat Saya',
            activeClass:
              'bg-surface-container-highest border border-outline-variant text-on-surface',
          },
        ];
        return (
          <div className="px-5 mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {filterChips.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setActiveFilter(chip.value)}
                className={`px-4.5 py-2 text-label-md font-bold font-jakarta rounded-full transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeFilter === chip.value
                    ? chip.activeClass
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        );
      })()}

      {/* Feed Listing Cards Container */}
      <div id="opportunity-feed-stack" className="px-5 mt-6 space-y-6">
        {postsLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            message="Tidak ada hasil yang sesuai filter pencarian."
          />
        ) : (
          filteredPosts.map((post) => (
            <Fragment key={post.id}>
              <PostCard
                post={post}
                onLikePost={onLikePost}
                onContact={() => startChat(post.author.id)}
                onMakeOffer={() =>
                  startChat(post.author.id, {
                    productName: post.title,
                    productPhoto: post.photoUrl,
                    originalPrice: post.price,
                    defaultQuantity: post.type === 'PERMINTAAN' ? (post.quantityNeeded ?? '') : '',
                  })
                }
              />
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
}
