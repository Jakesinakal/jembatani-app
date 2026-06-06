/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

export interface PageHeaderProps {
  title: string | ReactNode;
  onBack: () => void;
  rightAction?: ReactNode;
}

export function PageHeader({ title, onBack, rightAction }: PageHeaderProps) {
  return (
    <div className="sticky top-0 bg-surface/90 backdrop-blur-md z-30 px-5 py-4 flex items-center justify-between border-b border-outline-variant/50">
      <button
        onClick={onBack}
        className="p-1.5 hover:bg-surface-container rounded-full text-primary active:scale-95 transition-all shrink-0"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <span className="font-fraunces text-body-lg font-bold text-primary">{title}</span>
      {rightAction ?? <div className="w-9 shrink-0" />}
    </div>
  );
}
