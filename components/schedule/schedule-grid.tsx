/**
 * ScheduleGrid component - Renders the main schedule grid
 */

import { useMemo } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import type { ScheduleSlot } from '@/types/schedule';
import { ScheduleTimeSlot } from './schedule-time-slot';
import { generateTimeOptions } from '@/lib/schedule-time-utils';

interface ScheduleGridProps {
  currentDate: Date;
  slots: ScheduleSlot[];
  onCreateSlot: (dayIndex: number, time: string) => void;
  onSlotClick: (slot: ScheduleSlot) => void;
  onMoreClick: (slots: ScheduleSlot[]) => void;
}

export function ScheduleGrid({
  currentDate,
  slots,
  onCreateSlot,
  onSlotClick,
  onMoreClick,
}: ScheduleGridProps) {
  // Generate days for the week
  const days = useMemo(() => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      weekDays.push(addDays(startDate, i));
    }
    return weekDays;
  }, [currentDate]);

  // Generate time slots (cached)
  const timeSlots = useMemo(() => generateTimeOptions(), []);

  // Find all slots starting at a specific day and time
  const findSlotsAtTime = (dayIndex: number, time: string): ScheduleSlot[] => {
    return slots.filter(
      slot => slot.dayOfWeek === dayIndex + 1 && slot.startTime === time
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div className="grid grid-cols-8 gap-1">
          {/* Time column header */}
          <div className="h-12"></div>

          {/* Day headers */}
          {days.map((day, index) => (
            <div
              key={index}
              className="h-12 flex flex-col items-center justify-center border rounded bg-muted/50"
            >
              <div className="text-sm font-medium">{format(day, 'EEE')}</div>
              <div className="text-xs text-muted-foreground">
                {format(day, 'MMM d')}
              </div>
            </div>
          ))}

          {/* Time slots */}
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="contents">
              <div className="h-16 flex items-center justify-center border rounded text-xs text-muted-foreground">
                {time}
              </div>
              {days.map((_, dayIndex) => (
                <div key={`${timeIndex}-${dayIndex}`} className="relative">
                  <ScheduleTimeSlot
                    dayIndex={dayIndex}
                    time={time}
                    slotsAtTime={findSlotsAtTime(dayIndex, time)}
                    onCreateSlot={onCreateSlot}
                    onSlotClick={onSlotClick}
                    onMoreClick={onMoreClick}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
