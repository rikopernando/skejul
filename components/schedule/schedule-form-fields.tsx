/**
 * ScheduleFormFields - Reusable form fields for schedule creation/editing
 *
 * This component provides all the form fields needed for schedule operations.
 * It can be used in both create and edit modes.
 */

import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClassData } from '@/hooks/use-class-data';
import { useTeacherData } from '@/hooks/use-teacher-data';
import { useSubjectData } from '@/hooks/use-subject-data';
import { useRoomData } from '@/hooks/use-room-data';
import { DAYS_OF_WEEK } from '@/lib/schedule-constants';
import { generateTimeOptions, getFilteredEndTimeOptions } from '@/lib/schedule-time-utils';

interface ScheduleFormFieldsProps {
  // Form values
  dayOfWeek?: string;
  startTime: string;
  endTime: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  roomId: string;

  // Change handlers
  onDayOfWeekChange?: (value: string) => void;
  onStartTimeChange?: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onTeacherIdChange: (value: string) => void;
  onSubjectIdChange: (value: string) => void;
  onClassIdChange: (value: string) => void;
  onRoomIdChange: (value: string) => void;

  // Mode configuration
  mode?: 'create' | 'edit';
  layout?: 'grid' | 'stacked';
}

// Generate time options once
const timeOptions = generateTimeOptions();

export function ScheduleFormFields({
  dayOfWeek,
  startTime,
  endTime,
  teacherId,
  subjectId,
  classId,
  roomId,
  onDayOfWeekChange,
  onStartTimeChange,
  onEndTimeChange,
  onTeacherIdChange,
  onSubjectIdChange,
  onClassIdChange,
  onRoomIdChange,
  mode = 'create',
  layout = 'grid',
}: ScheduleFormFieldsProps) {
  const { classes } = useClassData();
  const { teachers } = useTeacherData();
  const { subjects } = useSubjectData();
  const { rooms } = useRoomData();

  // Memoized filtered end time options
  const filteredEndTimeOptions = useMemo(
    () => getFilteredEndTimeOptions(startTime, timeOptions),
    [startTime]
  );

  const isGridLayout = layout === 'grid';
  const containerClass = isGridLayout ? 'grid grid-cols-4 items-center gap-4' : 'space-y-2';
  const labelClass = isGridLayout ? 'text-right' : '';
  const inputClass = isGridLayout ? 'col-span-3 w-full' : 'w-full';

  return (
    <div className="grid gap-4">
      {/* Day of Week - Only in create mode */}
      {mode === 'create' && onDayOfWeekChange && (
        <div className={containerClass}>
          <Label htmlFor="day" className={labelClass}>
            Day
          </Label>
          <Select value={dayOfWeek} onValueChange={onDayOfWeekChange}>
            <SelectTrigger id="day" className={inputClass}>
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
      )}

      {/* Start Time - Editable in create mode, read-only in edit mode */}
      {mode === 'create' && onStartTimeChange ? (
        <div className={containerClass}>
          <Label htmlFor="start-time" className={labelClass}>
            Start Time
          </Label>
          <Select value={startTime} onValueChange={onStartTimeChange}>
            <SelectTrigger id="start-time" className={inputClass}>
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
      ) : mode === 'edit' && !isGridLayout ? (
        <div className={containerClass}>
          <Label>Start Time</Label>
          <div className="text-sm font-medium">{startTime}</div>
        </div>
      ) : null}

      {/* End Time */}
      <div className={containerClass}>
        <Label htmlFor="end-time" className={labelClass}>
          End Time
        </Label>
        <Select
          value={endTime}
          onValueChange={onEndTimeChange}
          disabled={mode === 'create' && !startTime}
        >
          <SelectTrigger id="end-time" className={inputClass}>
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

      {/* Teacher */}
      <div className={containerClass}>
        <Label htmlFor="teacher" className={labelClass}>
          Teacher
        </Label>
        <Select value={teacherId} onValueChange={onTeacherIdChange}>
          <SelectTrigger id="teacher" className={inputClass}>
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

      {/* Subject */}
      <div className={containerClass}>
        <Label htmlFor="subject" className={labelClass}>
          Subject
        </Label>
        <Select value={subjectId} onValueChange={onSubjectIdChange}>
          <SelectTrigger id="subject" className={inputClass}>
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

      {/* Class */}
      <div className={containerClass}>
        <Label htmlFor="class" className={labelClass}>
          Class
        </Label>
        <Select value={classId} onValueChange={onClassIdChange}>
          <SelectTrigger id="class" className={inputClass}>
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

      {/* Room */}
      <div className={containerClass}>
        <Label htmlFor="room" className={labelClass}>
          Room
        </Label>
        <Select value={roomId} onValueChange={onRoomIdChange}>
          <SelectTrigger id="room" className={inputClass}>
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
  );
}
