/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PostType = 'PENAWARAN' | 'PERMINTAAN';

export interface PostAuthor {
  id: string;
  name: string;
  avatar: string;
  location: string;
  isVerified: boolean;
}

export interface Post {
  id: string;
  author: PostAuthor;
  type: PostType;
  title: string;
  price: number;
  unit: string; // e.g. "kg" or "karung" or "ton"
  minOrderRetail: string; // e.g. "1 kg"
  minOrderB2B: string; // e.g. "50 kg"
  quantityNeeded?: string; // for demand requests, e.g., "2 Ton"
  budgetPrice?: number; // for demand requests
  photoUrl: string;
  location: string;
  harvestOrNeededDate: string; // e.g., "28 Mei 2026"
  stockAvailable?: string; // e.g., "750 kg"
  certifications: string[]; // e.g., ["ORGANIK", "BEBAS PESTISIDA"]
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  hoursAgo: number; // e.g., 2 (for "2j lalu")
}
