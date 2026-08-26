import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Vencida';
  if (diffDays === 0) return 'Para hoy';
  if (diffDays === 1) return 'Para mañana';
  if (diffDays <= 7) return `En ${diffDays} días`;
  
  return formatDate(dateString);
}

export function getSubjectColor(clave: string): string {
  const colors: Record<string, string> = {
    '306': '#0B2A6B',
    '307': '#2E86AB',
    '308': '#A23B72',
    '309': '#F18F01',
    '310': '#0d9488'
  };
  return colors[clave] || '#6B7280';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
