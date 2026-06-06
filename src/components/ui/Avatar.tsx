/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
  className?: string;
}

export function Avatar({
  src,
  name = '',
  size = 'md',
  isVerified = false,
  className = '',
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-body-sm',
    md: 'w-10 h-10 text-body-sm',
    lg: 'w-12 h-12 text-body-sm',
    xl: 'w-24 h-24 text-headline-md border-2 border-primary',
  };

  const initials = getInitials(name, 'JT');

  return (
    <div className={`relative ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover bg-surface-container`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold flex items-center justify-center font-jakarta`}
        >
          {initials}
        </div>
      )}
      {isVerified && (
        <span
          id="verified-identity"
          className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-0.5 flex items-center justify-center border border-surface-container-lowest"
          style={{
            width: size === 'xl' ? '22px' : '15px',
            height: size === 'xl' ? '22px' : '15px',
          }}
        >
          <Check strokeWidth={1.5} className={size === 'xl' ? 'w-3 h-3' : 'w-2 h-2'} />
        </span>
      )}
    </div>
  );
}
