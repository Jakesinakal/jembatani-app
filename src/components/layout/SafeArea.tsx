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
      className="w-full max-w-[480px] min-h-screen mx-auto bg-surface text-on-surface shadow-2xl relative flex flex-col border-x border-outline-variant/50"
    >
      {children}
    </div>
  );
}
