'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, className, hover = false, ...props }: CardProps) {
  const baseStyles = 'bg-card text-card-foreground rounded-2xl border border-border shadow-md overflow-hidden';
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
    <div className={cn(baseStyles, hoverStyles, className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-5 border-b border-border/50', className)}>
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
    <div className={cn('px-6 py-4 border-t border-border/50 bg-muted/30', className)}>
      {children}
    </div>
  );
}
