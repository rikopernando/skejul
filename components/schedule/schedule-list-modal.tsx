'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

type ScheduleSlot = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacher: {
    id: string;
    name: string;
  } | null;
  subject: {
    id: string;
    name: string;
  } | null;
  class: {
    id: string;
    name: string;
  } | null;
  room: {
    id: string;
    name: string;
  } | null;
};

type ScheduleListModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slots: ScheduleSlot[];
  onSlotSelect: (slot: ScheduleSlot) => void;
};

const slotColors = [
  { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
  { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
  { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-800' },
];

const getSlotColor = (index: number) => {
  return slotColors[index % slotColors.length];
};

export function ScheduleListModal({ open, onOpenChange, slots, onSlotSelect }: ScheduleListModalProps) {
  if (slots.length === 0) return null;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const firstSlot = slots[0];
  const dayName = dayNames[firstSlot.dayOfWeek];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedules at {firstSlot.startTime}</DialogTitle>
          <DialogDescription>
            {dayName} - {firstSlot.startTime} to {firstSlot.endTime}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {slots.map((slot, index) => {
            const colors = getSlotColor(index);
            return (
              <Card
                key={slot.id}
                className={`cursor-pointer transition-all hover:shadow-md ${colors.bg} ${colors.border} border-2`}
                onClick={() => {
                  onSlotSelect(slot);
                  onOpenChange(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Subject</div>
                      <div className="font-medium">{slot.subject?.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Class</div>
                      <div className="font-medium">{slot.class?.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Teacher</div>
                      <div className="font-medium">{slot.teacher?.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Room</div>
                      <div className="font-medium">{slot.room?.name || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {slot.startTime} - {slot.endTime}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
