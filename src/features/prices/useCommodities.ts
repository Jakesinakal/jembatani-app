import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { CommodityPriceInfo, CommodityCategory } from '@/types/commodity';

interface CommodityRow {
  id: string;
  name: string;
  category: CommodityCategory;
  photo: string;
  unit: string;
}

interface PriceRow {
  commodity_id: string;
  date: string;
  price: number;
}

function buildCommodityPriceInfo(commodity: CommodityRow, prices: PriceRow[]): CommodityPriceInfo {
  const sorted = [...prices].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const priceToday = sorted.length > 0 ? sorted[sorted.length - 1].price : 0;
  const priceYesterday = sorted.length > 1 ? sorted[sorted.length - 2].price : priceToday;
  const delta = priceYesterday > 0 ? ((priceToday - priceYesterday) / priceYesterday) * 100 : 0;

  return {
    id: commodity.id,
    name: commodity.name,
    category: commodity.category,
    photo: commodity.photo,
    unit: commodity.unit,
    priceToday,
    priceYesterday,
    deltaPercent: Math.round(Math.abs(delta) * 10) / 10,
    isUp: delta >= 0,
    sparkline: sorted.map((p) => p.price),
    history30Days: sorted.map((p) => ({ date: p.date, price: p.price })),
  };
}

export function useCommodities() {
  const [commodities, setCommodities] = useState<CommodityPriceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setError(null);

      const { data: commodityRows, error: commodityErr } = await supabase
        .from('commodities')
        .select('id, name, category, photo, unit');

      if (commodityErr) {
        setError(commodityErr.message);
        setLoading(false);
        return;
      }

      const { data: priceRows, error: priceErr } = await supabase
        .from('commodity_prices')
        .select('commodity_id, date, price')
        .order('date', { ascending: true });

      if (priceErr) {
        setError(priceErr.message);
        setLoading(false);
        return;
      }

      const pricesByComm = new Map<string, PriceRow[]>();
      for (const row of priceRows) {
        const list = pricesByComm.get(row.commodity_id) ?? [];
        list.push(row);
        pricesByComm.set(row.commodity_id, list);
      }

      const result = commodityRows.map((c) =>
        buildCommodityPriceInfo(c as CommodityRow, pricesByComm.get(c.id) ?? []),
      );

      setCommodities(result);
      setLoading(false);
    }

    fetch();
  }, []);

  return { commodities, loading, error };
}
