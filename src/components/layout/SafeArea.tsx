/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SafeAreaProps {
  children: React.ReactNode;
}

export function SafeArea({ children }: SafeAreaProps) {
  return (
    <div
      id="safetani-container"
      className="w-[375px] max-w-[100vw] h-[812px] max-h-[100dvh] mx-auto bg-surface text-on-surface shadow-2xl relative flex flex-col overflow-hidden border border-outline-variant/50"
    >
      {children}
    </div>
  );
}
