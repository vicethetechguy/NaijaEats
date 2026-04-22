import React from 'react';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  text: string;
  onClick?: (e?: React.MouseEvent) => void;
  style?: 'rounded orange' | 'outlined' | 'orange' | 'dark' | 'glass' | 'sage' | 'mustard';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

/**
 * Sticker-style CTA button.
 * - Bold, uppercase, ink border, hard sticker shadow that "presses in" on click.
 */
export const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  onClick,
  style = 'rounded orange',
  className = '',
  disabled,
  type = 'button',
}) => {
  const base =
    'w-full py-4 px-6 font-bold text-sm uppercase tracking-wide transition-all duration-150 ' +
    'border-[3px] border-ink rounded-2xl shadow-stk ' +
    'hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-stk-sm ' +
    'active:translate-x-1 active:translate-y-1 active:shadow-none ' +
    'disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-stk ' +
    'flex items-center justify-center';

  const variants: Record<string, string> = {
    'rounded orange': 'bg-tomato text-white',
    orange: 'bg-tomato text-white',
    sage: 'bg-sage text-white',
    mustard: 'bg-mustard text-ink',
    outlined: 'bg-card text-ink',
    dark: 'bg-ink text-cream',
    glass: 'bg-card text-ink',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, variants[style] ?? variants.orange, className)}
    >
      {text}
    </button>
  );
};

export const Badge: React.FC<{ text: string; color?: 'orange' | 'sage' | 'mustard' | 'gray' | 'ink'; className?: string }> = ({
  text,
  color = 'orange',
  className = '',
}) => {
  const colors: Record<string, string> = {
    orange: 'bg-tomato text-white',
    sage: 'bg-sage text-white',
    mustard: 'bg-mustard text-ink',
    ink: 'bg-ink text-cream',
    gray: 'bg-cream text-ink',
  };

  return (
    <span
      className={cn(
        colors[color] ?? colors.orange,
        'text-[10px] font-extrabold px-3 py-1 rounded-full border-2 border-ink uppercase tracking-wide inline-flex items-center justify-center whitespace-nowrap',
        className
      )}
    >
      {text}
    </span>
  );
};

export const SelectableChip: React.FC<{ label: string; selected: boolean; onToggle: () => void }> = ({
  label,
  selected,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className={cn(
      'px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide border-[3px] border-ink transition-all',
      selected
        ? 'bg-tomato text-white shadow-stk-sm -translate-y-0.5'
        : 'bg-card text-ink hover:bg-mustard hover:-translate-y-0.5 shadow-stk-sm'
    )}
  >
    {label}
  </button>
);

/** Sticker card wrapper used everywhere. */
export const StickerCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'button';
}> = ({ children, className, onClick, as = 'div' }) => {
  const Tag: any = as;
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'bg-card border-[3px] border-ink rounded-[28px] shadow-stk',
        onClick && 'hover:-translate-y-1 transition-transform cursor-pointer text-left w-full',
        className
      )}
    >
      {children}
    </Tag>
  );
};
