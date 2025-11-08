'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getScheduleSlotsForWeek } from '@/app/actions/schedule-actions';
import { useClassData } from '@/hooks/use-class-data';
import { useTeacherData } from '@/hooks/use-teacher-data';
import { CreateScheduleSlotModal } from '@/components/schedule/create-schedule-slot-modal';
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
  const [selectedClass, setSelectedClass] = useState<string>(''); // Initialize with empty string
  const [selectedTeacher, setSelectedTeacher] = useState<string>(''); // Initialize with empty string
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');
  
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
      // For now, we'll fetch all slots for the week
      // In a real app, you would filter by class/teacher
      const data = await getScheduleSlotsForWeek(currentDate);
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

  // Find slot for a specific day and time
  const findSlot = (dayIndex: number, time: string) => {
    return slots.find(slot => 
      slot.dayOfWeek === dayIndex + 1 && 
      slot.startTime === time
    );
  };

  // Handle creating a new schedule slot
  const handleCreateSlot = (dayIndex: number, time: string) => {
    setSelectedDay(dayIndex + 1);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  // Handle schedule created
  const handleScheduleCreated = () => {
    loadScheduleData(); // Refresh the schedule
  };

  // Render a time slot cell
  const renderTimeSlot = (dayIndex: number, time: string) => {
    const slot = findSlot(dayIndex, time);
    
    if (slot) {
      return (
        <div className="p-1 h-16 border rounded bg-blue-50 dark:bg-blue-900/20 overflow-hidden">
          <div className="text-xs font-medium truncate">
            {slot.subject?.name}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {slot.teacher?.name}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {slot.room?.name}
          </div>
        </div>
      );
    }
    
    // Empty slot - show a button to create a new slot
    return (
      <div className="h-16 border rounded flex items-center justify-center hover:bg-muted/50 cursor-pointer"
           onClick={() => handleCreateSlot(dayIndex, time)}>
        <Plus className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>
                Weekly schedule view
              </CardDescription>
            </div>
            
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
                
                <div className="px-3 py-1 text-sm font-medium">
                  {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                </div>
                
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
                        <div key={`${timeIndex}-${dayIndex}`} className="p-1">
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
      
      <CreateScheduleSlotModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        dayOfWeek={selectedDay}
        startTime={selectedTime}
        onScheduleCreated={handleScheduleCreated}
      />
    </>
  );
}