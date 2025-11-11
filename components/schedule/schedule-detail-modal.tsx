'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { updateScheduleSlot, deleteScheduleSlot } from '@/app/actions/schedule-actions';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScheduleFormFields } from './schedule-form-fields';

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
      setLoading(false);
    } catch (error) {
      toast.error('Failed to delete schedule');
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
            <div className="mt-4 flex items-center justify-between">
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

          <div className="py-0">
            {isEditing ? (
              <ScheduleFormFields
                mode="edit"
                layout="stacked"
                startTime={slot.startTime}
                endTime={endTime}
                teacherId={teacherId}
                subjectId={subjectId}
                classId={classId}
                roomId={roomId}
                onEndTimeChange={setEndTime}
                onTeacherIdChange={setTeacherId}
                onSubjectIdChange={setSubjectId}
                onClassIdChange={setClassId}
                onRoomIdChange={setRoomId}
              />
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-0">Subject</div>
                  <div className="text-sm font-medium">{slot.subject?.name || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-0">Teacher</div>
                  <div className="text-sm font-medium">{slot.teacher?.name || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-0">Class</div>
                  <div className="text-sm font-medium">{slot.class?.name || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-0">Room</div>
                  <div className="text-sm font-medium">{slot.room?.name || '-'}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground mb-0">Start Time</div>
                    <div className="text-sm font-medium">{slot.startTime}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground mb-0">End Time</div>
                    <div className="text-sm font-medium">{slot.endTime}</div>
                  </div>
                </div>
              </div>
            )}
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
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
