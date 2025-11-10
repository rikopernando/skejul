'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from 'lucide-react';
import { getScheduleSlotsForWeek } from '@/app/actions/schedule-actions';
import { useClassData } from '@/hooks/use-class-data';
import { useTeacherData } from '@/hooks/use-teacher-data';
import { CreateScheduleModal } from '@/components/schedule/create-schedule-modal';
import { ScheduleDetailModal } from '@/components/schedule/schedule-detail-modal';
import { ScheduleListModal } from '@/components/schedule/schedule-list-modal';
import { useToast } from '@/components/ui/use-toast';
import { ExportScheduleButton } from '@/components/schedule/export-schedule-button';

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

export function ScheduleCalendar() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all'); // Initialize with 'all' to show all classes
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all'); // Initialize with 'all' to show all teachers
  const [loading, setLoading] = useState(true);

  // Modal state for creating new slots
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  // Modal state for viewing/editing existing slots
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);

  // Modal state for viewing list of overlapping schedules
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<ScheduleSlot[]>([]);

  const { classes, loading: classesLoading } = useClassData();
  const { teachers, loading: teachersLoading } = useTeacherData();

  // Get the start and end of the current week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate days for the week
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startDate, i));
  }

  // Generate time slots (7:00 AM to 6:00 PM)
  const timeSlots = [];
  for (let hour = 7; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // Load schedule data
  useEffect(() => {
    loadScheduleData();
  }, [currentDate, selectedClass, selectedTeacher]);

  const loadScheduleData = async () => {
    setLoading(true);
    try {
      // Build filters object
      const filters: { classId?: string; teacherId?: string } = {};

      if (selectedClass && selectedClass !== 'all') {
        filters.classId = selectedClass;
      }

      if (selectedTeacher && selectedTeacher !== 'all') {
        filters.teacherId = selectedTeacher;
      }

      const data = await getScheduleSlotsForWeek(currentDate, filters);
      setSlots(data);
    } catch (error) {
      console.error('Failed to load schedule data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? addDays(currentDate, -7) 
      : addDays(currentDate, 7);
    setCurrentDate(newDate);
  };

  // Find all slots starting at a specific day and time (for overlapping schedules)
  const findSlotsAtTime = (dayIndex: number, time: string) => {
    return slots.filter(slot =>
      slot.dayOfWeek === dayIndex + 1 &&
      slot.startTime === time
    );
  };

  // Calculate the height of a slot based on duration
  const calculateSlotHeight = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;

    // Each 30-minute slot consists of:
    // - h-16 (64px content)
    // - gap-1 (4px gap after each cell except the last)
    // Total per cell: 64 + 4 = 68px
    // For the last cell, no gap after: 64px
    // Formula: (n-1) * 68 + 64 = 68n - 4
    const slotsCount = durationMinutes / 30;
    return slotsCount * 68 - 4;
  };

  // Get the index of a time slot
  const getTimeSlotIndex = (time: string) => {
    return timeSlots.indexOf(time);
  };

  // Color palette for overlapping schedules
  const slotColors = [
    { bg: 'bg-blue-50 dark:bg-blue-900/20', hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800' },
    { bg: 'bg-green-50 dark:bg-green-900/20', hover: 'hover:bg-green-100 dark:hover:bg-green-900/30', border: 'border-green-200 dark:border-green-800' },
    { bg: 'bg-purple-50 dark:bg-purple-900/20', hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800' },
    { bg: 'bg-orange-50 dark:bg-orange-900/20', hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800' },
    { bg: 'bg-pink-50 dark:bg-pink-900/20', hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800' },
  ];

  // Get color for slot based on index
  const getSlotColor = (index: number) => {
    return slotColors[index % slotColors.length];
  };

  // Handle creating a new schedule slot
  const handleCreateSlot = (dayIndex: number, time: string) => {
    setSelectedDay(dayIndex + 1);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  // Handle clicking on an existing schedule slot
  const handleSlotClick = (slotsAtTime: ScheduleSlot[]) => {
    if (slotsAtTime.length === 1) {
      // Single schedule - open detail modal directly
      setSelectedSlot(slotsAtTime[0]);
      setIsDetailModalOpen(true);
    } else {
      // Multiple schedules - open list modal
      setSelectedSlots(slotsAtTime);
      setIsListModalOpen(true);
    }
  };

  // Handle selecting a slot from the list modal
  const handleSlotSelectFromList = (slot: ScheduleSlot) => {
    setSelectedSlot(slot);
    setIsDetailModalOpen(true);
  };

  // Handle schedule created
  const handleScheduleCreated = () => {
    loadScheduleData(); // Refresh the schedule
  };

  // Handle schedule updated/deleted
  const handleScheduleUpdated = () => {
    loadScheduleData(); // Refresh the schedule
  };

  // Render a time slot cell
  const renderTimeSlot = (dayIndex: number, time: string) => {
    const slotsAtTime = findSlotsAtTime(dayIndex, time);

    // If there are slots starting at this time
    if (slotsAtTime.length > 0) {
      // Show up to 3 schedules with offset stacking
      const slotsToShow = slotsAtTime.slice(0, 3);
      const remainingCount = slotsAtTime.length - 3;
      const hasMore = remainingCount > 0;

      return (
        <>
          {slotsToShow.map((slot, index) => {
            const height = calculateSlotHeight(slot.startTime, slot.endTime);
            const colors = getSlotColor(index);
            const offset = index * 8; // 8px offset for each subsequent slot
            const zIndex = 10 + index; // Higher z-index for slots on top
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
                  zIndex
                }}
                onClick={() => {
                  setSelectedSlot(slot);
                  setIsDetailModalOpen(true);
                }}
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

                {/* Badge for remaining schedules - show on the last visible schedule */}
                {isLastShown && hasMore && (
                  <div
                    className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full hover:bg-primary/90 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the slot's onClick
                      setSelectedSlots(slotsAtTime);
                      setIsListModalOpen(true);
                    }}
                  >
                    +{remainingCount} more
                  </div>
                )}
              </div>
            );
          })}
          {/* Always show + button even when there are slots */}
          <div className="h-16 border rounded flex items-center justify-center hover:bg-muted/50 cursor-pointer" onClick={() => handleCreateSlot(dayIndex, time)}>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </>
      );
    }

    // Always show + button to allow creating schedules even in covered time slots
    // (e.g., different teacher/class at overlapping times)
    return (
      <div className="h-16 border rounded flex items-center justify-center hover:bg-muted/50 cursor-pointer" onClick={() => handleCreateSlot(dayIndex, time)}>
        <Plus className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>
                Weekly schedule view
              </CardDescription>
            </div>
              <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setSelectedDay(undefined);
                    setSelectedTime(undefined);
                    setIsModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Schedule
                </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={currentDate}
                      onSelect={(date) => {
                        if (date) {
                          setCurrentDate(date);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <ExportScheduleButton currentDate={currentDate} />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="grid grid-cols-8 gap-1">
                  {/* Time column header */}
                  <div className="h-12"></div>
                  
                  {/* Day headers */}
                  {days.map((day, index) => (
                    <div key={index} className="h-12 flex flex-col items-center justify-center border rounded bg-muted/50">
                      <div className="text-sm font-medium">
                        {format(day, 'EEE')}
                      </div>
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
                          {renderTimeSlot(dayIndex, time)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <CreateScheduleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultDayOfWeek={selectedDay}
        defaultStartTime={selectedTime}
        onScheduleCreated={handleScheduleCreated}
      />

      <ScheduleDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        slot={selectedSlot}
        onScheduleUpdated={handleScheduleUpdated}
      />

      <ScheduleListModal
        open={isListModalOpen}
        onOpenChange={setIsListModalOpen}
        slots={selectedSlots}
        onSlotSelect={handleSlotSelectFromList}
      />
    </>
  );
}