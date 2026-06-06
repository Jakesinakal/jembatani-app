/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check } from 'lucide-react';

export interface VerifiedBadgeProps {
  size?: 'xs' | 'sm';
}

export function VerifiedBadge({ size = 'sm' }: VerifiedBadgeProps) {
  return (
    <span className="bg-primary text-on-primary rounded-full p-0.5 shrink-0 flex items-center justify-center">
      <Check strokeWidth={1.5} className={size === 'xs' ? 'w-1.5 h-1.5' : 'w-2 h-2'} />
    </span>
  );
}
