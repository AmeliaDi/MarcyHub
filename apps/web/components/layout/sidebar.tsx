'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'horario', label: 'Horario', icon: '📅' },
  { id: 'tareas', label: 'Tareas', icon: '✓' },
  { id: 'recursos', label: 'Recursos', icon: '📚' },
  { id: 'admin', label: 'Admin', icon: '⚙️' }
];

export function Sidebar({ isOpen, onClose, currentPage, onNavigate }: SidebarProps) {
  return (
    <>
      {/* Backdrop para móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden',
              isOpen ? 'pointer-events-auto' : 'pointer-events-none'
            )}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar with glassmorphism */}
      <motion.aside 
        initial={false}
        animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed top-0 left-0 h-full w-64 z-50 lg:static lg:h-auto flex flex-col overflow-hidden',
          'glass-strong border-r border-white/20 dark:border-white/10'
        )}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/15 via-transparent to-transparent rounded-full blur-3xl"
          />
        </div>
        
        {/* Brand */}
        <div className="p-6 border-b border-white/10 relative z-10">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg glass-card"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="text-lg font-bold text-white">M</span>
            </motion.div>
            <div>
              <h1 className="font-display text-xl font-semibold tracking-tight gradient-text-shimmer">MarcyHub</h1>
              <p className="text-xs text-muted-foreground/70">Plataforma Estudiantil</p>
            </div>
          </motion.div>
          
          {/* Botón cerrar para móvil */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 lg:hidden text-white/70 hover:text-white glass-panel rounded-lg p-1"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
        
        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto relative z-10">
          {navigationItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              onClick={() => {
                onNavigate(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left group relative overflow-hidden',
                currentPage === item.id
                  ? 'glass-card text-white shadow-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active indicator with glow */}
              {currentPage === item.id && (
                <>
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-accent/60 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent" />
                </>
              )}
              
              <motion.span 
                className="text-lg relative z-10"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                {item.icon}
              </motion.span>
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </nav>
        
        {/* Footer del sidebar */}
        <motion.div 
          className="p-4 border-t border-white/10 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-panel rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground/60">
              v2.0 · Next.js + TypeScript
            </p>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
}
