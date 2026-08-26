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
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground z-50 lg:static lg:h-auto flex flex-col shadow-2xl lg:shadow-none overflow-hidden'
        )}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
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
              className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="text-lg font-bold text-white">M</span>
            </motion.div>
            <div>
              <h1 className="font-display text-xl font-semibold tracking-tight">MarcyHub</h1>
              <p className="text-xs text-white/60">Plataforma Estudiantil</p>
            </div>
          </motion.div>
          
          {/* Botón cerrar para móvil */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 lg:hidden text-white/70 hover:text-white"
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
                  ? 'bg-white/15 text-white shadow-inner'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active indicator */}
              {currentPage === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              
              <motion.span 
                className="text-lg"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                {item.icon}
              </motion.span>
              {item.label}
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
          <div className="text-xs text-white/50 text-center">
            v2.0 · Next.js + TypeScript
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
}
