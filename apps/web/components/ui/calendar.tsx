'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  className?: string;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelect(newDate);
  };

  const renderDays = () => {
    const days = [];
    const prevMonthDays = firstDayOfMonth;
    
    for (let i = 0; i < prevMonthDays; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selected && 
        selected.getDate() === day && 
        selected.getMonth() === currentMonth.getMonth() && 
        selected.getFullYear() === currentMonth.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => handleSelectDay(day)}
          className={cn(
            'h-8 w-8 text-sm rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isSelected
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'hover:bg-accent hover:text-accent-foreground'
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={cn('p-4 border rounded-lg bg-card shadow-sm', className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-base">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 w-8 text-xs font-medium text-muted-foreground flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
}
