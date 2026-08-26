'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import * as React from 'react';

export interface InputProps extends Omit<HTMLMotionProps<'input'>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative">
        <motion.input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm',
            'placeholder:text-muted-foreground/70',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            'hover:border-primary/50',
            className
          )}
          ref={ref}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
