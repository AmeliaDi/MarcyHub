'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  children: React.ReactNode;
  hover?: boolean;
  glass?: 'none' | 'card' | 'strong' | 'panel';
}

export function Card({ children, className, hover = false, glass = 'card', ...props }: CardProps) {
  const glassStyles = {
    none: '',
    card: 'glass-card',
    strong: 'glass-strong',
    panel: 'glass-panel'
  };
  
  const baseStyles = `text-card-foreground rounded-2xl border border-border/50 shadow-md overflow-hidden ${glassStyles[glass]}`;
  const hoverStyles = hover 
    ? 'transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30' 
    : '';
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(baseStyles, hoverStyles, className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={cn(baseStyles, hoverStyles, className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-5 border-b border-border/30', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('font-display text-lg font-semibold tracking-tight', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-muted-foreground mt-1', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-5', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-border/30 bg-muted/20', className)}>
      {children}
    </div>
  );
}
