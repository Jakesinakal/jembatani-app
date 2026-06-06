/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle =
    'inline-flex items-center justify-center font-jakarta font-semibold tracking-wide transition-all active:translate-y-px';

  const variantStyles = {
    // Primary - Deep forest, brand color
    primary:
      'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg focus:ring-2 focus:ring-primary',
    // Secondary - Warm red for action CTAs (Beli, Tawar, Penuhi)
    secondary:
      'bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-lg focus:ring-2 focus:ring-secondary',
    // Outlined - Border border-outline-variant text-primary
    outline:
      'border border-outline overflow-hidden rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container',
    // Ghost - Plain background text-on-surface
    ghost: 'text-on-surface hover:bg-surface-container-low rounded-lg',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-label-md',
    md: 'px-5 py-2.5 text-label-md',
    lg: 'px-6 py-4 text-body-md rounded-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
