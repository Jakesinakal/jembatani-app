/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const ROUTES = {
  SPLASH: '/splash',
  ONBOARDING: '/onboarding',
  LOGIN: '/login',
  REGISTER: '/register',
  BERANDA: '/beranda',
  HARGA: '/harga',
  HARGA_DETAIL: (id: string) => `/harga/${id}`,
  PESAN: '/pesan',
  PESAN_DETAIL: (id: string) => `/pesan/${id}`,
  AKUN: '/akun',
  POST_CREATE: (type: string) => `/post/create?type=${type}`,
} as const;
