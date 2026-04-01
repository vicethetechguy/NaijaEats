import React from 'react';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  text: string;
  onClick?: (e?: React.MouseEvent) => void;
  style?: 'rounded orange' | 'outlined' | 'orange' | 'dark' | 'glass';
  className?: string;
  disabled?: boolean;
}

export const CTAButton: React.FC<CTAButtonProps> = ({ text, onClick, style = 'rounded orange', className = '', disabled }) => {
  const baseStyles = "w-full py-4 px-6 font-normal text-sm transition-all duration-200 active:scale-[0.97] disabled:opacity-30 flex items-center justify-center";
  
  const variants: Record<string, string> = {
    'rounded orange': "bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 border-b border-primary/40",
    'orange': "bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 shadow-sm",
    'outlined': "bg-muted/30 backdrop-blur-md border border-border text-foreground rounded-2xl hover:border-primary/50 hover:bg-muted/60",
    'dark': "bg-muted/50 backdrop-blur-xl text-foreground rounded-2xl hover:bg-muted/80 shadow-xl border border-border",
    'glass': "bg-muted/40 backdrop-blur-xl text-foreground border border-border rounded-2xl hover:bg-muted/60 shadow-2xl",
  };

  const formattedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[style], className)}
    >
      {formattedText}
    </button>
  );
};

export const Badge: React.FC<{ text: string; color?: string; className?: string }> = ({ text, color = 'orange', className = '' }) => {
  const colors = color === 'orange' 
    ? 'bg-primary/20 text-primary border-primary/20' 
    : 'bg-muted/50 backdrop-blur-md text-muted-foreground border-border';
  const formattedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  
  return (
    <span className={cn(colors, "text-[9px] font-normal px-2.5 py-1 rounded-lg border backdrop-blur-sm inline-flex items-center justify-center whitespace-nowrap", className)}>
      {formattedText}
    </span>
  );
};

export const SelectableChip: React.FC<{ label: string; selected: boolean; onToggle: () => void }> = ({ label, selected, onToggle }) => {
  const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  
  return (
    <button
      onClick={onToggle}
      className={cn(
        "px-5 py-3 rounded-2xl text-sm font-normal transition-all border backdrop-blur-md",
        selected 
          ? 'bg-primary/90 border-primary text-primary-foreground shadow-lg shadow-primary/20 translate-y-[-1px]' 
          : 'bg-muted/30 border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/60'
      )}
    >
      {formattedLabel}
    </button>
  );
};
