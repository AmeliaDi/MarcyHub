'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getInitials } from '@/lib/utils';
import type { User } from '@/types';

interface TopBarProps {
  pageTitle: string;
  user: User | null;
  onMenuClick: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function TopBar({ pageTitle, user, onMenuClick, isDark, onToggleTheme }: TopBarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 flex-shrink-0 z-30 relative">
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/50 via-primary/30 to-transparent" />
      
      <div className="flex items-center gap-4 min-w-0">
        {/* Menú móvil */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden -ml-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </motion.button>
        
        {/* Título de página */}
        <motion.h2 
          key={pageTitle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-lg font-semibold truncate hidden sm:block gradient-text"
        >
          {pageTitle}
        </motion.h2>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Búsqueda desktop */}
        <motion.div 
          className="hidden md:flex items-center bg-muted/50 border border-border rounded-xl px-4 py-2 gap-2 transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20"
          whileFocus={{ scale: 1.02 }}
        >
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 outline-none text-sm w-48 placeholder:text-muted-foreground"
          />
        </motion.div>
        
        {/* Toggle tema */}
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleTheme}
          className="hidden sm:inline-flex p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-warning" />
          ) : (
            <Moon className="h-4 w-4 text-primary" />
          )}
        </motion.button>
        
        {/* Notificaciones */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative hidden sm:inline-flex p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <motion.span 
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
        
        {/* Avatar usuario */}
        {user && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1, boxShadow: '0 4px 12px rgba(11, 42, 107, 0.2)' }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-xs font-semibold border-2 border-border cursor-pointer shadow-md"
            title={user.email}
          >
            {getInitials(user.nombre || user.email)}
          </motion.div>
        )}
      </div>
    </header>
  );
}
