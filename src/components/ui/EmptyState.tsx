/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
}

export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="text-center py-12 p-6 bg-surface-container-low rounded-lg border border-outline-variant/40">
      <Icon className="w-10 h-10 mx-auto text-on-surface-variant/40 mb-3" />
      <p className="font-jakarta text-body-md text-on-surface-variant font-medium">{message}</p>
    </div>
  );
}
