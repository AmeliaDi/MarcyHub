'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          'transition-colors duration-200',
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';

export { Label };
