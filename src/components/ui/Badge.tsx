/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'penawaran' | 'permintaan' | 'organic' | 'featured' | 'default';
  children?: React.ReactNode;
  className?: string;
  key?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseStyle =
    'inline-flex items-center justify-center text-body-sm font-bold tracking-wider px-2.5 py-1 rounded-full uppercase font-jakarta';

  const variantStyles = {
    // PENAWARAN: gold yellow background
    penawaran: 'bg-tertiary-fixed text-on-tertiary-fixed-variant border border-outline-variant/30',
    // PERMINTAAN: sage green / primary-fixed background
    permintaan: 'bg-primary-fixed text-on-primary-fixed-variant border border-outline-variant/30',
    // Organic / Premium / Certifications
    organic:
      'bg-surface-container text-on-surface border border-outline-variant text-body-sm font-medium normal-case',
    // Featured / Spotlight
    featured: 'bg-tertiary-fixed-dim text-on-tertiary-fixed font-bold',
    // Default
    default: 'bg-surface-container-high text-on-surface-variant font-medium normal-case',
  };

  return <span className={`${baseStyle} ${variantStyles[variant]} ${className}`}>{children}</span>;
}
