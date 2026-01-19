/**
 * Reusable Badge component for status indicators
 */

import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'gray';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = 'gray',
  size = 'md',
  children,
  className = '',
}: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

/**
 * Status badge specifically for member active/inactive status
 */
interface StatusBadgeProps {
  isActive: boolean;
  size?: 'sm' | 'md';
}

export function StatusBadge({ isActive, size = 'md' }: StatusBadgeProps) {
  return (
    <Badge variant={isActive ? 'success' : 'danger'} size={size}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
      {isActive ? 'Aktiv' : 'Inaktiv'}
    </Badge>
  );
}
