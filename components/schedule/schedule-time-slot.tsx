/**
 * TimeSlot component - Renders a single time slot cell in the schedule grid
 */

import { Plus } from 'lucide-react';
import type { ScheduleSlot } from '@/types/schedule';
import { calculateSlotHeight, getSlotColor, getVisibleSlots, getSlotPosition } from '@/lib/schedule-utils';
import { SLOT_OFFSET_PX } from '@/lib/schedule-constants';

interface ScheduleTimeSlotProps {
  dayIndex: number;
  time: string;
  slotsAtTime: ScheduleSlot[];
  onCreateSlot: (dayIndex: number, time: string) => void;
  onSlotClick: (slot: ScheduleSlot) => void;
  onMoreClick: (slots: ScheduleSlot[]) => void;
}

export function ScheduleTimeSlot({
  dayIndex,
  time,
  slotsAtTime,
  onCreateSlot,
  onSlotClick,
  onMoreClick,
}: ScheduleTimeSlotProps) {
  // If there are slots starting at this time
  if (slotsAtTime.length > 0) {
    const { slotsToShow, remainingCount, hasMore } = getVisibleSlots(slotsAtTime);

    return (
      <>
        {slotsToShow.map((slot, index) => {
          const height = calculateSlotHeight(slot.startTime, slot.endTime);
          const colors = getSlotColor(index);
          const { offset, zIndex } = getSlotPosition(index, SLOT_OFFSET_PX);
          const isLastShown = index === slotsToShow.length - 1;

          return (
            <div
              key={slot.id}
              className={`mx-3 absolute p-1 border rounded ${colors.bg} ${colors.hover} ${colors.border} overflow-hidden cursor-pointer transition-colors shadow-md`}
              style={{
                height: `${height}px`,
                left: `${offset}px`,
                top: `${offset}px`,
                right: `-${offset}px`,
                zIndex,
              }}
              onClick={() => onSlotClick(slot)}
            >
              <div className="text-xs font-medium truncate">
                {slot.subject?.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {slot.teacher?.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {slot.room?.name}
              </div>

              {/* Badge for remaining schedules */}
              {isLastShown && hasMore && (
                <div
                  className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full hover:bg-primary/90 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoreClick(slotsAtTime);
                  }}
                >
                  +{remainingCount} more
                </div>
              )}
            </div>
          );
        })}

        {/* Always show + button even when there are slots */}
        <div
          className="h-16 border rounded flex items-center justify-center hover:bg-muted/50 cursor-pointer"
          onClick={() => onCreateSlot(dayIndex, time)}
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
        </div>
      </>
    );
  }

  // Empty slot - show + button
  return (
    <div
      className="h-16 border rounded flex items-center justify-center hover:bg-muted/50 cursor-pointer"
      onClick={() => onCreateSlot(dayIndex, time)}
    >
      <Plus className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
