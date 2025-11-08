'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { createScheduleSlot } from '@/app/actions/schedule-actions';
import { useClassData } from '@/hooks/use-class-data';
import { useTeacherData } from '@/hooks/use-teacher-data';
import { useSubjectData } from '@/hooks/use-subject-data';
import { useRoomData } from '@/hooks/use-room-data';

interface CreateScheduleSlotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayOfWeek: number;
  startTime: string;
  onScheduleCreated: () => void;
}

export function CreateScheduleSlotModal({
  open,
  onOpenChange,
  dayOfWeek,
  startTime,
  onScheduleCreated
}: CreateScheduleSlotModalProps) {
  const { toast } = useToast();
  const [teacherId, setTeacherId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { classes } = useClassData();
  const { teachers } = useTeacherData();
  const { subjects } = useSubjectData();
  const { rooms } = useRoomData();

  const handleSubmit = async () => {
    if (!teacherId || !subjectId || !classId || !roomId || !endTime) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await createScheduleSlot({
        dayOfWeek,
        startTime,
        endTime,
        teacherId,
        subjectId,
        classId,
        roomId
      });

      toast.success('Schedule slot created successfully');

      // Reset form
      setTeacherId('');
      setSubjectId('');
      setClassId('');
      setRoomId('');
      setEndTime('');

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
          <DialogTitle>Create Schedule Slot</DialogTitle>
          <DialogDescription>
            Add a new schedule slot for {startTime}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">
              Teacher
            </Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger className="col-span-3">
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
              <SelectTrigger className="col-span-3">
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
              <SelectTrigger className="col-span-3">
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
              <SelectTrigger className="col-span-3">
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-time" className="text-right">
              End Time
            </Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="col-span-3"
            />
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