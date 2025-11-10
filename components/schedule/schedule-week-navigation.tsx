/**
 * ScheduleWeekNavigation component - Handles week navigation controls
 */

import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { ExportScheduleButton } from './export-schedule-button';

interface ScheduleWeekNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
}

export function ScheduleWeekNavigation({
  currentDate,
  onDateChange,
  onNavigateWeek,
}: ScheduleWeekNavigationProps) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigateWeek('prev')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(date) => {
              if (date) {
                onDateChange(date);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigateWeek('next')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <ExportScheduleButton currentDate={currentDate} />
    </div>
  );
}
