/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Loader2,
  Info,
  Check,
} from 'lucide-react';
import { useCommodities } from '@/features/prices/useCommodities';
import { formatRupiah } from '@/lib/utils';
import { CommodityPriceInfo, CommodityCategory } from '@/types/commodity';

type TickerGroup = 'SAYURAN' | 'BUAH' | 'KOMODITAS';
const TICKER_GROUP_LABELS: Record<TickerGroup, string> = {
  SAYURAN: 'Sayuran',
  BUAH: 'Buah',
  KOMODITAS: 'Komoditas',
};
const KOMODITAS_CATEGORIES: CommodityCategory[] = ['PADI', 'REMPAH', 'PERKEBUNAN'];
const REGIONS = ['Jawa Barat', 'Jawa Tengah', 'DKI Jakarta', 'Jawa Timur', 'Banten'];
const TICKER_INTERVAL = 5000;
const GRID_COLS = 3;
const GRID_ROWS = 4;
const PAGE_SIZE = GRID_COLS * GRID_ROWS; // 12

interface TickerSlide {
  group: TickerGroup;
  page: number;
  totalPages: number;
  items: (CommodityPriceInfo | null)[];
}

function buildSlides(allCommodities: CommodityPriceInfo[]): TickerSlide[] {
  const groups: TickerGroup[] = ['SAYURAN', 'BUAH', 'KOMODITAS'];
  const slides: TickerSlide[] = [];
  for (const group of groups) {
    const items = allCommodities.filter((c) =>
      group === 'KOMODITAS' ? KOMODITAS_CATEGORIES.includes(c.category) : c.category === group,
    );
    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    for (let p = 0; p < totalPages; p++) {
      const slice = items.slice(p * PAGE_SIZE, (p + 1) * PAGE_SIZE);
      // Pad to PAGE_SIZE so every grid is identical size
      const padded: (CommodityPriceInfo | null)[] = [
        ...slice,
        ...Array(PAGE_SIZE - slice.length).fill(null),
      ];
      slides.push({ group, page: p, totalPages, items: padded });
    }
  }
  return slides;
}

