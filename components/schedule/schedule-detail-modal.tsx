'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { updateScheduleSlot, deleteScheduleSlot } from '@/app/actions/schedule-actions';
import { useTeacherData } from '@/hooks/use-teacher-data';
import { useSubjectData } from '@/hooks/use-subject-data';
import { useClassData } from '@/hooks/use-class-data';
import { useRoomData } from '@/hooks/use-room-data';
import { Trash2, Edit2, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

interface ScheduleDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: ScheduleSlot | null;
  onScheduleUpdated: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function ScheduleDetailModal({
  open,
  onOpenChange,
  slot,
  onScheduleUpdated,
}: ScheduleDetailModalProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state
  const [teacherId, setTeacherId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [endTime, setEndTime] = useState('');

  const { teachers } = useTeacherData();
  const { subjects } = useSubjectData();
  const { classes } = useClassData();
  const { rooms } = useRoomData();

  // Initialize form when slot changes
  useEffect(() => {
    if (slot) {
      setTeacherId(slot.teacher?.id || '');
      setSubjectId(slot.subject?.id || '');
      setClassId(slot.class?.id || '');
      setRoomId(slot.room?.id || '');
      setEndTime(slot.endTime || '');
      setIsEditing(false);
    }
  }, [slot]);

  const handleUpdate = async () => {
    if (!slot) return;

    if (!teacherId || !subjectId || !classId || !roomId || !endTime) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await updateScheduleSlot(slot.id, {
        teacherId,
        subjectId,
        classId,
        roomId,
        endTime,
      });

      toast.success('Schedule updated successfully');
      setIsEditing(false);
      onScheduleUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!slot) return;

    setLoading(true);
    try {
      await deleteScheduleSlot(slot.id);
      toast.success('Schedule deleted successfully');
      setDeleteDialogOpen(false);
      onOpenChange(false);
      onScheduleUpdated();
    } catch (error) {
      toast.error('Failed to delete schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (slot) {
      setTeacherId(slot.teacher?.id || '');
      setSubjectId(slot.subject?.id || '');
      setClassId(slot.class?.id || '');
      setRoomId(slot.room?.id || '');
      setEndTime(slot.endTime || '');
    }
    setIsEditing(false);
  };

  if (!slot) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {isEditing ? 'Edit Schedule' : 'Schedule Details'}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <DialogDescription>
              {DAYS[slot.dayOfWeek - 1]} at {slot.startTime}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              {isEditing ? (
                <Select value={subjectId} onValueChange={setSubjectId}>
                  <SelectTrigger id="subject">
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
              ) : (
                <div className="text-sm font-medium">{slot.subject?.name || '-'}</div>
              )}
            </div>

            {/* Teacher */}
            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher</Label>
              {isEditing ? (
                <Select value={teacherId} onValueChange={setTeacherId}>
                  <SelectTrigger id="teacher">
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
              ) : (
                <div className="text-sm font-medium">{slot.teacher?.name || '-'}</div>
              )}
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              {isEditing ? (
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger id="class">
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
              ) : (
                <div className="text-sm font-medium">{slot.class?.name || '-'}</div>
              )}
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              {isEditing ? (
                <Select value={roomId} onValueChange={setRoomId}>
                  <SelectTrigger id="room">
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
              ) : (
                <div className="text-sm font-medium">{slot.room?.name || '-'}</div>
              )}
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <div className="text-sm font-medium">{slot.startTime}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                {isEditing ? (
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                ) : (
                  <div className="text-sm font-medium">{slot.endTime}</div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this schedule slot for{' '}
              <span className="font-semibold">{slot.subject?.name}</span> on{' '}
              <span className="font-semibold">{DAYS[slot.dayOfWeek - 1]}</span> at{' '}
              <span className="font-semibold">{slot.startTime}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
