/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useCommodities } from '@/features/prices/useCommodities';
import { formatRupiah } from '@/lib/utils';
import { CommodityPriceInfo, CommodityCategory } from '@/types/commodity';

type TickerGroup = 'SAYURAN' | 'BUAH' | 'KOMODITAS';
const TICKER_GROUP_LABELS: Record<TickerGroup, string> = {
  SAYURAN: '🥦 Sayuran',
  BUAH: '🍋 Buah',
  KOMODITAS: '🌾 Komoditas',
};
const KOMODITAS_CATEGORIES: CommodityCategory[] = ['PADI', 'REMPAH', 'PERKEBUNAN'];
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
      <div className="px-5 pt-6 pb-2">
        <h1 className="font-fraunces text-headline-lg font-bold text-primary mb-1">
          Harga Komoditas
        </h1>
        <p className="font-jakarta text-body-sm text-on-surface-variant font-medium">
          Berdasarkan pusat info pasar induk terdekat.
        </p>
      </div>

      {/* Region & Date Selector Bar */}
      <div className="px-5 mt-4 flex items-center justify-between gap-3">
        {/* Region selector pill */}
        <button
          onClick={() => {
            const nextRegion = selectedRegion === 'Jawa Barat' ? 'Jawa Tengah' : 'Jawa Barat';
            setSelectedRegion(nextRegion);
          }}
          className="px-4 py-2 bg-primary text-on-primary rounded-full text-label-md font-bold font-jakarta flex items-center gap-1 hover:bg-opacity-90 transition-all shadow-sm shrink-0"
        >
          📍 {selectedRegion}{' '}
          <span className="text-body-sm text-on-primary-container font-jakarta">▼</span>
        </button>

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
