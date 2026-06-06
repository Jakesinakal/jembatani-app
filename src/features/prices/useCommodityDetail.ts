import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { CommodityPriceInfo, CommodityCategory } from '@/types/commodity';

export function useCommodityDetail(commodityId: string | undefined) {
  const [commodity, setCommodity] = useState<CommodityPriceInfo | null>(null);
  const [loading, setLoading] = useState(!!commodityId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!commodityId) return;

    async function fetch() {
      setLoading(true);
      setError(null);

      const { data: row, error: commErr } = await supabase
        .from('commodities')
        .select('id, name, category, photo, unit')
        .eq('id', commodityId!)
        .single();

      if (commErr) {
        setError(commErr.message);
        setLoading(false);
        return;
      }

      const { data: prices, error: priceErr } = await supabase
        .from('commodity_prices')
        .select('date, price')
        .eq('commodity_id', commodityId!)
        .order('date', { ascending: true });

      if (priceErr) {
        setError(priceErr.message);
        setLoading(false);
        return;
      }

      const priceToday = prices.length > 0 ? prices[prices.length - 1].price : 0;
      const priceYesterday = prices.length > 1 ? prices[prices.length - 2].price : priceToday;
      const delta = priceYesterday > 0 ? ((priceToday - priceYesterday) / priceYesterday) * 100 : 0;

      setCommodity({
        id: row.id,
        name: row.name,
        category: row.category as CommodityCategory,
        photo: row.photo,
        unit: row.unit,
        priceToday,
        priceYesterday,
        deltaPercent: Math.round(Math.abs(delta) * 10) / 10,
        isUp: delta >= 0,
        sparkline: prices.map((p) => p.price),
        history30Days: prices.map((p) => ({ date: p.date, price: p.price })),
      });
      setLoading(false);
    }

    fetch();
  }, [commodityId]);

  return { commodity, loading, error };
}
