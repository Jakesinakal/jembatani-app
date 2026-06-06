/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  children: ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
        {label}
      </label>
      {children}
    </div>
  );
}
