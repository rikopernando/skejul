'use client';

import { useState, useEffect } from 'react';
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

interface CreateScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleCreated: () => void;
  // Optional pre-filled values when clicking on calendar slot
  defaultDayOfWeek?: number;
  defaultStartTime?: string;
}

const daysOfWeek = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '7', label: 'Sunday' },
];

// Generate time options (7:00 AM to 6:00 PM in 15-minute intervals)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 7; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
};

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

  // Calculate duration in minutes between two time strings
  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes - startMinutes;
  };

  // Add minutes to a time string
  const addMinutesToTime = (time: string, minutes: number) => {
    if (!time) return '';
    const [hour, min] = time.split(':').map(Number);
    const totalMinutes = hour * 60 + min + minutes;
    const newHour = Math.floor(totalMinutes / 60);
    const newMin = totalMinutes % 60;
    return `${newHour.toString().padStart(2, '0')}:${newMin.toString().padStart(2, '0')}`;
  };

  // Get filtered end time options (only times after start time)
  const getFilteredEndTimeOptions = () => {
    if (!startTime) return timeOptions;
    return timeOptions.filter(time => time > startTime);
  };

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
    if (endTime <= startTime) {
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
              ? `Create a new schedule slot for ${daysOfWeek[defaultDayOfWeek - 1]?.label} at ${defaultStartTime}`
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
                {daysOfWeek.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
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
                {getFilteredEndTimeOptions().map((time) => (
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
