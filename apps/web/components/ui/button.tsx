'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg relative overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:to-primary shadow-md hover:shadow-lg hover:shadow-primary/25',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
    outline: 'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:to-destructive shadow-md hover:shadow-lg hover:shadow-destructive/25',
    glass: 'glass text-foreground hover:bg-white/90 dark:hover:bg-black/60 shadow-md hover:shadow-lg'
  };
  
  const sizes = {
    sm: 'h-9 px-4 text-xs rounded-md',
    md: 'h-11 px-6 text-sm',
    lg: 'h-12 px-8 text-base rounded-xl',
    icon: 'h-10 w-10 rounded-full'
  };
  
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shine effect */}
      {variant === 'primary' && !isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
      )}
      
      {isLoading ? (
        <motion.svg 
          className="animate-spin h-4 w-4" 
          viewBox="0 0 24 24"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </motion.svg>
      ) : null}
      <span className={cn('relative z-10', isLoading ? 'ml-2' : undefined)}>{children}</span>
    </motion.button>
  );
}
