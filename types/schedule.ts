/**
 * Type definitions for schedule-related data
 */

export interface ScheduleSlot {
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
}

export interface ScheduleFilters {
  classId?: string;
  teacherId?: string;
}

export interface ScheduleModalState {
  isOpen: boolean;
  defaultDayOfWeek?: number;
  defaultStartTime?: string;
}
