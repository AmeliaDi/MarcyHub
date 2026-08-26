'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, children, footer }: DialogProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div 
        className="relative z-50 w-full max-w-md mx-4 bg-background rounded-xl shadow-lg border animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-description' : undefined}
      >
        <div className="flex items-center justify-between p-6 border-b">
          {title && (
            <h2 id="dialog-title" className="text-lg font-semibold">{title}</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {description && (
          <p id="dialog-description" className="px-6 py-4 text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        <div className="px-6 py-4">
          {children}
        </div>
        
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
