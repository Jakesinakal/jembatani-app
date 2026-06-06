/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useCommodityDetail } from '@/features/prices/useCommodityDetail';
import { formatRupiah } from '@/lib/utils';
import { MARKET_COMPARISONS } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { LineChart } from '@/features/prices/LineChart';

export default function HargaDetail() {
  const { commodityId } = useParams<{ commodityId: string }>();
  const navigate = useNavigate();
  const { commodity: item, loading, error } = useCommodityDetail(commodityId);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex-1 bg-surface">
        <PageHeader title="Detail Tren Harga" onBack={() => navigate(ROUTES.HARGA)} />
        <div className="flex items-center justify-center px-5 mt-20">
          <div className="text-center">
            <p className="font-jakarta text-body-md text-error font-semibold">
              {error ?? 'Komoditas tidak ditemukan'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      <PageHeader
        title="Detail Tren Harga"
        onBack={() => navigate(ROUTES.HARGA)}
        rightAction={
          <button
            onClick={() => alert('Link tren dibagikan ke WhatsApp!')}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        }
      />

      {/* Hero card information panel */}
      <div className="px-5 mt-6">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col p-5 shadow-sm">
          <div className="flex gap-4">
            <img
              src={item.photo}
              alt={item.name}
              className="w-24 h-24 rounded-lg object-cover bg-surface-container border border-outline-variant/30"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <span className="px-2.5 py-0.5 bg-primary-fixed text-on-primary-fixed-variant text-body-sm font-bold rounded-full uppercase font-jakarta">
                  Kategori {item.category}
                </span>
                <h2 className="font-fraunces text-headline-md font-bold text-primary leading-tight mt-1.5">
                  {item.name}
                </h2>
              </div>

              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-fraunces text-headline-md font-bold text-secondary tabular-nums">
                  {formatRupiah(item.priceToday)}
                </span>
                <span className="text-body-sm text-on-surface-variant font-jakarta font-medium">
                  {item.unit}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/40 mt-4 pt-4 grid grid-cols-3 gap-2 text-center text-body-sm">
            <div className="border-r border-outline-variant/30">
              <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta">
                Delta Harian
              </span>
              <span
                className={`block font-bold mt-0.5 ${item.isUp ? 'text-on-tertiary-container' : 'text-secondary'}`}
              >
                {item.isUp ? '▲ +' : '▼ -'}
                {item.deltaPercent}%
              </span>
            </div>
            <div className="border-r border-outline-variant/30">
              <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta">
                Rerata Regional
              </span>
              <span className="block font-bold mt-0.5 text-primary">Jawa Barat</span>
            </div>
            <div>
              <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta">
                Validitas
              </span>
              <span className="block font-bold text-primary flex items-center justify-center gap-0.5 mt-0.5 text-body-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-primary fill-primary-fixed" /> Aktual
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Line Graph */}
      <div className="px-5 mt-6">
        <LineChart history={item.history30Days} />
      </div>

      {/* Market Benchmarks section */}
      <div className="px-5 mt-6">
        <h3 className="font-fraunces text-body-lg font-bold text-primary mb-3">
          Banding Harga Pasar Induk
        </h3>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          {MARKET_COMPARISONS.map((comp, idx) => (
            <div
              key={idx}
              className={`p-4 flex items-center justify-between border-b border-outline-variant/40 last:border-b-0 ${
                idx % 2 === 0 ? 'bg-surface-container-low/40' : 'bg-surface-container-lowest'
              }`}
            >
              <div>
                <span className="font-jakarta font-bold text-body-sm text-on-surface block">
                  {comp.market}
                </span>
                <span className="px-1.5 py-0.5 bg-surface-container text-on-surface-variant text-body-sm font-bold rounded uppercase mt-1 inline-block">
                  {comp.term}
                </span>
              </div>

              <div className="text-right">
                <span className="font-fraunces font-bold text-body-md text-primary mr-1 tabular-nums">
                  {formatRupiah(item.priceToday + comp.priceOffset)}
                </span>
                <span className="text-body-sm text-on-surface-variant font-medium">/kg</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redirect CTA Button to Opportunity Feed */}
      <div className="px-5 mt-8">
        <div className="bg-primary/5 border border-primary/20 p-5 rounded-lg flex flex-col gap-4 text-center">
          <p className="font-jakarta text-body-sm text-on-surface leading-relaxed">
            Butuh komoditas <b className="font-bold">{item.name}</b> dengan harga bersaing langsung
            dari petani Garut?
          </p>
          <Button
            onClick={() => navigate(ROUTES.BERANDA)}
            variant="primary"
            fullWidth
            className="flex items-center justify-center gap-1.5 font-bold"
          >
            Temukan Penjual Di Feed <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
