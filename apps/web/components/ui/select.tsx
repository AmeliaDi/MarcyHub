'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Seleccionar...', 
  className,
  disabled = false 
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
          !selectedOption && 'text-muted-foreground'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown className={cn('h-4 w-4 opacity-50 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-fade-in"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                'relative flex w-full cursor-default select-none items-center py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors duration-150',
                value === option.value && 'bg-accent text-accent-foreground font-medium'
              )}
              role="option"
              aria-selected={value === option.value}
            >
              {value === option.value && (
                <Check className="mr-2 h-4 w-4" />
              )}
              <span className={value === option.value ? 'ml-6' : undefined}>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
