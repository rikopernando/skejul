'use client';

/**
 * CreateScheduleModal - Modal for creating new schedule slots
 *
 * Features:
 * - Create schedule with all required fields
 * - Optional pre-filled day and time (when clicking calendar slot)
 * - Duration preservation when changing start time
 * - Smart end time filtering (only shows times after start time)
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { createScheduleSlot } from '@/app/actions/schedule-actions';
import { DAYS_OF_WEEK } from '@/lib/schedule-constants';
import {
  generateTimeOptions,
  calculateDuration,
  addMinutesToTime,
  isValidTimeRange,
} from '@/lib/schedule-time-utils';
import { ScheduleFormFields } from './schedule-form-fields';

interface CreateScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleCreated: () => void;
  defaultDayOfWeek?: number;
  defaultStartTime?: string;
}

// Generate time options once
const timeOptions = generateTimeOptions();

export function CreateScheduleModal({
  open,
  onOpenChange,
  onScheduleCreated,
  defaultDayOfWeek,
  defaultStartTime,
}: CreateScheduleModalProps) {
  const { toast } = useToast();
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);

  // Set default values when modal opens
  useEffect(() => {
    if (open) {
      if (defaultDayOfWeek) {
        setDayOfWeek(defaultDayOfWeek.toString());
      }
      if (defaultStartTime) {
        setStartTime(defaultStartTime);
      }
    }
  }, [open, defaultDayOfWeek, defaultStartTime]);

  // Handle start time change with duration preservation
  const handleStartTimeChange = (newStartTime: string) => {
    if (startTime && endTime) {
      // Calculate current duration
      const duration = calculateDuration(startTime, endTime);
      if (duration > 0) {
        // Apply duration to new start time
        const newEndTime = addMinutesToTime(newStartTime, duration);
        // Check if new end time exists in time options
        if (timeOptions.includes(newEndTime)) {
          setEndTime(newEndTime);
        } else {
          // If calculated end time is out of range, reset end time
          setEndTime('');
        }
      }
    }
    setStartTime(newStartTime);
  };

  const handleSubmit = async () => {
    if (!dayOfWeek || !startTime || !endTime || !teacherId || !subjectId || !classId || !roomId) {
      toast.error('Please fill all fields');
      return;
    }

    // Validate end time is after start time
    if (!isValidTimeRange(startTime, endTime)) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      await createScheduleSlot({
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
        teacherId,
        subjectId,
        classId,
        roomId
      });

      toast.success('Schedule slot created successfully');

      // Reset form
      setDayOfWeek('');
      setStartTime('');
      setEndTime('');
      setTeacherId('');
      setSubjectId('');
      setClassId('');
      setRoomId('');

      // Close modal and refresh schedule
      onOpenChange(false);
      onScheduleCreated();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to create schedule slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Schedule</DialogTitle>
          <DialogDescription>
            {defaultDayOfWeek && defaultStartTime
              ? `Create a new schedule slot for ${DAYS_OF_WEEK[defaultDayOfWeek - 1]?.label} at ${defaultStartTime}`
              : 'Create a new schedule slot by specifying day and time'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ScheduleFormFields
            mode="create"
            layout="grid"
            dayOfWeek={dayOfWeek}
            startTime={startTime}
            endTime={endTime}
            teacherId={teacherId}
            subjectId={subjectId}
            classId={classId}
            roomId={roomId}
            onDayOfWeekChange={setDayOfWeek}
            onStartTimeChange={handleStartTimeChange}
            onEndTimeChange={setEndTime}
            onTeacherIdChange={setTeacherId}
            onSubjectIdChange={setSubjectId}
            onClassIdChange={setClassId}
            onRoomIdChange={setRoomId}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