function TickerGrid({ slide }: { key?: number; slide: TickerSlide }) {
  return (
    <div
      className="grid gap-px bg-outline-variant/30"
      style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
    >
      {slide.items.map((item, i) => (
        <div
          key={item ? item.id : `empty-${i}`}
          className="bg-surface-container-low px-2 py-2.5 flex flex-col gap-0.5"
        >
          {item ? (
            <>
              <span className="font-jakarta text-body-sm font-semibold text-on-surface truncate">
                {item.name}
              </span>
              <span className="font-fraunces text-body-sm font-bold text-on-surface tabular-nums">
                {formatRupiah(item.priceToday)}
              </span>
              <span
                className={`font-jakarta text-body-sm font-bold ${item.isUp ? 'text-on-tertiary-container' : 'text-secondary'}`}
              >
                {item.isUp ? '▲' : '▼'} {item.deltaPercent}%
              </span>
            </>
          ) : (
            <span className="text-body-sm text-outline-variant">—</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Harga() {
  const navigate = useNavigate();
  const { commodities, loading, error } = useCommodities();
  const [selectedRegion, setSelectedRegion] = useState('Jawa Barat');
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'GAINER' | 'LOSER'>('GAINER');
  const [showInfo, setShowInfo] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const slides = useMemo(() => buildSlides(commodities), [commodities]);
  const currentSlide = slides[slideIndex] as TickerSlide | undefined;

  const topList = useMemo(() => {
    const all = [...commodities];
    if (activeTab === 'GAINER')
      return all
        .filter((c) => c.isUp)
        .sort((a, b) => b.deltaPercent - a.deltaPercent)
        .slice(0, 10);
    return all
      .filter((c) => !c.isUp)
      .sort((a, b) => b.deltaPercent - a.deltaPercent)
      .slice(0, 10);
  }, [activeTab, commodities]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, TICKER_INTERVAL);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface px-5">
        <div className="text-center">
          <p className="font-jakarta text-body-md text-error font-semibold">Gagal memuat data</p>
          <p className="font-jakarta text-body-sm text-on-surface-variant mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      {/* Header Panel */}
      <div className="px-5 pt-6 pb-2 relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-fraunces text-headline-lg font-bold text-primary mb-1">
              Harga Komoditas
            </h1>
            <p className="font-jakarta text-body-sm text-on-surface-variant font-medium">
              Harga acuan dari pusat info pasar induk terdekat.
            </p>
          </div>

          {/* Info toggle — opens a floating note instead of pushing the table down */}
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            aria-label="Tentang data harga"
            aria-expanded={showInfo}
            className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              showInfo
                ? 'bg-primary text-on-primary'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <Info className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>

        {/* Floating purpose / transparency note */}
        {showInfo && (
          <>
            {/* Click-away catcher */}
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setShowInfo(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div
              role="dialog"
              className="absolute right-5 top-full -mt-1 z-50 w-[300px] max-w-[calc(100%-2.5rem)] rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xl p-4"
            >
              {/* Caret pointing up to the info button */}
              <span className="absolute -top-1.5 right-3 w-3 h-3 rotate-45 bg-surface-container-lowest border-l border-t border-outline-variant" />
              <p className="font-jakarta text-body-sm text-on-surface leading-relaxed">
                <b className="font-bold text-primary">Untuk apa data harga ini?</b> Daftar ini jadi
                acuan bersama supaya harga lebih <b className="font-bold">transparan dan merata</b>.
                Dengan tahu harga wajar di pasar, posisi tawarmu setara dan kamu terlindung dari
                permainan harga — bukan sekadar melihat angka naik-turun.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Region & Date Selector Bar */}
      <div className="px-5 mt-4 flex items-center justify-between gap-3">
        {/* Region selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setRegionOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={regionOpen}
            className="px-4 py-2 bg-primary text-on-primary rounded-full text-label-md font-bold font-jakarta flex items-center gap-1 hover:bg-opacity-90 transition-all shadow-sm"
          >
            📍 {selectedRegion}{' '}
            <span
              className={`inline-block text-body-sm text-on-primary-container font-jakarta transition-transform duration-200 ${
                regionOpen ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>

          {regionOpen && (
            <>
              {/* Click-away catcher */}
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                onClick={() => setRegionOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              {/* Compact dropdown */}
              <div
                role="listbox"
                className="absolute left-0 top-full mt-2 z-50 w-44 origin-top-left rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xl p-1.5 animate-[fadeIn_0.12s_ease-out]"
              >
                {REGIONS.map((region) => {
                  const isActive = region === selectedRegion;
                  return (
                    <button
                      key={region}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        setSelectedRegion(region);
                        setRegionOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left font-jakarta text-body-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container'
                          : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <span>{region}</span>
                      {isActive && (
                        <Check strokeWidth={2.5} className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Date Row with arrows */}
        <div className="flex items-center gap-2 bg-surface-container-high px-3.5 py-1.5 rounded-full border border-outline-variant/60">
          <button className="text-on-surface-variant hover:text-primary active:scale-90 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-label-md font-bold font-jakarta text-on-surface whitespace-nowrap">
            25 Mei 2026
          </span>
          <button className="text-on-surface-variant hover:text-primary active:scale-90 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Ticker */}
      {currentSlide && (
        <div className="mt-6 px-5">
          <div className="bg-surface-container-low rounded-lg border border-outline-variant/60 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 pt-2.5 pb-2">
              <span className="font-jakarta text-label-md font-bold text-on-surface uppercase tracking-wider">
                {TICKER_GROUP_LABELS[currentSlide.group]}
                {currentSlide.totalPages > 1 && (
                  <span className="ml-2 text-on-surface-variant font-normal normal-case tracking-normal">
                    {currentSlide.page + 1}/{currentSlide.totalPages}
                  </span>
                )}
              </span>
              <div className="flex gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === slideIndex
                        ? 'w-5 bg-primary'
                        : s.group === currentSlide.group
                          ? 'w-1.5 bg-primary/40'
                          : 'w-1.5 bg-outline-variant'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="pb-px">
              <TickerGrid key={slideIndex} slide={currentSlide} />
            </div>
          </div>
        </div>
      )}

      {/* Naik & Turun */}
      <div className="px-5 mt-6">
        {/* Tab bar */}
        <div className="flex rounded-lg overflow-hidden border border-outline-variant/60 mb-3">
          {(
            [
              { key: 'GAINER', label: 'Kenaikan Tertinggi', icon: TrendingUp },
              { key: 'LOSER', label: 'Penurunan Tertinggi', icon: TrendingDown },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-label-md font-bold font-jakarta transition-colors ${
                activeTab === key
                  ? key === 'GAINER'
                    ? 'bg-primary text-on-primary'
                    : 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 overflow-hidden divide-y divide-outline-variant/40">
          {topList.map((item, rank) => (
            <div
              key={item.id}
              onClick={() => navigate(ROUTES.HARGA_DETAIL(item.id))}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              {/* Rank */}
              <span className="w-5 text-center font-fraunces text-body-sm font-bold text-on-surface-variant tabular-nums shrink-0">
                {rank + 1}
              </span>

              {/* Photo */}
              <img
                src={item.photo}
                alt={item.name}
                className="w-9 h-9 rounded object-cover border border-outline-variant/40 shrink-0"
                referrerPolicy="no-referrer"
              />

              {/* Name + category */}
              <div className="flex-1 min-w-0">
                <span className="font-jakarta text-body-md font-semibold text-on-surface block truncate">
                  {item.name}
                </span>
                <span className="font-jakarta text-body-sm text-on-surface-variant uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              {/* Price + delta */}
              <div className="text-right shrink-0">
                <span className="font-fraunces text-body-md font-bold text-on-surface tabular-nums block">
                  {formatRupiah(item.priceToday)}
                </span>
                <span
                  className={`font-jakarta text-body-sm font-bold ${
                    item.isUp ? 'text-on-tertiary-container' : 'text-secondary'
                  }`}
                >
                  {item.isUp ? '▲' : '▼'} {item.deltaPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
