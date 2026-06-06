/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CommodityCategory = 'SAYURAN' | 'BUAH' | 'PADI' | 'REMPAH' | 'PERKEBUNAN';

export interface CommodityPriceHistory {
  date: string;
  price: number;
}

export interface CommodityPriceInfo {
  id: string;
  name: string;
  category: CommodityCategory;
  priceToday: number;
  priceYesterday: number;
  deltaPercent: number;
  isUp: boolean;
  sparkline: number[]; // 7 points for Sparkline SVG
  history30Days: CommodityPriceHistory[];
  photo: string;
  unit: string; // e.g. "/kg" or "/karung"
}
