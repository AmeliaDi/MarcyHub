'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, className, delay = 0, duration = 0.4 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, className, delay = 0, duration = 0.5 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInDown({ children, className, delay = 0, duration = 0.4 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0, duration = 0.3 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.08 }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

interface SlideInRightProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function SlideInRight({ children, isOpen, onClose, className }: SlideInRightProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed top-0 right-0 h-full w-64 bg-card shadow-2xl z-50',
              className
            )}
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
}

export function HoverCard({ children, className }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn('cursor-pointer', className)}
    >
      {children}
    </motion.div>
  );
}

interface PulseGlowProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export function PulseGlow({ children, className, active = true }: PulseGlowProps) {
  if (!active) return <>{children}</>;
  
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 0 20px rgba(11, 42, 107, 0.15)',
          '0 0 40px rgba(11, 42, 107, 0.3)',
          '0 0 20px rgba(11, 42, 107, 0.15)'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{
        backgroundPosition: ['200% 0', '-200% 0']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
      className={cn(
        'bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] rounded-md',
        className
      )}
    />
  );
}
