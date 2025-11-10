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

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createScheduleSlot } from '@/app/actions/schedule-actions';
import { useClassData } from '@/hooks/use-class-data';
import { useTeacherData } from '@/hooks/use-teacher-data';
import { useSubjectData } from '@/hooks/use-subject-data';
import { useRoomData } from '@/hooks/use-room-data';
import { DAYS_OF_WEEK } from '@/lib/schedule-constants';
import {
  generateTimeOptions,
  calculateDuration,
  addMinutesToTime,
  isValidTimeRange,
  getFilteredEndTimeOptions,
} from '@/lib/schedule-time-utils';

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

  const { classes } = useClassData();
  const { teachers } = useTeacherData();
  const { subjects } = useSubjectData();
  const { rooms } = useRoomData();

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

  // Memoized filtered end time options
  const filteredEndTimeOptions = useMemo(
    () => getFilteredEndTimeOptions(startTime, timeOptions),
    [startTime]
  );

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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="day" className="text-right">
              Day
            </Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-time" className="text-right">
              Start Time
            </Label>
            <Select value={startTime} onValueChange={handleStartTimeChange}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-time" className="text-right">
              End Time
            </Label>
            <Select value={endTime} onValueChange={setEndTime} disabled={!startTime}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {filteredEndTimeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">
              Teacher
            </Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="class" className="text-right">
              Class
            </Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room" className="text-right">
              Room
            </Label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
